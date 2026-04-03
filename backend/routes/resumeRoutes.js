const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadAndExtract, radarAnalysis } = require('../controllers/resumeController');

// Multer parsing configuration - storing file in memory buffer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed for resume upload.'));
    }
  }
});

// Extract text from uploaded resume
router.post('/upload', protect, upload.single('resume'), uploadAndExtract);

// Analyze extracted text against a target role
router.post('/radar-analysis', protect, radarAnalysis);

module.exports = router;
