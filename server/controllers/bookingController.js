const Booking = require("../models/Booking");
const Cycle = require("../models/Cycle");
const notify = require("../utils/notify");

// Strip renter/owner phone numbers from a booking unless it's accepted/completed —
// contact details only unlock once the owner accepts the request.
const sanitizeBooking = (bookingDoc) => {
  const booking = bookingDoc.toObject();
  const contactUnlocked = ["accepted", "completed"].includes(booking.status);
  if (!contactUnlocked) {
    if (booking.owner?.phone) delete booking.owner.phone;
    if (booking.renter?.phone) delete booking.renter.phone;
  }
  return booking;
};

// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { cycleId, startTime, endTime } = req.body;

    if (!cycleId || !startTime || !endTime) {
      return res.status(400).json({ message: "Please provide cycle, start and end time" });
    }

    const cycle = await Cycle.findById(cycleId);
    if (!cycle) return res.status(404).json({ message: "Cycle not found" });

    if (cycle.listingType !== "rent") {
      return res.status(400).json({ message: "This listing is not available for rent booking" });
    }

    if (cycle.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot book your own cycle" });
    }

    if (!cycle.isAvailable) {
      return res.status(400).json({ message: "This cycle is currently not available" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const totalHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
    const totalCost = totalHours * cycle.pricePerHour;

    const booking = await Booking.create({
      cycle: cycle._id,
      renter: req.user._id,
      owner: cycle.owner,
      startTime: start,
      endTime: end,
      totalHours,
      totalCost,
    });

    await notify(
      cycle.owner,
      `${req.user.name} requested to book your cycle "${cycle.title}"`,
      "/my-bookings"
    );

    const populated = await booking.populate([
      { path: "cycle", select: "title photos location pricePerHour" },
      { path: "owner", select: "name phone" },
      { path: "renter", select: "name phone" },
    ]);

    res.status(201).json(sanitizeBooking(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bookings/my  -> bookings I made as a renter
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate("cycle", "title photos location pricePerHour")
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings.map(sanitizeBooking));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bookings/received -> booking requests for cycles I own
const getReceivedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("cycle", "title photos location pricePerHour")
      .populate("renter", "name phone")
      .sort({ createdAt: -1 });
    // Owner always sees the renter's contact once a request lands — they're the one approving it
    res.json(bookings.map((b) => b.toObject()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["accepted", "rejected", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.id).populate("cycle", "title");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isRenter = booking.renter.toString() === req.user._id.toString();

    if (!isOwner && !isRenter) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only owner can accept/reject, only renter can cancel, either can complete
    if ((status === "accepted" || status === "rejected") && !isOwner) {
      return res.status(403).json({ message: "Only the cycle owner can accept or reject" });
    }
    if (status === "cancelled" && !isRenter) {
      return res.status(403).json({ message: "Only the renter can cancel" });
    }

    booking.status = status;
    await booking.save();

    if (status === "accepted" || status === "rejected") {
      await notify(
        booking.renter,
        `Your booking for "${booking.cycle.title}" was ${status} by the owner`,
        "/my-bookings"
      );
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getReceivedBookings, updateBookingStatus };
