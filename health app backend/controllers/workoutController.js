const Workout = require("../models/Workout");


exports.addWorkout = async (req, res) => {
  try {
    const { type, duration, distance, caloriesBurned } = req.body;

    const workout = await Workout.create({
      user: req.user.id,
      type,
      duration,
      distance,
      caloriesBurned
    });

    res.status(201).json(workout);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });

    res.json(workouts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};