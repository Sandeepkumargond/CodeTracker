"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("rating");
  const [savedTheme, setSavedTheme] = useState("light");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-students`
        );
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();

    // Theme setup
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);

  const totalStudents = students.length;
  const avgContests = Math.round(
    students.reduce((sum, s) => sum + (s.cf_contests || 0), 0) / (students.length || 1)
  );
  const avgProblems = Math.round(
    students.reduce((sum, s) => sum + (s.cf_problems_solved || 0), 0) / (students.length || 1)
  );
  const minRating = Math.min(...students.map((s) => s.current_rating || 0));
  const maxRating = Math.max(...students.map((s) => s.current_rating || 0));

  const getSortedLeaderboard = () => {
    const sorted = [...students];
    switch (filter) {
      case "rating":
        return sorted.sort((a, b) => (b.current_rating || 0) - (a.current_rating || 0));
      case "problems":
        return sorted.sort((a, b) => (b.cf_problems_solved || 0) - (a.cf_problems_solved || 0));
      case "contests":
        return sorted.sort((a, b) => (b.cf_contests || 0) - (a.cf_contests || 0));
      default:
        return sorted;
    }
  };

  const sortedLeaderboard = getSortedLeaderboard();

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  const getFilterTitle = () => {
    switch (filter) {
      case "rating":
        return "🏆 Leaderboard - Highest Rating";
      case "problems":
        return "🏆 Leaderboard - Most Problems Solved";
      case "contests":
        return "🏆 Leaderboard - Most Contests";
      default:
        return "🏆 Leaderboard";
    }
  };

  // Theme-based styling
  const mainBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const cardBg = savedTheme === "dark" ? "bg-gray-800" : "bg-gray-50";


  const selectBg =
    savedTheme === "dark"
      ? "bg-gray-900 text-white border-gray-700"
      : "bg-white text-black border-gray-300";
  const tableHeadBg =
    savedTheme === "dark"
      ? "bg-gray-800 text-white"
      : "bg-gray-100 text-black";

  return (
    <div className='flex min-h-screen' >
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard title="Total Students" value={totalStudents} cardBg={cardBg} />
            <StatCard title="Min Rating" value={minRating} cardBg={cardBg} />
            <StatCard title="Max Rating" value={maxRating} cardBg={cardBg} />
            <StatCard title="Avg Contest" value={avgContests} cardBg={cardBg} />
            <StatCard title="Avg Problems Solved" value={avgProblems} cardBg={cardBg} />
          </div>

          {/* Right Side: Leaderboard */}
          <div className={`p-4 rounded-xl shadow border ${cardBg} border-gray-300 dark:border-gray-700`}>
            <div className="mb-4">
              <label className="mr-2 font-semibold">Leaderboard Filter:</label>
              <select
                className={`rounded px-3 py-2 border ${selectBg}`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="rating">Highest Rating</option>
                <option value="problems">Most Problems Solved</option>
                <option value="contests">Most Contests</option>
              </select>
            </div>

            <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              {getFilterTitle()}
            </h2>

            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm md:text-base text-center border-collapse">
                <thead className={`uppercase text-xs font-semibold ${tableHeadBg}`}>
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Handle</th>
                    <th className="p-3">Contests</th>
                    <th className="p-3">Problems</th>
                    <th className="p-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaderboard.map((s, i) => (
                    <tr
                      key={s._id || i}
                      className="border-t transition-colors"
                    >
                      <td className="p-3 font-bold">{getMedal(i)}</td>
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.cf_handle}</td>
                      <td className="p-3">{s.cf_contests || 0}</td>
                      <td className="p-3">{s.cf_problems_solved || 0}</td>
                      <td className="p-3">{s.current_rating || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Stat Card component
function StatCard({ title, value, cardBg }) {
  return (
    <div className={`rounded-xl p-5 shadow-md ${cardBg}`}>
      <div className="text-sm font-medium  ">{title}</div>
      <div className="text-3xl font-bold mt-1 ">{value}</div>
    </div>
  );
}

