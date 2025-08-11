const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB per image
});

// POST /api/upload-photos
router.post('/upload-photos', upload.array('photos', 5), (req, res) => {
  try {
    if (req.files.length < 2 || req.files.length > 5) {
      return res.status(400).json({ error: 'Please upload between 2 and 5 images' });
    }

    const photoPaths = req.files.map(file => file.path);

    // Call Python script
    const pythonScriptPath = path.join(__dirname, '../python/process_photos.py');
    const python = spawn('python', [pythonScriptPath, ...photoPaths]);

    let pythonOutput = '';
    python.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    python.on('close', (code) => {
      try {
        const { tilt_angle, processed_images } = JSON.parse(pythonOutput);

        // Return both threshold and URLs for processed images
        res.json({
          message: 'Photos processed successfully',
          tilt_angle,
          processed_images: processed_images.map(file => `http://localhost:3000/${file}`)
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process Python output' });
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
