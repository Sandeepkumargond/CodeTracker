"use client";
import { useState } from "react";
import StudentTable from "../../components/StudentTable";
import FilterDropdown from "../../components/UI/FilterDropdown";

export default function StudentsPage() {
  const [selectedDays, setSelectedDays] = useState(30);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Students</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <span className="text-sm">Filter:</span>
          <FilterDropdown setSelected={setSelectedDays} />
        </div>
      </div>
      <StudentTable selectedDays={selectedDays} />
    </div>
  );
}
