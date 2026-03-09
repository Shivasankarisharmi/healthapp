const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    distance: { type: Number, default: 0 },
    caloriesBurned: { type: Number, required: true },
    mode: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);