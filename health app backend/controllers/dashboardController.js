const Nutrition = require("../models/Nutrition");
const Workout = require("../models/Workout");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "today" } = req.query;

    const now = new Date();
    let startDate = new Date();

    if (period === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "month") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    }

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const workouts = await Workout.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const nutritionLogs = await Nutrition.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    let caloriesBurned = 0;
    let caloriesConsumed = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    workouts.forEach((w) => { caloriesBurned += w.caloriesBurned || 0; });
    nutritionLogs.forEach((n) => {
      caloriesConsumed += n.calories || 0;
      protein += n.protein || 0;
      carbs += n.carbs || 0;
      fat += n.fat || 0;
    });

    let labels = [];
    let caloriesBurnedBreakdown = [];
    let caloriesConsumedBreakdown = [];

    if (period === "today") {
      labels = ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"];
      caloriesBurnedBreakdown = new Array(8).fill(0);
      caloriesConsumedBreakdown = new Array(8).fill(0);

      workouts.forEach((w) => {
        const hour = new Date(w.createdAt).getHours();
        const index = Math.floor(hour / 3);
        if (index >= 0 && index < 8)
          caloriesBurnedBreakdown[index] += w.caloriesBurned || 0;
      });
      nutritionLogs.forEach((n) => {
        const hour = new Date(n.createdAt).getHours();
        const index = Math.floor(hour / 3);
        if (index >= 0 && index < 8)
          caloriesConsumedBreakdown[index] += n.calories || 0;
      });

    } else if (period === "week") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      caloriesBurnedBreakdown = new Array(7).fill(0);
      caloriesConsumedBreakdown = new Array(7).fill(0);

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(dayNames[d.getDay()]);
      }

      workouts.forEach((w) => {
        const createdAt = new Date(w.createdAt);
        const diffMs = endDate - createdAt;
        const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const index = 6 - daysAgo;
        if (index >= 0 && index < 7)
          caloriesBurnedBreakdown[index] += w.caloriesBurned || 0;
      });
      nutritionLogs.forEach((n) => {
        const createdAt = new Date(n.createdAt);
        const diffMs = endDate - createdAt;
        const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const index = 6 - daysAgo;
        if (index >= 0 && index < 7)
          caloriesConsumedBreakdown[index] += n.calories || 0;
      });

    } else if (period === "month") {
      caloriesBurnedBreakdown = new Array(30).fill(0);
      caloriesConsumedBreakdown = new Array(30).fill(0);

      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
      }

      workouts.forEach((w) => {
        const createdAt = new Date(w.createdAt);
        const diffMs = endDate - createdAt;
        const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const index = 29 - daysAgo;
        if (index >= 0 && index < 30)
          caloriesBurnedBreakdown[index] += w.caloriesBurned || 0;
      });

      nutritionLogs.forEach((n) => {
        const createdAt = new Date(n.createdAt);
        const diffMs = endDate - createdAt;
        const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const index = 29 - daysAgo;
        if (index >= 0 && index < 30)
          caloriesConsumedBreakdown[index] += n.calories || 0;
      });
    }

    res.json({
      caloriesConsumed,
      caloriesBurned,
      workoutCount: workouts.length,
      macros: { protein, carbs, fat },
      labels,
      caloriesBurnedBreakdown,
      caloriesConsumedBreakdown,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
};
