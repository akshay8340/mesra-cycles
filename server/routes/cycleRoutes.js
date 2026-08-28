const express = require("express");
const router = express.Router();
const {
  addCycle,
  getCycles,
  getCycleById,
  getMyCycles,
  updateCycle,
  deleteCycle,
  getCycleContact,
} = require("../controllers/cycleController");
const { protect } = require("../middleware/authMiddleware");
const { uploadCycleMedia } = require("../middleware/uploadMiddleware");

router.get("/", getCycles);
router.get("/mine", protect, getMyCycles);
router.get("/:id", getCycleById);
router.get("/:id/contact", protect, getCycleContact);
router.post("/", protect, uploadCycleMedia, addCycle);
router.put("/:id", protect, uploadCycleMedia, updateCycle);
router.delete("/:id", protect, deleteCycle);

module.exports = router;
