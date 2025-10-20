import express from 'express';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Upload route is working!',
    timestamp: new Date().toISOString()
  });
});

// Upload FASTA file
router.post('/', upload.single('fastaFile'), (req, res) => {
  try {
    console.log('📨 File upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Return immediate response
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId: req.fileId || 'test-id',
        fileName: req.file.originalname,
        fileSize: req.file.size,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Get upload status
router.get('/status/:fileId', (req, res) => {
  res.json({
    success: true,
    data: {
      fileId: req.params.fileId,
      status: 'completed',
      message: 'Analysis complete'
    }
  });
});

// Error handling for file uploads
router.use(handleUploadError);

export default router;
