# 🏋️ HealthPro — Fitness Tracking App

A full-stack fitness tracking web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Track your workouts, nutrition, set goals, and monitor your daily progress — all in one place.

---

## 📸 Features

- 📊 **Dashboard** — Overview of calories burned, consumed, and weekly trends with charts
- 🏋️ **Workouts** — Log workouts in Auto (MET formula) or Manual mode with goal progress
- 🥗 **Nutrition** — Track meals with Auto (food database) or Manual macro entry
- 🎯 **Goals** — Set daily workout and nutrition targets
- 👤 **Profile** — Update personal info, body stats, and upload a profile photo
- ⚙️ **Settings** — Theme switcher (light/dark), calorie target, unit preferences
- 🔔 **Notifications** — Manage alerts for goals, streaks, and daily reminders
- 🔐 **Auth** — JWT-based register and login

---

## 🗂️ Project Structure

```
healthapp/
├── README.md
├── health-app-frontend/        # React + Vite + Tailwind CSS
│   └── src/
│       ├── pages/              # Dashboard, Workouts, Nutrition, Goals, Profile, Settings, Notifications
│       ├── layouts/            # MainLayout (sidebar + header)
│       ├── components/         # ProtectedRoute, SliderToggle
│       ├── context/            # ThemeContext, UserContext
│       ├── services/           # api.js (Axios instance)
│       └── main.jsx
│
└── health-app-backend/         # Node.js + Express + MongoDB
    ├── models/                 # User, Workout, Nutrition, Goal
    ├── controllers/            # auth, dashboard, user
    ├── routes/                 # auth, workouts, nutrition, goals, dashboard, user
    ├── middleware/             # authMiddleware (JWT verify)
    └── server.js
```

---

## ⚙️ Tech Stack

| Layer     | Technology                             |
|-----------|-------------------------------------   |
| Frontend  | React 18, Vite, Tailwind CSS, Chart.js |
| Backend   | Node.js, Express.js                    |
| Database  | MongoDB with Mongoose                  |
| Auth      | JWT (JSON Web Tokens), bcrypt          |
| HTTP      | Axios                                  |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/healthapp.git
cd healthapp
```

---

### 2. Backend Setup

```bash
cd health-app-backend
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthpro
JWT_SECRET=your_secret_key_here
```

Start the backend server:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd health-app-frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 API Endpoints

| Method | Endpoint                  | Description              | Auth |
|--------|---------------------------|--------------------------|------|
| POST   | /api/auth/register        | Register new user        | ❌   |
| POST   | /api/auth/login           | Login, returns JWT       | ❌   |
| GET    | /api/workouts             | Get all workouts         | ✅   |
| POST   | /api/workouts             | Add a workout            | ✅   |
| DELETE | /api/workouts/:id         | Delete a workout         | ✅   |
| GET    | /api/nutrition            | Get all food logs        | ✅   |
| POST   | /api/nutrition            | Add a food entry         | ✅   |
| DELETE | /api/nutrition/:id        | Delete a food entry      | ✅   |
| GET    | /api/goals                | Get all goals            | ✅   |
| POST   | /api/goals                | Create a goal            | ✅   |
| DELETE | /api/goals/:id            | Delete a goal            | ✅   |
| GET    | /api/dashboard            | Get dashboard data       | ✅   |
| GET    | /api/user/profile         | Get user profile         | ✅   |
| PUT    | /api/user/profile         | Update profile           | ✅   |
| PUT    | /api/user/settings        | Update settings          | ✅   |
| PUT    | /api/user/notifications   | Update notifications     | ✅   |
| DELETE | /api/user/account         | Delete account           | ✅   |

---

## 🌙 Dark Mode

Dark mode is controlled by `ThemeContext`. Clicking the theme toggle in **Settings** instantly applies the `dark` class to `<html>`, persists to `localStorage`, and saves to the backend.

---

## 📦 Environment Variables

| Variable    | Description                        |
|-------------|------------------------------------|
| PORT        | Backend port (default: 5000)       |
| MONGO_URI   | MongoDB connection string          |
| JWT_SECRET  | Secret key for signing JWT tokens  |

---