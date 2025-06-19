// /components
// ├── StudentTable.js              // Shows table of all students
// ├── StudentFormModal.js          // Add/Edit student modal
// ├── StudentProfile.js            // Complete profile (contest, problem stats)
// ├── Charts/
// │   ├── RatingGraph.js           // Recharts line graph
// │   ├── DifficultyBarChart.js    // Recharts bar chart
// │   └── SubmissionHeatmap.js     // Calendar heatmap
// ├── UI/
// │   ├── ExportCSVButton.js       // Export students to CSV
// │   ├── FilterDropdown.js        // 7/30/90/365 day filter
// │   └── DarkModeToggle.js        // Toggle dark/light mode
// │
// /lib
// ├── csv.js                       // Export CSV logic
// ├── dateFilter.js                // Filter helpers by time
// ├── theme.js                     // Init/toggle dark mode
// │
// /constants
// └── dummyData.js                 // Use until API is ready

// /types
// └── index.js                     // Type hints (optional if using JS)



// Type hints (optional in plain JS, useful if using JSDoc or TS support)

/**
 * @typedef {Object} Student
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} cf_handle
 * @property {number} cf_contests
 * @property {number} cf_problems_solved
 * @property {boolean} auto_email_disabled
 * @property {number} reminder_count
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} current_rank
 * @property {number} current_rating
 * @property {string} last_synced
 * @property {string} max_rank
 * @property {number} max_rating
 */
