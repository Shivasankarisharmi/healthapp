const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes      = require("./routes/authRoutes");
const workoutRoutes   = require("./routes/workoutRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const goalRoutes      = require("./routes/goalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes      = require("./routes/userRoutes");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://healthapppro.netlify.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ── Body parser ───────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));

// ── Routes ────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/workouts",  workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/goals",     goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user",      userRoutes);

app.get("/", (req, res) => res.send("HealthPro API is running ✅"));

// ── MongoDB ───────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Error:", err));

// ── Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});