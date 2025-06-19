"use client";
import { useEffect, useState } from "react";
import RatingGraph from "./Charts/RatingGraph";
import DifficultyBarChart from "./Charts/DifficultyBarChart";
import SubmissionHeatmap from "./Charts/SubmissionHeatmap";

export default function StudentProfile({ student }) {
  const [savedTheme, setSavedTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);

  // Conditional classes
  const mainBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const cardBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const sectionBg = savedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  return (
    <div className={`space-y-6 ${mainBg}`}>
      <div className={`p-4 rounded ${cardBg}`}>
        <h2 className="text-2xl font-semibold mb-2">Student Profile</h2>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Codeforces Handle:</strong> {student.cf_handle}</p>
        <p><strong>Current Rating:</strong> {student.current_rating}</p>
        <p><strong>Max Rating:</strong> {student.max_rating}</p>
        <p><strong>Current Rank:</strong> {student.current_rank}</p>
        <p><strong>Max Rank:</strong> {student.max_rank}</p>
        <p><strong>Contests:</strong> {student.cf_contests}</p>
        <p><strong>Problems Solved:</strong> {student.cf_problems_solved}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`p-4 rounded shadow ${sectionBg}`}>
          <h3 className="text-lg font-medium mb-2">Rating Graph</h3>
          <RatingGraph rating={student.current_rating} />
        </div>

        <div className={`p-4 rounded shadow ${sectionBg}`}>
          <h3 className="text-lg font-medium mb-2">Difficulty Breakdown</h3>
          <DifficultyBarChart />
        </div>
      </div>

      <div className={`p-4 rounded shadow ${sectionBg}`}>
        <h3 className="text-lg font-medium mb-2">Submission Heatmap</h3>
        <SubmissionHeatmap />
      </div>
    </div>
  );
}