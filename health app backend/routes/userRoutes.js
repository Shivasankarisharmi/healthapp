const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
  updateSettings,
  updateNotifications,
  deleteAccount,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/profile/password", protect, changePassword);


router.put("/settings", protect, updateSettings);


router.put("/notifications", protect, updateNotifications);

router.delete("/account", protect, deleteAccount);

module.exports = router;