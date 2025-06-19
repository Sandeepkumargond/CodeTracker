"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getHeatmapData } from "../../lib/dateFilter";

// Dynamically import to avoid SSR issues
const CalendarHeatmap = dynamic(() => import("react-calendar-heatmap"), {
  ssr: false,
});

import "react-calendar-heatmap/dist/styles.css";

export default function SubmissionHeatmap() {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const data = getHeatmapData(); // replace with real data
    setValues(data);
  }, []);

  return (
    <div className="overflow-x-auto">
      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={values}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.count >= 10) return "color-scale-4";
          if (value.count >= 7) return "color-scale-3";
          if (value.count >= 4) return "color-scale-2";
          if (value.count >= 1) return "color-scale-1";
          return "color-empty";
        }}
        tooltipDataAttrs={(value) => ({
          "data-tip": `${value.date}: ${value.count || 0} submissions`,
        })}
        showWeekdayLabels
      />
    </div>
  );
}
