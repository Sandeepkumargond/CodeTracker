export const exportToCSV = (data, columns, fileName = "export") => {
  if (!data || !columns) return;

  const headers = columns.map((col) => col.header).join(",");
  const rows = data.map((row) =>
    columns.map((col) => `"${row[col.key] || ""}"`).join(",")
  );

  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
