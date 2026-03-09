const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:                 { type: String, required: true },
    email:                { type: String, required: true, unique: true },
    password:             { type: String, required: true },
    age:                  { type: Number },
    height:               { type: Number },
    weight:               { type: Number },
    goalType:             { type: String, enum: ["weight_loss", "muscle_gain", "maintenance"] },
    profilePhoto:         { type: String },
    theme:                { type: String, default: "light" },
    dailyCalorieTarget:   { type: Number, default: 2000 },
    unitWeight:           { type: String, default: "kg" },
    unitDistance:         { type: String, default: "km" },
    notifGoalAchieved:    { type: Boolean, default: true },
    notifStreak:          { type: Boolean, default: true },
    notifDailyReminder:   { type: Boolean, default: false },
    notifDailyReminderTime: { type: String, default: "08:00" },
    notifWeeklySummary:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);