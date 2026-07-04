const User = require("../models/User");
const Cycle = require("../models/Cycle");
const Booking = require("../models/Booking");

// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalCycles = await Cycle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const completedBookings = await Booking.countDocuments({ status: "completed" });

    res.json({ totalUsers, totalCycles, totalBookings, pendingBookings, completedBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/cycles
const getAllCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find().populate("owner", "name email phone").sort({ createdAt: -1 });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/cycles/:id/approve
const toggleApproveCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });

    cycle.isApproved = !cycle.isApproved;
    await cycle.save();
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/cycles/:id
const removeCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });
    await cycle.deleteOne();
    res.json({ message: "Cycle removed by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("cycle", "title location")
      .populate("renter", "name phone")
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  toggleBlockUser,
  getAllCycles,
  toggleApproveCycle,
  removeCycle,
  getAllBookings,
};
