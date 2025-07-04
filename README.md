# CodeTracker

CodeTracker is a full-stack web application for managing student information. This project is organized into two main parts: a backend (Node.js/Express) and a frontend (Next.js).

Backend API: <a>https://codetracker-2jmx.onrender.com/</a>
<br>
frontend : <a>https://code-tracker-chi.vercel.app/</a>
---

## Project Structure



```
CodeTracker-frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── layout.tsx                # Main layout (theme provider, header/footer)
│   │   ├── page.tsx                  # Home page (redirect to /students or dashboard)
│   │   └── students/
│   │       ├── page.tsx             # Student Table View
│   │       └── [id]/
│   │           └── page.tsx         # Individual Student Profile Page
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── StudentTable.tsx
│   │   ├── StudentFormModal.tsx     # Add/Edit modal
│   │   ├── StudentProfile.tsx
│   │   ├── Charts/
│   │   │   ├── RatingGraph.tsx
│   │   │   ├── DifficultyBarChart.tsx
│   │   │   └── SubmissionHeatmap.tsx
│   │   ├── UI/
│   │   │   ├── DarkModeToggle.tsx
│   │   │   ├── FilterDropdown.tsx
│   │   │   └── ExportCSVButton.tsx
│   │
│   ├── constants/
│   │   └── dummyData.ts              # Temporary mock student/contest/problem data
│   │
│   ├── context/
│   │   └── ThemeContext.tsx          # Optional for dark/light mode
│   │
│   ├── lib/                          # Utilities
│   │   ├── csv.ts                    # CSV export logic
│   │   ├── dateFilters.ts            # Time-based filtering (7/30/90/365)
│   │   └── theme.ts                  # Theme persistence/localStorage handling
│   │
│   ├── styles/
│   │   └── globals.css               # Tailwind CSS & custom styles
│   │
│   └── types/
│       └── index.ts                  # Type definitions for Student, Contest, etc.
│
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md



.
backend/
├── config/
│   ├── models/
│   │   ├── Student.js
│   │   └── db.js
│   └── cron/
│       └── cfSync.js
├── routes/
│   ├── exportRoutes.js
│   ├── leaderboardRoutes.js
│   └── studentRoutes.js
├── utils/
    └── inactivityEmail.js

```

---
---

## Backend

- **Tech Stack:** Node.js, Express
- **Location:** `backend/`
- **Main Files:**
  - `app.js`: Express app setup.
  - `server.js`: Server entry point.
  - `config/db.js`: Database configuration.
- **Environment:** Configure environment variables in `backend/.env`.

### Getting Started (Backend)

```sh
cd backend
npm install
npm start
```

---
---

## Frontend

- **Tech Stack:** Next.js, React, Tailwind CSS
- **Location:** `frontend/`
- **Main Files:**
  - `app/layout.js`: Root layout.
  - `app/page.js`: Main page.
  - `globals.css`: Global styles.
  - `next.config.mjs`: Next.js configuration.
- **Static Assets:** Place images and other static files in `public/`.

### Getting Started (Frontend)

```sh
cd frontend
npm install
npm run dev
```

---
---
### Overview
![Screenshot 2025-06-19 205629](https://github.com/user-attachments/assets/3c3a75db-16a0-4c07-bbcb-4d4acca9cde1)
![Screenshot 2025-06-19 205657](https://github.com/user-attachments/assets/594fe91c-fc4f-4084-a633-2ca25636d547)
![image](https://github.com/user-attachments/assets/440dcba2-3677-426d-8da7-6691266f72af)

![Screenshot 2025-06-19 210009](https://github.com/user-attachments/assets/9326c983-f45f-4a7f-9b56-ca69a6fdd1f2)
![Screenshot 2025-06-19 210029](https://github.com/user-attachments/assets/abbe6b98-5372-45a1-9244-dfa42770772c)
![Screenshot 2025-06-19 210114](https://github.com/user-attachments/assets/68c9da24-3ca6-447b-be31-008fccf4ab37)





