const Food = require("../models/Food");


exports.addFood = async (req, res) => {
  try {
    const { mealType, foodName, quantity, calories, protein, carbs, fat } = req.body;

    const food = await Food.create({
      user: req.user.id,
      mealType,
      foodName,
      quantity,
      calories,
      protein,
      carbs,
      fat
    });

    res.status(201).json(food);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find({ user: req.user.id }).sort({ date: -1 });

    res.json(foods);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};