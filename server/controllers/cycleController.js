const Cycle = require("../models/Cycle");
const Booking = require("../models/Booking");
const cloudinary = require("../config/cloudinary");

// Helper: upload a single buffer to Cloudinary, image or video
const uploadToCloudinary = (buffer, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "cycle-rental", resource_type: resourceType },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    uploadStream.end(buffer);
  });
};

const uploadPhotos = async (files = []) => {
  const uploads = files.map((file) => uploadToCloudinary(file.buffer, "image"));
  const results = await Promise.all(uploads);
  return results.map((r) => r.secure_url);
};

// @route POST /api/cycles
const addCycle = async (req, res) => {
  try {
    const { listingType, title, description, pricePerHour, price, location } = req.body;
    const type = listingType === "sell" ? "sell" : "rent";

    if (!title || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    if (type === "rent" && !pricePerHour) {
      return res.status(400).json({ message: "Price per hour is required for a rent listing" });
    }
    if (type === "sell" && !price) {
      return res.status(400).json({ message: "Price is required for a sell listing" });
    }

    let photoUrls = [];
    let videoUrl = "";

    if (req.files?.photos?.length) {
      photoUrls = await uploadPhotos(req.files.photos);
    }
    if (req.files?.video?.[0]) {
      const result = await uploadToCloudinary(req.files.video[0].buffer, "video");
      videoUrl = result.secure_url;
    }

    const cycle = await Cycle.create({
      owner: req.user._id,
      listingType: type,
      title,
      description,
      pricePerHour: type === "rent" ? pricePerHour : 0,
      price: type === "sell" ? price : 0,
      location,
      photos: photoUrls,
      video: videoUrl,
    });

    res.status(201).json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/cycles?type=rent|sell  (browse live listings)
const getCycles = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isAvailable: true, isApproved: true };
    if (type === "rent" || type === "sell") filter.listingType = type;

    const cycles = await Cycle.find(filter)
      .populate("owner", "name hostel")
      .sort({ createdAt: -1 });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/cycles/:id
const getCycleById = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id).populate("owner", "name hostel");
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/cycles/mine  (listings created by logged in user)
const getMyCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/cycles/:id
const updateCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });

    if (cycle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this cycle" });
    }

    const { title, description, pricePerHour, price, location, isAvailable } = req.body;

    if (req.files?.photos?.length) {
      cycle.photos = await uploadPhotos(req.files.photos);
    }
    if (req.files?.video?.[0]) {
      const result = await uploadToCloudinary(req.files.video[0].buffer, "video");
      cycle.video = result.secure_url;
    }

    cycle.title = title ?? cycle.title;
    cycle.description = description ?? cycle.description;
    if (cycle.listingType === "rent") cycle.pricePerHour = pricePerHour ?? cycle.pricePerHour;
    if (cycle.listingType === "sell") cycle.price = price ?? cycle.price;
    cycle.location = location ?? cycle.location;
    if (isAvailable !== undefined) cycle.isAvailable = isAvailable;

    const updated = await cycle.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/cycles/:id
const deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });

    if (cycle.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this cycle" });
    }

    await cycle.deleteOne();
    res.json({ message: "Cycle removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/cycles/:id/contact
// Sell listings: any logged-in user can see the seller's contact directly.
// Rent listings: the renter only sees the owner's contact once a booking is accepted.
const getCycleContact = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id).populate("owner", "name phone hostel");
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });

    const isOwner = cycle.owner._id.toString() === req.user._id.toString();

    if (isOwner) {
      return res.json({ name: cycle.owner.name, phone: cycle.owner.phone, hostel: cycle.owner.hostel });
    }

    if (cycle.listingType === "sell") {
      return res.json({ name: cycle.owner.name, phone: cycle.owner.phone, hostel: cycle.owner.hostel });
    }

    // Rent listing — require an accepted/completed booking by this renter for this cycle
    const hasAccess = await Booking.exists({
      cycle: cycle._id,
      renter: req.user._id,
      status: { $in: ["accepted", "completed"] },
    });

    if (!hasAccess) {
      return res.status(403).json({ message: "Contact details unlock once the owner accepts your booking" });
    }

    res.json({ name: cycle.owner.name, phone: cycle.owner.phone, hostel: cycle.owner.hostel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCycle,
  getCycles,
  getCycleById,
  getMyCycles,
  updateCycle,
  deleteCycle,
  getCycleContact,
};
