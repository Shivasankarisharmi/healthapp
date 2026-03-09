const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["workout", "nutrition"],
      required: true,
    },
    
    caloriesBurnedTarget: { type: Number, default: 0 },
    workoutDurationTarget: { type: Number, default: 0 },
  
    proteinTarget: { type: Number, default: 0 },
    carbsTarget: { type: Number, default: 0 },
    fatTarget: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);