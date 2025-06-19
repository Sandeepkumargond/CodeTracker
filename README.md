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
