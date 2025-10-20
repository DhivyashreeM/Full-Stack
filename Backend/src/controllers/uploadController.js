import { AnalysisEngine } from '../services/analysisEngine.js';
import AnalysisResult from '../models/AnalysisResult.js';
import path from 'path';
import fs from 'fs/promises';

// Background processing map to track ongoing analyses
const ongoingAnalyses = new Map();

export const uploadFastaFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a FASTA file to upload'
      });
    }

    const { fileId, fileName } = req;
    const originalName = req.file.originalname;
    const fileSize = req.file.size;
    const filePath = req.file.path;

    console.log(`📁 File uploaded: ${originalName} (${fileSize} bytes)`);

    // Validate file is not empty
    const fileStats = await fs.stat(filePath);
    if (fileStats.size === 0) {
      await fs.unlink(filePath); // Clean up empty file
      return res.status(400).json({
        error: 'Empty file',
        message: 'The uploaded file is empty'
      });
    }

    // Create analysis record in database
    const analysisRecord = new AnalysisResult({
      fileId,
      fileName,
      originalName,
      fileSize,
      status: 'pending',
      totalSequences: 0
    });

    await analysisRecord.save();

    // Start analysis in background
    processAnalysisInBackground(fileId, filePath, originalName);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId,
        fileName: originalName,
        fileSize,
        uploadDate: new Date().toISOString(),
        status: 'pending'
      }
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    next(error);
  }
};

// Enhanced background processing function
async function processAnalysisInBackground(fileId, filePath, fileName) {
  try {
    console.log(`🔍 Starting background analysis for file: ${fileName}`);
    
    // Track this analysis
    ongoingAnalyses.set(fileId, {
      startTime: Date.now(),
      status: 'processing'
    });

    // Update status to processing
    await AnalysisResult.findOneAndUpdate(
      { fileId },
      { 
        status: 'processing',
        analysisDate: new Date()
      }
    );

    const analysisEngine = new AnalysisEngine();
    
    // First validate the FASTA file
    const validation = await analysisEngine.validateFastaFile(filePath);
    if (!validation.isValid) {
      throw new Error(`Invalid FASTA file: ${validation.error}`);
    }

    console.log(`✅ FASTA file validated: ${validation.sequenceCount} sequences found`);

    // Perform full analysis
    const analysisResult = await analysisEngine.analyzeFastaFile(filePath, fileName);

    // Update with analysis results
    await AnalysisResult.findOneAndUpdate(
      { fileId },
      {
        status: 'completed',
        totalSequences: analysisResult.totalSequences,
        sequenceStats: analysisResult.sequenceStats,
        qualityMetrics: analysisResult.qualityMetrics,
        familyDistribution: analysisResult.familyDistribution,
        processingTime: analysisResult.processingTime,
        analysisDate: new Date()
      }
    );

    console.log(`✅ Analysis completed for file: ${fileName}`);
    
    // Clean up tracking
    ongoingAnalyses.delete(fileId);

    // Optional: Clean up uploaded file after successful analysis
    // await fs.unlink(filePath);

  } catch (error) {
    console.error(`❌ Background analysis failed for ${fileName}:`, error);
    
    // Update with error
    await AnalysisResult.findOneAndUpdate(
      { fileId },
      {
        status: 'failed',
        error: error.message
      }
    );

    // Clean up tracking
    ongoingAnalyses.delete(fileId);

    // Optional: Clean up uploaded file on failure
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
  }
}

export const getUploadStatus = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const analysisRecord = await AnalysisResult.findOne({ fileId });
    
    if (!analysisRecord) {
      return res.status(404).json({
        error: 'File not found',
        message: 'No analysis found with the provided file ID'
      });
    }

    // Get progress information if processing
    let progress = null;
    if (analysisRecord.status === 'processing' && ongoingAnalyses.has(fileId)) {
      const analysisInfo = ongoingAnalyses.get(fileId);
      const elapsed = Date.now() - analysisInfo.startTime;
      progress = {
        elapsedTime: elapsed,
        estimatedTimeRemaining: null, // Could be estimated based on file size
        currentStep: 'Analyzing sequences...'
      };
    }

    res.status(200).json({
      success: true,
      data: {
        fileId: analysisRecord.fileId,
        fileName: analysisRecord.originalName,
        status: analysisRecord.status,
        uploadDate: analysisRecord.uploadDate,
        analysisDate: analysisRecord.analysisDate,
        progress,
        ...(analysisRecord.status === 'completed' && {
          totalSequences: analysisRecord.totalSequences,
          processingTime: analysisRecord.processingTime
        }),
        ...(analysisRecord.status === 'failed' && {
          error: analysisRecord.error
        })
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getRecentUploads = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const recentUploads = await AnalysisResult.find()
      .sort({ uploadDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('fileId originalName uploadDate status totalSequences processingTime');

    const total = await AnalysisResult.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        uploads: recentUploads,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

export const cancelAnalysis = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const analysisRecord = await AnalysisResult.findOne({ fileId });
    
    if (!analysisRecord) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    if (analysisRecord.status !== 'processing') {
      return res.status(400).json({
        error: 'Analysis not in progress',
        message: 'Only processing analyses can be cancelled'
      });
    }

    // Update status to cancelled
    await AnalysisResult.findOneAndUpdate(
      { fileId },
      {
        status: 'failed',
        error: 'Analysis cancelled by user'
      }
    );

    // Note: We can't actually stop the background process easily
    // but we've marked it as cancelled in the database

    res.status(200).json({
      success: true,
      message: 'Analysis cancellation requested'
    });

  } catch (error) {
    next(error);
  }
};
