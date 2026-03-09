const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 100 },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    mode: {
      type: String,
      enum: ["auto", "manual"],
      default: "manual",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);