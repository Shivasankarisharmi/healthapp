const express = require("express");
const router = express.Router();
const Nutrition = require("../models/Nutrition");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const foods = await Nutrition.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.post("/", protect, async (req, res) => {
  try {
    const { foodName, quantity, calories, protein, carbs, fat, mode } = req.body;

    if (!foodName || !quantity) {
      return res.status(400).json({ message: "Food name and quantity are required" });
    }

    const food = await Nutrition.create({
      user: req.user._id,
      foodName,
      quantity: Number(quantity),
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      mode: mode || "manual",
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const food = await Nutrition.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Not found" });
    if (food.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });
    await food.deleteOne();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;