"use client";
import { useState, useEffect } from "react";

const ranges = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 },
  { label: "Last 365 Days", value: 365 },
];

export default function FilterDropdown({ selected, setSelected }) {
  const [open, setOpen] = useState(false);
  const [savedTheme, setSavedTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);

  const baseBtn =
    savedTheme === "dark"
      ? "bg-black text-white border-gray-700 hover:bg-gray-800"
      : "bg-white text-black border-gray-300 hover:bg-gray-100";

  const dropdownBg =
    savedTheme === "dark"
      ? "bg-black text-white"
      : "bg-white text-black";

  const dropdownItem =
    savedTheme === "dark"
      ? "text-white hover:bg-gray-800"
      : "text-black hover:bg-gray-100";

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`inline-flex justify-center w-full rounded-md border shadow-sm px-4 py-2 text-sm font-medium ${baseBtn}`}
        >
          Filter: {selected} days
        </button>
      </div>

      {open && (
        <div
          className={`absolute z-10 mt-2 w-44 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 ${dropdownBg}`}
        >
          <div className="py-1">
            {ranges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  setSelected(range.value);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${dropdownItem}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}