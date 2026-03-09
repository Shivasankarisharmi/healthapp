const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    
    age: { type: Number, default: null },
    height: { type: Number, default: null }, 
    weight: { type: Number, default: null }, 
    goalType: {
      type: String,
      enum: ["weight_loss", "muscle_gain", "maintenance", ""],
      default: "",
    },
    profilePhoto: { type: String, default: "" }, 

    
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    dailyCalorieTarget: { type: Number, default: 2000 },
    unitWeight: { type: String, enum: ["kg", "lbs"], default: "kg" },
    unitDistance: { type: String, enum: ["km", "miles"], default: "km" },

    
    notifGoalAchieved: { type: Boolean, default: true },
    notifStreak: { type: Boolean, default: true },
    notifDailyReminder: { type: Boolean, default: false },
    notifDailyReminderTime: { type: String, default: "08:00" },
    notifWeeklySummary: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);