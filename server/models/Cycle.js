const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Cycle title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
    },
    location: {
      type: String,
      required: [true, "Pickup location is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cycle", cycleSchema);
