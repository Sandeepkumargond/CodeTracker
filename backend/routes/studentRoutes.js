import express from "express";
import Student from "../config/models/Student.js";
import axios from "axios";
import { fetchCFUserInfo, fetchCFContests, fetchCFProblems } from "../cron/cfSync.js"

const router = express.Router();


//////////////////////
// List of students 
////////////////////

router.get("/get-students", async (req, res) => {
    try {
        const students = await Student.find({}, 'name cf_handle current_rating max_rating email cf_contests cf_problems_solved current_rank phone');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//////////////////////////////////
/// Add student //////////////////
/////////////////////////////////

router.post("/add-student", async (req, res) => {
    try {
        const { name, email, phone, cf_handle } = req.body;
        const newStudent = new Student({
            name,
            email,
            phone,
            cf_handle
        });
        const addedStudent = await newStudent.save();
        // console.log("Added student:", addedStudent);
        const [userInfo, contests, problems] = await Promise.all([
            fetchCFUserInfo(addedStudent.cf_handle),
            fetchCFContests(addedStudent.cf_handle),
            fetchCFProblems(addedStudent.cf_handle)
        ]);
        console.log(userInfo, contests, problems);
        await Student.findByIdAndUpdate(addedStudent._id, {
            current_rating: userInfo.rating,
            max_rating: userInfo.maxRating,
            current_rank: userInfo.rank,
            max_rank: userInfo.maxRank,
            cf_contests: contests,
            cf_problems_solved: problems,
            last_synced: new Date()
        });
        res.send("✅ Student added");
    } catch (err) {
        res.status(500).send("Student Add Error: " + err.message);
    }
});


// Edit student by ID
router.put("/edit-student/:id", async (req, res) => {
    try {
        const { name, email, phone, cf_handle } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, cf_handle },
            { new: true }
        );

        const [userInfo, contests, problems] = await Promise.all([
            fetchCFUserInfo(updatedStudent.cf_handle),
            fetchCFContests(updatedStudent.cf_handle),
            fetchCFProblems(updatedStudent.cf_handle)
        ]);
        console.log(userInfo, contests, problems);
        await Student.findByIdAndUpdate(updatedStudent._id, {
            current_rating: userInfo.rating,
            max_rating: userInfo.maxRating,
            current_rank: userInfo.rank,
            max_rank: userInfo.maxRank,
            cf_contests: contests,
            cf_problems_solved: problems,
            last_synced: new Date()
        });
        if (!updatedStudent) return res.status(404).send("❌ Student not found");
        res.send("✅ Student updated");
    } catch (err) {
        res.status(500).send("Student Update Error: " + err.message);
    }
});


////////////////////////////////////
// Edit student by Codeforces handle
////////////////////////////////////
router.put("/edit-student-by-handle/:cf_handle", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updatedStudent = await Student.findOneAndUpdate(
            { cf_handle: req.params.cf_handle },
            { name, email, phone },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).send("❌ Student not found");
        res.send("✅ Student updated");
    } catch (err) {
        res.status(500).send("Student Update Error: " + err.message);
    }
});

//////////////////////////////////////
// Delete student by Codeforces handle
//////////////////////////////////////


router.delete("/delete-student-by-handle/:cf_handle", async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ cf_handle: req.params.cf_handle });
        if (!deletedStudent) return res.status(404).send("❌ Student not found");
        res.send("✅ Student deleted");
    } catch (err) {
        res.status(500).send("❌ Error: " + err.message);
    }
});


// Get student details by ID
router.get("/get-student/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: "Error fetching student" });
    }
});

///////////////////////
// Student profile view
///////////////////////

router.get("/:cf_handle", async (req, res) => {
    try {
        const student = await Student.findOne(
            { cf_handle: req.params.cf_handle },
            'name cf_handle current_rating'
        );
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: "Error fetching student" });
    }
});

