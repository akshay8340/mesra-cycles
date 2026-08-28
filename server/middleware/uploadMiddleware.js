const multer = require("multer");

// Store file in memory temporarily, then we push it to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed for the video field"), false);
    }
  } else if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB covers a short cycle video
});

// Up to 5 photos + 1 optional video per listing
const uploadCycleMedia = upload.fields([
  { name: "photos", maxCount: 5 },
  { name: "video", maxCount: 1 },
]);

module.exports = { uploadCycleMedia };
