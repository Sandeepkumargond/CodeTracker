# StudManage

StudManage is a full-stack web application for managing student information. This project is organized into two main parts: a backend (Node.js/Express) and a frontend (Next.js/React).

---
---

## Project Structure

```
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
│   └── inactivityEmail.js
|
└── frontend/
    ├── app/
    │   ├── layout.js
    │   ├── page.js
    │   └── globals.css
    ├── public/
    ├── package.json
    ├── next.config.mjs
    ├── tailwindcss/
    └── .next/
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