///////////////////////
//// Contest history
//////////////////////
router.get("/contests/:cf_handle", async (req, res) => {
    const { cf_handle } = req.params;

    try {
        const [ratingRes, submissionsRes] = await Promise.all([
            axios.get(`https://codeforces.com/api/user.rating?handle=${cf_handle}`),
            axios.get(`https://codeforces.com/api/user.status?handle=${cf_handle}`)
        ]);

        const contests = ratingRes.data.result.map(c => ({
            contestId: c.contestId,
            contestName: c.contestName,
            rank: c.rank,
            oldRating: c.oldRating,
            newRating: c.newRating,
            ratingChange: c.newRating - c.oldRating,
            time: new Date(c.ratingUpdateTimeSeconds * 1000)
        }));

        // Build a map of solved problems by contest
        const solvedByContest = {};
        for (const sub of submissionsRes.data.result) {
            if (sub.verdict === "OK" && sub.problem && sub.problem.contestId && sub.problem.index) {
                const cid = sub.problem.contestId;
                if (!solvedByContest[cid]) solvedByContest[cid] = new Set();
                solvedByContest[cid].add(sub.problem.index);
            }
        }


        const axiosLimit = 5; // limit concurrent requests
        const contestChunks = [];
        for (let i = 0; i < contests.length; i += axiosLimit) {
            contestChunks.push(contests.slice(i, i + axiosLimit));
        }

        const contestUnsolved = {};
        for (const chunk of contestChunks) {
            // Fetch problems for this chunk in parallel
            const promises = chunk.map(contest =>
                axios.get(`https://codeforces.com/api/contest.standings?contestId=${contest.contestId}&from=1&count=1`)
                    .then(res => ({ contestId: contest.contestId, problems: res.data.result.problems || [] }))
                    .catch(() => ({ contestId: contest.contestId, problems: null }))
            );
            const results = await Promise.all(promises);
            for (const { contestId, problems } of results) {
                if (!problems) {
                    contestUnsolved[contestId] = null;
                    continue;
                }
                let unsolvedCount = 0;
                for (const prob of problems) {
                    if (!solvedByContest[contestId] || !solvedByContest[contestId].has(prob.index)) {
                        unsolvedCount++;
                    }
                }
                contestUnsolved[contestId] = unsolvedCount;
            }
        }

        const contestsWithUnsolved = contests.map(c => ({
            ...c,
            unsolvedProblems: contestUnsolved[c.contestId]
        }));

        res.json({ handle: cf_handle, contests: contestsWithUnsolved });
    } catch (error) {
        console.error("Failed to fetch contest history:", error?.response?.data || error.message);
        res.status(500).json({ error: "Unable to fetch contest data" });
    }
});




////////////////////////
/// Problem analytics
///////////////////////

router.get("/problems/:cf_handle", async (req, res) => {
    const { cf_handle } = req.params;
    let { days } = req.query;

    // Use the number of days from query, default to 30 if not provided or invalid
    days = Number(days);
    if (isNaN(days) || days <= 0) days = 30;

    try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${cf_handle}`);
        const submissions = response.data.result;

        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

        const problemMap = new Map(); // unique accepted problems
        const ratingCount = {};
        const dailyCount = {};

        let totalRating = 0;
        let mostDifficult = null;

        for (const sub of submissions) {
            if (sub.verdict !== "OK" || !sub.problem || !sub.creationTimeSeconds) continue;

            const timestamp = sub.creationTimeSeconds * 1000;
            if (timestamp < cutoff) continue;

            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            if (problemMap.has(key)) continue;

            problemMap.set(key, true);

            const rating = sub.problem.rating || 0;
            totalRating += rating;

            // Most difficult problem
            if (!mostDifficult || rating > mostDifficult.rating) {
                mostDifficult = {
                    name: sub.problem.name,
                    contestId: sub.problem.contestId,
                    index: sub.problem.index,
                    rating
                };
            }

            // Ratings bucket
            const bucket = Math.floor(rating / 100) * 100;
            ratingCount[bucket] = (ratingCount[bucket] || 0) + 1;

            // Heatmap per day
            const date = new Date(timestamp).toISOString().split("T")[0];
            dailyCount[date] = (dailyCount[date] || 0) + 1;
        }

        const totalProblems = problemMap.size;
        const avgRating = totalProblems > 0 ? totalRating / totalProblems : 0;
        const avgPerDay = totalProblems / days;

        res.json({
            handle: cf_handle,
            range: days,
            totalSolved: totalProblems,
            averageRating: avgRating.toFixed(2),
            averagePerDay: avgPerDay.toFixed(2),
            mostDifficult: mostDifficult || null,
            ratingBuckets: ratingCount,
            submissionHeatmap: dailyCount
        });

    } catch (error) {
        console.error("Error fetching submission data:", error.message);
        res.status(500).json({ error: "Unable to fetch problem data" });
    }
});

////////////////////////////////////////////////
/// Get unsolved problems for a Codeforces user
///////////////////////////////////////////////

router.get("/unsolved/:cf_handle", async (req, res) => {
    const { cf_handle } = req.params;
    try {
        const { data } = await axios.get(`https://codeforces.com/api/user.status?handle=${cf_handle}`);
        const submissions = data.result;

        const solved = new Set();
        const attempted = new Map();

        for (let sub of submissions) {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            if (!attempted.has(key)) {
                attempted.set(key, sub.problem);
            }
            if (sub.verdict === "OK") {
                solved.add(key);
            }
        }

        const failedOnly = [];
        for (let [key, prob] of attempted.entries()) {
            if (!solved.has(key)) {
                failedOnly.push(prob);
            }
        }

        res.json({
            handle: cf_handle,
            totalFailedOnly: failedOnly.length,
            failedOnlyProblems: failedOnly.slice(0, 1000)
        });
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch unsolved problems", message: err.message });
    }
});
export default router;
