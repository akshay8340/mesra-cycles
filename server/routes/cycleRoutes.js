const express = require("express");
const router = express.Router();
const {
  addCycle,
  getCycles,
  getCycleById,
  getMyCycles,
  updateCycle,
  deleteCycle,
} = require("../controllers/cycleController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getCycles);
router.get("/mine", protect, getMyCycles);
router.get("/:id", getCycleById);
router.post("/", protect, upload.single("photo"), addCycle);
router.put("/:id", protect, upload.single("photo"), updateCycle);
router.delete("/:id", protect, deleteCycle);

module.exports = router;
