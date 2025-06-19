"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RatingGraph({ rating }) {
  const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;

  const data = [
    { name: "Day 1", rating: safeRating - 100 },
    { name: "Day 2", rating: safeRating - 60 },
    { name: "Day 3", rating: safeRating - 40 },
    { name: "Day 4", rating: safeRating - 20 },
    { name: "Today", rating: safeRating },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="rating" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
