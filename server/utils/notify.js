const Notification = require("../models/Notification");

// Fire-and-forget helper — never let a notification failure break the main request
const notify = async (userId, message, link = "") => {
  try {
    await Notification.create({ user: userId, message, link });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = notify;
