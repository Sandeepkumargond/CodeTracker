import express from "express";
import Student from "../config/models/Student.js";
import axios from "axios";


const router = express.Router();

// Top students by rating gain in last 30 days
router.get("/rating-gain", async (req, res) => {
    const students = await Student.find({}, "name cf_handle");
    const now = Date.now() / 1000;
    const thirtyDays = 30 * 24 * 60 * 60;

    const results = await Promise.all(students.map(async (student) => {
        try {
            const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${student.cf_handle}`);
            const contests = response.data.result;
            if (contests.length === 0) return { ...student.toObject(), ratingGain: 0 };

            // Find rating 30 days ago
            let rating30DaysAgo = contests[0].oldRating;
            let latestRating = contests[contests.length - 1].newRating;

            for (let i = contests.length - 1; i >= 0; i--) {
                if (now - contests[i].ratingUpdateTimeSeconds > thirtyDays) {
                    rating30DaysAgo = contests[i].newRating;
                    break;
                }
            }
            return {
                name: student.name,
                cf_handle: student.cf_handle,
                ratingGain: latestRating - rating30DaysAgo
            };
        } catch {
            return { name: student.name, cf_handle: student.cf_handle, ratingGain: 0 };
        }
    }));

    // Sort and return top 10
    results.sort((a, b) => b.ratingGain - a.ratingGain);
    res.json(results.slice(0, 10));
});

router.get("/problems-per-day", async (req, res) => {
    const students = await Student.find({}, "name cf_handle");
    const now = Date.now() / 1000;
    const thirtyDays = 30 * 24 * 60 * 60;

    const results = await Promise.all(students.map(async (student) => {
        try {
            const response = await axios.get(`https://codeforces.com/api/user.status?handle=${student.cf_handle}`);
            const submissions = response.data.result;
            // Unique problems solved in last 30 days
            const solvedSet = new Set();
            submissions.forEach(sub => {
                if (sub.verdict === "OK" && (now - sub.creationTimeSeconds) <= thirtyDays) {
                    solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
                }
            });
            return {
                name: student.name,
                cf_handle: student.cf_handle,
                perDay: solvedSet.size / 30
            };
        } catch {
            return { name: student.name, cf_handle: student.cf_handle, perDay: 0 };
        }
    }));

    // Sort and return top 10
    results.sort((a, b) => b.perDay - a.perDay);
    res.json(results.slice(0, 10));
});

export default router;
