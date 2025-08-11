// routes/photoRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');

const router = express.Router();

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// POST /api/upload-photos
router.post('/upload-photos', upload.array('photos', 5), (req, res) => {
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ error: 'Please upload between 2 to 5 photos.' });
  }

  // Paths to the uploaded files
  const photoPaths = req.files.map(file => path.join(__dirname, '..', file.path));

  // Path to Python script
  const pythonScriptPath = path.join(__dirname, '../python/process_photos.py');

  // Spawn Python process
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
      const result = JSON.parse(pythonOutput);

      // Create absolute URLs for processed images
      const processedImageUrls = (result.processed_images || []).map(imgPath =>
        `${req.protocol}://${req.get('host')}/${imgPath.replace(/\\/g, '/')}`
      );

      res.json({
        flex_sensor_baseline: result.flex_sensor_baseline || null,
        gyroY_baseline: result.gyroY_baseline || null,
        gyroZ_baseline: result.gyroZ_baseline || null,
        processed_images: processedImageUrls
      });
    } catch (err) {
      console.error('JSON Parse Error:', err);
      res.status(500).json({ error: 'Failed to process posture data' });
    }
  });
});

module.exports = router;
