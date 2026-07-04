const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllUsers,
  toggleBlockUser,
  getAllCycles,
  toggleApproveCycle,
  removeCycle,
  getAllBookings,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);
router.get("/cycles", getAllCycles);
router.put("/cycles/:id/approve", toggleApproveCycle);
router.delete("/cycles/:id", removeCycle);
router.get("/bookings", getAllBookings);

module.exports = router;
