const User = require("../models/User");
const bcrypt = require("bcryptjs");


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, email, age, height, weight, goalType, profilePhoto } = req.body;

   
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(age !== undefined && { age: Number(age) }),
        ...(height !== undefined && { height: Number(height) }),
        ...(weight !== undefined && { weight: Number(weight) }),
        ...(goalType !== undefined && { goalType }),
        ...(profilePhoto !== undefined && { profilePhoto }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both fields are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateSettings = async (req, res) => {
  try {
    const { theme, dailyCalorieTarget, unitWeight, unitDistance } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(theme !== undefined && { theme }),
        ...(dailyCalorieTarget !== undefined && { dailyCalorieTarget: Number(dailyCalorieTarget) }),
        ...(unitWeight !== undefined && { unitWeight }),
        ...(unitDistance !== undefined && { unitDistance }),
      },
      { new: true }
    ).select("-password");

    res.json({ message: "Settings saved", user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateNotifications = async (req, res) => {
  try {
    const {
      notifGoalAchieved,
      notifStreak,
      notifDailyReminder,
      notifDailyReminderTime,
      notifWeeklySummary,
    } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(notifGoalAchieved !== undefined && { notifGoalAchieved }),
        ...(notifStreak !== undefined && { notifStreak }),
        ...(notifDailyReminder !== undefined && { notifDailyReminder }),
        ...(notifDailyReminderTime !== undefined && { notifDailyReminderTime }),
        ...(notifWeeklySummary !== undefined && { notifWeeklySummary }),
      },
      { new: true }
    ).select("-password");

    res.json({ message: "Notification preferences saved", user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ message: "Password is required to delete account" });

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
