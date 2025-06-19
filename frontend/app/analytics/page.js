"use client";

import RatingChart from "../../components/Charts/RatingGraph"; 
import DifficultyBarChart from "../../components/Charts/DifficultyBarChart"; 
import SubmissionHeatmap from "../../components/Charts/SubmissionHeatmap";

export default function AnalyticsPage() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <div>
        <h3 className="text-lg font-semibold mb-2">Rating Over Time</h3>
        <RatingChart />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Problem Difficulty Distribution</h3>
        <DifficultyBarChart />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Submission Activity</h3>
        <SubmissionHeatmap />
      </div>
    </div>
  );
}