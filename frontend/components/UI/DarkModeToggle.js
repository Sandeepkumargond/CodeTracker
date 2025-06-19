"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, set theme from localStorage
    const stored = localStorage.getItem("theme");
    if (stored === "1") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "1");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "0");
    }
    window.location.reload();
  };

  return (
    <button
    type="button"
      onClick={toggleTheme}
      className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}