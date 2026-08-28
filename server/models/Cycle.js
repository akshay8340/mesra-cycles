const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingType: {
      type: String,
      enum: ["rent", "sell"],
      default: "rent",
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
    photos: {
      type: [String],
      default: [],
    },
    video: {
      type: String,
      default: "",
    },
    // Used when listingType === "rent"
    pricePerHour: {
      type: Number,
      default: 0,
    },
    // Used when listingType === "sell"
    price: {
      type: Number,
      default: 0,
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
