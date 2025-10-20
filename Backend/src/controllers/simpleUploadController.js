import { v4 as uuidv4 } from 'uuid';
import { MemoryStorage } from '../services/memoryStorage.js';
import { AnalysisEngine } from '../services/analysisEngine.js';
import fs from 'fs/promises';

export const uploadFastaFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a FASTA file to upload'
      });
    }

    const fileId = uuidv4();
    const originalName = req.file.originalname;
    const fileSize = req.file.size;
    const filePath = req.file.path;

    console.log(`📁 File uploaded: ${originalName} (${fileSize} bytes)`);

    // Validate file is not empty
    const fileStats = await fs.stat(filePath);
    if (fileStats.size === 0) {
      await fs.unlink(filePath);
      return res.status(400).json({
        error: 'Empty file',
        message: 'The uploaded file is empty'
      });
    }

    // Start analysis in background
    processAnalysisInBackground(fileId, filePath, originalName, fileSize);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId,
        fileName: originalName,
        fileSize,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
};

// Background processing function
async function processAnalysisInBackground(fileId, filePath, fileName, fileSize) {
  try {
    console.log(`🔍 Starting analysis for: ${fileName}`);
    
    const analysisEngine = new AnalysisEngine();
    
    // Perform analysis
    const analysisResult = await analysisEngine.analyzeFastaFile(filePath, fileName);

    // Save results to memory storage
    await MemoryStorage.saveAnalysisResult(fileId, {
      fileId,
      fileName,
      originalName: fileName,
      fileSize,
      uploadDate: new Date().toISOString(),
      analysisDate: new Date().toISOString(),
      status: 'completed',
      ...analysisResult
    });

    console.log(`✅ Analysis completed for: ${fileName}`);

  } catch (error) {
    console.error(`❌ Analysis failed for ${fileName}:`, error);
    
    // Save error result
    await MemoryStorage.saveAnalysisResult(fileId, {
      fileId,
      fileName,
      originalName: fileName,
      fileSize,
      uploadDate: new Date().toISOString(),
      status: 'failed',
      error: error.message
    });
  }
}

export const getUploadStatus = async (req, res) => {
  try {
    const { fileId } = req.params;

    const analysisRecord = await MemoryStorage.getAnalysisResult(fileId);
    
    if (!analysisRecord) {
      return res.status(404).json({
        error: 'File not found',
        message: 'No analysis found with the provided file ID'
      });
    }

    res.status(200).json({
      success: true,
      data: analysisRecord
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Status check failed',
      message: error.message
    });
  }
};
