const streamifier = require("stream");
const Cycle = require("../models/Cycle");
const cloudinary = require("../config/cloudinary");

// Helper: upload buffer to cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "cycle-rental" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.Readable.from(buffer).pipe(uploadStream);
  });
};

// @route POST /api/cycles
const addCycle = async (req, res) => {
  try {
    const { title, description, pricePerHour, location } = req.body;

    if (!title || !pricePerHour || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    let photoUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const cycle = await Cycle.create({
      owner: req.user._id,
      title,
      description,
      pricePerHour,
      location,
      photo: photoUrl,
    });

    res.status(201).json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/cycles  (browse all available cycles, excludes own cycles optionally)
const getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({ isAvailable: true, isApproved: true })
      .populate("owner", "name phone hostel")
      .sort({ createdAt: -1 });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/cycles/:id
const getCycleById = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id).populate("owner", "name phone hostel");
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/cycles/mine  (cycles listed by logged in user)
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

    const { title, description, pricePerHour, location, isAvailable } = req.body;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      cycle.photo = result.secure_url;
    }

    cycle.title = title ?? cycle.title;
    cycle.description = description ?? cycle.description;
    cycle.pricePerHour = pricePerHour ?? cycle.pricePerHour;
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

module.exports = { addCycle, getCycles, getCycleById, getMyCycles, updateCycle, deleteCycle };
