"use client";
import { useEffect, useState } from "react";

export default function StudentFormModal({ isOpen, onClose, onSave, student }) {

    const [savedTheme, setSavedTheme] = useState("light");

  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);

  // console.log("StudentFormModal rendered with student:", student);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cf_handle: "",
    id: student ? student._id : undefined, // For update
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        cf_handle: student.cf_handle || "",
        _id: student._id || undefined, // Required for update
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        cf_handle: "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.cf_handle) {
      alert("Please fill all required fields.");
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;


const modalBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
const inputBg = savedTheme === "dark" ? "bg-black text-white border-gray-700" : "bg-white text-black border-gray-300";
const cancelBtn = savedTheme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-300 text-black hover:bg-gray-400";
const saveBtn = "bg-blue-600 text-white hover:bg-blue-700";

  return (
<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div className={`p-6 rounded shadow-lg w-full max-w-md ${modalBg}`}>
    <h2 className="text-xl font-semibold mb-4">
      {student ? "Edit Student" : "Add Student"}
    </h2>
    <div className="space-y-3">
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${inputBg}`}
      />
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${inputBg}`}
      />
      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${inputBg}`}
      />
      <input
        name="cf_handle"
        placeholder="Codeforces Handle"
        value={formData.cf_handle}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${inputBg}`}
      />
    </div>
    <div className="mt-4 flex justify-end space-x-2">
      <button
        onClick={onClose}
        className={`px-4 py-2 rounded ${cancelBtn}`}
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className={`px-4 py-2 rounded ${saveBtn}`}
      >
        Save
      </button>
    </div>
  </div>
</div>
  );
}
