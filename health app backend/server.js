const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboardRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const goalRoutes = require("./routes/goalRoutes");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://healthapppro.netlify.app",
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.options("*", cors());


app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);


app.get("/", (req, res) => {
  res.send("HealthPro API is running ✅");
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));