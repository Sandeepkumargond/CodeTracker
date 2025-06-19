"use client";
import { useEffect, useState } from "react";
import { exportToCSV } from "../../lib/csv";

export default function ExportCSVButton({ data, columns }) {
  const [savedTheme, setSavedTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);

  return (
    <button
      onClick={() => exportToCSV(data, columns, "students")}
      className={`${
        savedTheme === "dark"
          ? "bg-black text-white"
          : "bg-white text-black"
      } px-4 py-2 rounded border border-gray-300`}
    >
      Export CSV
    </button>
  );
}