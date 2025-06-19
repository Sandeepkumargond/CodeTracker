import express from "express";
import { Parser } from "json2csv";
import Student from "../config/models/Student.js";

const router = express.Router();

/////////////////////////////////////////
// Download entire student dataset as csv
/////////////////////////////////////////

router.get("/download-students-csv", async (req, res) => {
    try {
        const students = await Student.find().lean();
        const fields = ["name", "email", "phone", "cf_handle", "currentRating", "maximumRating"];
        const parser = new Parser({ fields });
        const csv = parser.parse(students);

        res.header("Content-Type", "text/csv");
        res.attachment("students.csv");
        res.send(csv);
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

export default router;