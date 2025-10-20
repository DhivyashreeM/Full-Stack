import express from 'express';
import multer from 'multer';

const router = express.Router();

// Simple memory storage for testing
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 1
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  console.log('✅ Upload test endpoint called');
  res.json({ 
    success: true,
    message: 'Upload route is working!',
    timestamp: new Date().toISOString()
  });
});

// Simple upload endpoint
router.post('/', upload.single('fastaFile'), (req, res) => {
  try {
    console.log('📨 File upload request received');
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log('✅ File received:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

    // Simulate processing delay
    setTimeout(() => {
      res.json({
        success: true,
        message: 'File uploaded successfully!',
        data: {
          fileId: 'mock-' + Date.now(),
          fileName: req.file.originalname,
          fileSize: req.file.size,
          uploadDate: new Date().toISOString(),
          status: 'completed'
        }
      });
    }, 1000);

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error.message
    });
  }
});

export default router;
