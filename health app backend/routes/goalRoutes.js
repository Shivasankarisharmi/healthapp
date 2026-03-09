const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");
const protect = require("../middleware/authMiddleware");


router.get("/", protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.post("/", protect, async (req, res) => {
  try {
    const {
      type,
      caloriesBurnedTarget,
      workoutDurationTarget,
      proteinTarget,
      carbsTarget,
      fatTarget,
    } = req.body;

    if (!type) return res.status(400).json({ message: "Goal type is required" });

    const goal = await Goal.create({
      user: req.user._id,
      type,
      caloriesBurnedTarget: Number(caloriesBurnedTarget) || 0,
      workoutDurationTarget: Number(workoutDurationTarget) || 0,
      proteinTarget: Number(proteinTarget) || 0,
      carbsTarget: Number(carbsTarget) || 0,
      fatTarget: Number(fatTarget) || 0,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });
    await goal.deleteOne();
    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;