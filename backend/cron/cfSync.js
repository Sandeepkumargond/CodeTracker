import cron from "node-cron";
import  Student  from "../config/models/Student.js";
import axios from "axios";
import express from "express";

const router = express.Router();


// to fetch Codeforces user profile info
export async function fetchCFUserInfo(handle) {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const user = res.data.result[0];
        return {
            rating: user.rating || null,
            maxRating: user.maxRating || null,
            rank: user.rank || null,
            maxRank: user.maxRank || null
        };
    } catch (error) {
        console.error(`Error fetching user info for ${handle}:`, error.message);
        return {
            rating: null,
            maxRating: null,
            rank: null,
            maxRank: null
        };
    }
}

// to fetch contests participated by the user
export async function fetchCFContests(handle) {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
        return res.data.result.length;
    } catch (error) {
        console.error(`Error fetching contests for ${handle}:`, error.message);
        return 0;
    }
}

// to fetch solved problems
export async function fetchCFProblems(handle) {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const solvedSet = new Set();
        for (const sub of res.data.result) {
            if (sub.verdict === "OK") {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                solvedSet.add(problemId);
            }
        }
        return solvedSet.size;
    } catch (error) {
        console.error(`Error fetching problems for ${handle}:`, error.message);
        return 0;
    }
}

// Main function
async function fetchAndStoreCFDataForAllStudents() {
    try {
        const students = await Student.find();
        console.log("Found students:", students.length);

        for (const student of students) {
            const handle = student.cf_handle;
            if (!handle) continue;

            console.log(`Syncing for: ${handle}`);

            const [userInfo, contests, problems] = await Promise.all([
                fetchCFUserInfo(handle),
                fetchCFContests(handle),
                fetchCFProblems(handle)
            ]);

            console.log(`Fetched → Rating: ${userInfo.rating}, MaxRating: ${userInfo.maxRating}, Rank: ${userInfo.rank}, MaxRank: ${userInfo.maxRank}, Contests: ${contests}, Solved: ${problems}`);

            await Student.findByIdAndUpdate(student._id, {
                current_rating: userInfo.rating,
                max_rating: userInfo.maxRating,
                current_rank: userInfo.rank,
                max_rank: userInfo.maxRank,
                cf_contests: contests,
                cf_problems_solved: problems,
                last_synced: new Date()
            });

            console.log(`✅ Updated CF data for ${handle}`);
        }
    } catch (err) {
        console.error("Error in CF data sync:", err);
    }
}


let cronSchedules = ["0 2 * * *"]; // Default: daily at 2 AM
let cronTasks = [];

// Helper to start all cron jobs
function startCronTasks() {
    // Stop existing tasks
    cronTasks.forEach(task => task.stop());
    cronTasks = [];
    // Start new tasks
    for (const schedule of cronSchedules) {
        if (cron.validate(schedule)) {
            cronTasks.push(cron.schedule(schedule, fetchAndStoreCFDataForAllStudents));
        }
    }
    console.log(`Active cron schedules: ${cronSchedules.join(", ")}`);
}

// Add a new cron schedule
export function addCronSchedule(newSchedule) {
    if (!cron.validate(newSchedule)) {
        throw new Error("Invalid cron schedule");
    }
    if (!cronSchedules.includes(newSchedule)) {
        cronSchedules.push(newSchedule);
        startCronTasks();
        console.log(`Added cron schedule: ${newSchedule}`);
    }
}

// Remove a cron schedule
export function removeCronSchedule(scheduleToRemove) {
    cronSchedules = cronSchedules.filter(s => s !== scheduleToRemove);
    startCronTasks();
    console.log(`Removed cron schedule: ${scheduleToRemove}`);
}

// Set all cron schedules (replace)
export function setCronSchedules(newSchedules) {
    cronSchedules = newSchedules.filter(cron.validate);
    startCronTasks();
    console.log(`Cron schedules set to: ${cronSchedules.join(", ")}`);
}


function ampmToCron(timeStr) {
    // Example input: "2:30 PM" or "11:00 am"
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    // node-cron: "minute hour * * *"
    return `${minute} ${hour} * * *`;
}

// Add a new cron time (by AM/PM string)
router.post("/add-cf-cron", (req, res) => {
    const { time } = req.body; // { "time": "2:30 PM" }
    if (!time || typeof time !== "string") {
        return res.status(400).json({ error: "Invalid time format" });
    }
    const cronStr = ampmToCron(time);
    if (!cronStr || !cron.validate(cronStr)) {
        return res.status(400).json({ error: "Invalid time. Please use format like '2:30 PM'." });
    }
    try {
        addCronSchedule(cronStr);
        res.json({ message: `Added cron schedule: ${cronStr}`, schedules: cronSchedules });
    } catch (err) {
        res.status(500).json({ error: "Failed to add cron schedule" });
    }
});

// Remove a cron time (by AM/PM string)
router.post("/remove-cf-cron", (req, res) => {
    const { time } = req.body; // { "time": "2:30 PM" }
    if (!time || typeof time !== "string") {
        return res.status(400).json({ error: "Invalid time format" });
    }
    const cronStr = ampmToCron(time);
    if (!cronStr || !cron.validate(cronStr)) {
        return res.status(400).json({ error: "Invalid time. Please use format like '2:30 PM'." });
    }
    if (!cronSchedules.includes(cronStr)) {
        return res.status(404).json({ error: "Schedule not found" });
    }
    try {
        removeCronSchedule(cronStr);
        res.json({ message: `Removed cron schedule: ${cronStr}`, schedules: cronSchedules });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove cron schedule" });
    }
});

// List all cron schedules
router.get("/list-cf-cron", (_, res) => {
    res.json({ schedules: cronSchedules });
});

//update all schedules at once
router.post("/update-cf-cron", (req, res) => {
    const { times } = req.body; // { "times": ["2:30 PM", "5:00 AM"] }
    if (!Array.isArray(times) || times.length === 0) {
        return res.status(400).json({ error: "Invalid times array" });
    }
    const cronStrs = times.map(ampmToCron).filter(s => s && cron.validate(s));
    if (cronStrs.length !== times.length) {
        return res.status(400).json({ error: "One or more times are invalid. Use format like '2:30 PM'." });
    }
    try {
        setCronSchedules(cronStrs);
        res.json({ message: `Cron schedules updated`, schedules: cronSchedules });
    } catch (err) {
        res.status(500).json({ error: "Failed to update cron schedules" });
    }
});

// Start cron tasks on load
startCronTasks();


export { router as cfCronRouter };

// Trigger immediately for testing
fetchAndStoreCFDataForAllStudents();

export default fetchAndStoreCFDataForAllStudents;
