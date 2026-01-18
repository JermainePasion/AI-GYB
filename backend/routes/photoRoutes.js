const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  upload,
  uploadPhotos,
} = require("../controllers/photoController");

const router = express.Router();

router.post(
  "/upload-photos",
  protect,
  upload.array("photos", 5),
  uploadPhotos
);

module.exports = router;
