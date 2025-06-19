// Utility to check if a date is within the last N days
export const isWithinDays = (dateStr, days) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

// Generate dummy submission data for heatmap
export const getHeatmapData = () => {
  const now = new Date();
  const data = [];

  for (let i = 0; i < 365; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 5), // Random submissions [0–4]
    });
  }

  return data;
};
