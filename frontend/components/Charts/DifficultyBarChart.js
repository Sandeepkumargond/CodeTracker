"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DifficultyBarChart() {
  // Dummy data — replace with real stats if available
  const data = [
    { difficulty: "Easy", count: 120 },
    { difficulty: "Medium", count: 80 },
    { difficulty: "Hard", count: 30 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="difficulty" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#60A5FA" />
      </BarChart>
    </ResponsiveContainer>
  );
}
