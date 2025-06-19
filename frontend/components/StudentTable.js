"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ExportCSVButton from "./UI/ExportCSVButton";
import StudentFormModal from "../components/StudentFormModal";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [savedTheme, setSavedTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);

  const excludedKeys = ["_id", "__v", "cf_contests", "cf_problems_solved", "current_rank"];

  const getRatingClass = (rating) => {
    if (rating < 1200) return "text-gray-500";
    if (rating < 1400) return "text-green-500";
    if (rating < 1600) return "text-cyan-500";
    if (rating < 1900) return "text-blue-500";
    if (rating < 2100) return "text-violet-500";
    if (rating < 2300) return "text-orange-500";
    if (rating < 2400) return "text-orange-600";
    if (rating < 2600) return "text-red-500";
    if (rating < 2900) return "text-red-600";
    return "text-red-800 font-bold";
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/get-students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (student) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`${API_URL}/api/delete-student-by-handle/${student.cf_handle}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: student.id }),
        });
        fetchStudents();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleUpdate = async (updatedStudent) => {
    try {
      await fetch(`${API_URL}/api/edit-student/${updatedStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleAdd = async (newStudent) => {
    try {
      await fetch(`${API_URL}/api/add-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const openAddModal = () => {
    setSelected(null);
    setIsAddMode(true);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelected(student);
    setIsAddMode(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setIsAddMode(false);
  };

  const columns =
    students.length > 0
      ? Object.keys(students[0])
          .filter((key) => !excludedKeys.includes(key))
          .map((key) => ({
            key,
            header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          }))
      : [];

  // Conditional classes
  const mainBg = savedTheme === "dark" ? "bg-blue text-white" : "bg-white text-black";
  const tableHeadBg = savedTheme === "dark" ? "bg-blue text-white" : "bg-white text-black";
  const tableBodyBg = savedTheme === "dark" ? "bg-blue text-white" : "bg-white text-black";
  const borderColor = savedTheme === "dark" ? "border-gray-700" : "border-gray-300";
  const hoverRow = savedTheme === "dark" ? "hover:bg-gray-900" : "hover:bg-gray-100";
  const titleColor = savedTheme === "dark" ? "text-white" : "text-gray-800";

  return (
    <div className={`overflow-x-auto p-4 ${mainBg}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className={`text-2xl font-bold ${titleColor}`}>All Students</h2>
        <div className="flex gap-3">
          <ExportCSVButton data={students} columns={columns} />
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            ➕ Add Student
          </button>
        </div>
      </div>

      <div className={`border rounded-lg overflow-x-auto shadow ${borderColor}`}>
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className={tableHeadBg}>
            <tr className="text-center">
              {columns.map((col) => (
                <th key={col.key} className={`p-3 border ${borderColor}`}>
                  {col.header}
                </th>
              ))}
              <th className={`p-3 text-center border ${borderColor}`}>Actions</th>
            </tr>
          </thead>
          <tbody className={tableBodyBg}>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className={`text-center p-6 ${savedTheme === "dark" ? "text-gray-300" : "text-gray-500"}`}
                >
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student._id}
                  className={`border-t text-center transition ${hoverRow} ${borderColor}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-3 ${col.key === "cf_handle" ? getRatingClass(student.current_rating) : ""}`}
                    >
                      {student[col.key]}
                    </td>
                  ))}
                  <td className="p-3 space-x-2">
                    <Link href={`/students/${student._id}`}>
                      <button className="text-blue-500 hover:underline">View</button>
                    </Link>
                    <button onClick={() => openEditModal(student)} className="text-yellow-500 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(student)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <StudentFormModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={isAddMode ? handleAdd : handleUpdate}
          student={selected}
        />
      )}
    </div>
  );
}