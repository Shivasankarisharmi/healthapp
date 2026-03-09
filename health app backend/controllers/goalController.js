const Goal = require("../models/Goal");


exports.createGoal = async (req, res) => {
  try {
    const { goalType, targetValue, endDate } = req.body;

    const goal = await Goal.create({
      user: req.user.id,
      goalType,
      targetValue,
      endDate
    });

    res.status(201).json(goal);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });

    res.json(goals);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};