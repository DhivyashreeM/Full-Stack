import express from 'express';
import { MemoryStorage } from '../services/memoryStorage.js';

const router = express.Router();

// Get analysis results
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const analysisResult = await MemoryStorage.getAnalysisResult(fileId);
    
    if (!analysisResult) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get analysis',
      message: error.message
    });
  }
});

// Get all analyses
router.get('/', async (req, res) => {
  try {
    const analyses = await MemoryStorage.getAllAnalysisResults();
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get analyses',
      message: error.message
    });
  }
});

export default router;
