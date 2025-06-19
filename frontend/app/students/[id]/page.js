"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart, Bar
} from "recharts";

export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [contestHistory, setContestHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [filterContestDays, setFilterContestDays] = useState(90);
  const [loading, setLoading] = useState(true);
  const [problemStats, setProblemStats] = useState(null);
  const [filterProblemsDays, setFilterProblemsDays] = useState(30);
  const [showProblems, setShowProblems] = useState(false);

  // Initial fetch of student data, contests and problems
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-student/${id}`
        );
        const data = await res.json();
        setStudent(data);
        // console.log("Student Data:", data);

        const contestRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests/${data.cf_handle}`
        );
        const contestData = await contestRes.json();
        setContestHistory(contestData.contests || []);
        // console.log("Contest History:", contestData.contests);

        const problemsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${data.cf_handle}?days=${filterProblemsDays}`
        );
        const problemsData = await problemsRes.json();
        setProblemStats(problemsData || []);
        // console.log("Problem Stats:", problemsData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch student profile", err);
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  // Fetch problems separately when filters change
  useEffect(() => {
    // console.log("Fetching problems with filter:", filterProblemsDays);
    const fetchProblems = async () => {
      try {
        // console.log("Fetching problems for:", student?.cf_handle, "Days:", filterProblemsDays);
        if (student?.cf_handle) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${student.cf_handle}?days=${filterProblemsDays}`
          );
          const data = await res.json();
          setProblemStats(data || []);
          // console.log("Problem Stats:", data);
        }
      } catch (err) {
        console.error("Failed to fetch problems", err);
        setProblemStats(null);
      }
    };

    if (showProblems && student?.cf_handle) {
      fetchProblems();
    }
  }, [showProblems, filterProblemsDays, student]);

  const changeProblemDays = (days) => {
    setFilterProblemsDays(days);
    setShowProblems(true);
  };

  // Prevent rendering until student is loaded
  if (loading || !student) {
    return <div className="p-6 text-gray-700 dark:text-white">Loading...</div>;
  }

  // Filter contests by selected days
  const now = new Date();
  const filteredContests = contestHistory.filter((contest) => {
    const contestDate = new Date(contest.time);
    const diffDays = (now - contestDate) / (1000 * 60 * 60 * 24);
    return diffDays <= filterContestDays;
  });

  const graphData = [...filteredContests]
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .map((c) => ({
      name: new Date(c.time).toLocaleDateString(),
      rating: c.newRating,
    }));

  return (
    <div className="p-4">
      {/* Basic Info */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {student.name + "'s Profile"}
        </h2>

        {student.email && (
          <p>
            <strong>Email:</strong> {student.email}
          </p>
        )}

        {student.phone && (
          <p>
            <strong>Mobile:</strong> {student.phone}
          </p>
        )}

        {student.cf_handle && (
          <p>
            <strong>CF Handle:</strong> {student.cf_handle}
          </p>
        )}

        {student.current_rating && (
          <p>
            <strong>Current Rating:</strong> {student.current_rating}
            {student.current_rank && ` (${student.current_rank})`}
          </p>
        )}

        {student.max_rating && (
          <p>
            <strong>Max Rating:</strong> {student.max_rating}
            {student.max_rank && ` (${student.max_rank})`}
          </p>
        )}

        {student.cf_contests && (
          <p>
            <strong>Contests:</strong> {student.cf_contests}
          </p>
        )}

        {student.cf_problems_solved && (
          <p>
            <strong>Problems Solved:</strong> {student.cf_problems_solved}
          </p>
        )}

        {student.cf_handle && (
          <p>
            <strong>Profile URL:</strong>{" "}
            <a
              href={`https://codeforces.com/profile/${student.cf_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              https://codeforces.com/profile/{student.cf_handle}
            </a>
          </p>
        )}
      </div>

      {/* Contest History */}
      <div className="border rounded">
        <button
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setShowStats(!showStats)}
        >
          <span>
            <MdHistory className="inline-block text-3xl" /> Contest History
          </span>
          {showStats ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </button>

        {showStats && (
          <div className="p-4 space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex gap-4">
              {[30, 90, 365].map((days) => (
                <button
                  key={days}
                  className={`px-4 py-2 rounded ${filterContestDays === days
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                  onClick={() => setFilterContestDays(days)}
                >
                  Last {days} Days
                </button>
              ))}
            </div>

            {/* Rating Graph */}
            {
              filteredContests.length > 0 ? (
                graphData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={['dataMin - 50', 'dataMax + 50']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#1f77b4" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-red-500">
                    No contest data found for selected range.
                  </p>
                )
              ) : loading ? (
                <p className="text-gray-500">Loading contest data...</p>
              ) : (
                <p className="text-gray-500">
                  No contests found in the last {filterContestDays} days.
                </p>
              )
            }


            {/* Contest List */}
            {
              filteredContests.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Contest</th>
                        <th className="px-4 py-2 border">Rank</th>
                        <th className="px-4 py-2 border">Old</th>
                        <th className="px-4 py-2 border">New</th>
                        <th className="px-4 py-2 border">Change</th>
                        <th className="px-4 py-2 border">Unsolved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContests.map((contest, index) => {
                        return (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="px-4 py-2 border">
                              {new Date(contest.time).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 border">
                              {contest.contestName}
                            </td>
                            <td className="px-4 py-2 border">{contest.rank}</td>
                            <td className="px-4 py-2 border">
                              {contest.oldRating}
                            </td>
                            <td className="px-4 py-2 border">
                              {contest.newRating}
                            </td>
                            <td
                              className={`px-4 py-2 border border-white ${contest.ratingChange >= 0
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                            >
                              {contest.ratingChange >= 0 ? "+" : ""}
                              {contest.ratingChange}
                            </td>
                            <td className="px-4 py-2 border">{contest.unsolvedProblems}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        )}
      </div>

      {/* Problem Solving Stats  */}
      <div className="border rounded mt-5">
        <button
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setShowProblems(!showProblems)}
        >
          <span>
            <MdHistory className="inline-block text-3xl" /> Problem Solving Data
          </span>
          {showProblems ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </button>

        {showProblems && (
          <div className="p-4 space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex gap-4">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  className={`px-4 py-2 rounded ${filterProblemsDays === days
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                  onClick={() => {
                    // console.log("Changing problem days to:", days);
                    setFilterProblemsDays(days)
                  }}
                >
                  Last {days} Days
                </button>
              ))}
            </div>


            {/* Problems Data */}
            {problemStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {
                    problemStats.totalProblems && (<div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Solved</p>
                      <p className="text-lg font-bold">{problemStats.totalSolved}</p>
                    </div>
                    )
                  }
                  <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                    <p className="text-lg font-bold">{problemStats.averageRating}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg/Day</p>
                    <p className="text-lg font-bold">{problemStats.averagePerDay}</p>
                  </div>
                  {
                    problemStats.mostDifficult && (
                      <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hardest Problem</p>
                        {problemStats.mostDifficult.name} ({problemStats.mostDifficult.rating})
                      </div>
                    )
                  }
                </div>

                {/* Rating Bucket Bar Chart */}
                {problemStats.ratingBuckets && Object.keys(problemStats.ratingBuckets).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Problems by Rating</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={Object.entries(problemStats.ratingBuckets).map(([rating, count]) => ({
                          rating,
                          count,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Submission Heatmap */}
                {problemStats.submissionHeatmap && Object.keys(problemStats.submissionHeatmap).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Submission Heatmap</h4>
                    <div className="grid grid-cols-7 gap-1 text-xs text-center">
                      {Array.from({ length: 90 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (89 - i));
                        const key = date.toISOString().split("T")[0];
                        const count = problemStats.submissionHeatmap[key] || 0;
                        return (
                          <div
                            key={key}
                            title={`${key}: ${count} submissions`}
                            className={`w-4 h-4 rounded ${count === 0
                                ? "bg-gray-200 dark:bg-gray-700"
                                : count < 2
                                  ? "bg-green-300"
                                  : count < 4
                                    ? "bg-green-500"
                                    : "bg-green-700"
                              }`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <p className="text-gray-500">No problem-solving data found.</p>
            )}

          </div>
        )}
      </div>
    </div >
  );
}
