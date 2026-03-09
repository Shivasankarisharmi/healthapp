const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addFood, getFoods } = require("../controllers/foodController");

router.post("/", authMiddleware, addFood);
router.get("/", authMiddleware, getFoods);

module.exports = router;