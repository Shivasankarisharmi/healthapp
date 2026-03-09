const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const protect = require("../middleware/authMiddleware");

const MET_VALUES = {
  running: 9.8,
  cycling: 7.5,
  walking: 3.8,
  strength: 6.0,
};


router.get("/", protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.post("/", protect, async (req, res) => {
  try {
    let { type, duration, distance, caloriesBurned, mode } = req.body;

    duration = Number(duration);
    distance = Number(distance) || 0;
    const weight = Number(req.user.weight) || 70;

    if (!type || duration <= 0) {
      return res.status(400).json({ message: "Type and duration are required" });
    }

    let finalCalories;
    if (mode === "manual") {
      finalCalories = Number(caloriesBurned);
      if (!finalCalories || finalCalories <= 0)
        return res.status(400).json({ message: "Enter valid calories for manual mode" });
    } else {
      const met = MET_VALUES[type] || 5;
      finalCalories = Math.round((met * 3.5 * weight) / 200 * duration);
    }

    const workout = await Workout.create({
      user: req.user._id,
      type,
      duration,
      distance,
      caloriesBurned: finalCalories,
      mode: mode || "auto",
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error("ADD WORKOUT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    if (workout.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });
    await workout.deleteOne();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;