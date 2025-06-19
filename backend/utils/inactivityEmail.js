import Student from "../config/models/Student.js";
import nodemailer from "nodemailer";
import axios from "axios";
import express from "express";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hellocollege143@gmail.com",
    pass: "bnnv adcu kdoq bhvp",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

 async function sendInactivityEmails() {
  const students = await Student.find({ auto_email_disabled: false });
  const now = Date.now() / 1000; 
  const sevenDays = 7 * 24 * 60 * 60;

  for (const student of students) {
    if (!student.cf_handle || !student.email) continue;

    try {
      const response = await axios.get(`https://codeforces.com/api/user.status?handle=${student.cf_handle}`);
      const submissions = response.data.result;

      const recentSubmission = submissions.find(sub => (now - sub.creationTimeSeconds) < sevenDays);

      if (!recentSubmission) {
        const mailOptions = {
          from: '"College Bot" <hellocollege143@gmail.com>',
          to: student.email,
          subject: "We Miss You on Codeforces!",
          text: `Hi ${student.name},\n\nIt looks like you haven't submitted any problems on Codeforces in the past week. Keep practicing to improve your skills!\n\nBest,\nYour College Team`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`📧 Sent inactivity email to ${student.email}`);
        } catch (error) {
          console.error(`❌ Failed to send email to ${student.email}:`, error.message);
        }

        student.reminder_count += 1;
        await student.save();
      }
    } catch (error) {
      console.error(`❌ Failed to fetch submissions for ${student.cf_handle}:`, error.message);
    }
  }
}

////////////////////////
//  Reminder email count
///////////////////////
router.get("/reminder-count/:id", async (req, res) => {
  try {
    const student = await Student.findById(
      req.params.id,
      "name email cf_handle reminder_count"
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      name: student.name,
      email: student.email,
      cf_handle: student.cf_handle,
      reminder_count: student.reminder_count || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reminder count" });
  }
});


//////////////////////////////////////////
// Enable/disable auto-email for a student
/////////////////////////////////////////
router.patch("/auto-email/:id", async (req, res) => {
  const { id } = req.params;
  const { disable } = req.body;

  if (typeof disable !== "boolean") {
    return res.status(400).json({ error: "`disable` must be true or false" });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    student.auto_email_disabled = disable;
    await student.save();

    res.json({
      message: `Auto email has been ${disable ? "disabled" : "enabled"} for ${student.name}`,
      auto_email_disabled: student.auto_email_disabled,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update auto email setting" });
  }
});

/////////////////////////////////////////////////
// Fetch auto email ebanbled or disabled for user
////////////////////////////////////////////////

router.get("/fetch-auto-email/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id, "name auto_email_disabled");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({
      name: student.name,
      auto_email_disabled: student.auto_email_disabled,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch auto email setting" });
  }
});

export { router, sendInactivityEmails };
