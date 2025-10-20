import AnalysisResult from '../models/AnalysisResult.js';
import { AnalysisEngine } from '../services/analysisEngine.js';

export const getAnalysisResults = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const analysisResult = await AnalysisResult.findOne({ fileId });
    
    if (!analysisResult) {
      return res.status(404).json({
        error: 'Analysis not found',
        message: 'No analysis results found for the provided file ID'
      });
    }

    if (analysisResult.status !== 'completed') {
      return res.status(202).json({
        success: true,
        data: {
          fileId: analysisResult.fileId,
          fileName: analysisResult.originalName,
          status: analysisResult.status,
          message: 'Analysis is still in progress',
          ...(analysisResult.status === 'processing' && {
            progress: 'Analyzing sequences...'
          }),
          ...(analysisResult.status === 'failed' && {
            error: analysisResult.error
          })
        }
      });
    }

    // Enhanced response with hierarchical data
    const response = {
      fileId: analysisResult.fileId,
      fileName: analysisResult.originalName,
      analysisDate: analysisResult.analysisDate,
      uploadDate: analysisResult.uploadDate,
      totalSequences: analysisResult.totalSequences,
      processingTime: analysisResult.processingTime,
      sequenceStats: analysisResult.sequenceStats,
      qualityMetrics: analysisResult.qualityMetrics,
      hierarchicalDistribution: analysisResult.hierarchicalDistribution,
      geographicDistribution: analysisResult.geographicDistribution,
      biodiversityIndices: analysisResult.biodiversityIndices,
      summary: {
        topKingdoms: analysisResult.hierarchicalDistribution.kingdom.slice(0, 3),
        topCountries: analysisResult.geographicDistribution.byCountry.slice(0, 3),
        qualityScore: analysisResult.qualityMetrics.qualityScore,
        speciesRichness: analysisResult.biodiversityIndices.speciesRichness
      }
    };

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    next(error);
  }
};

// New endpoint for taxonomic drill-down
export const getTaxonomicChildren = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { level, parent } = req.query;

    const analysisResult = await AnalysisResult.findOne({ fileId });
    
    if (!analysisResult || analysisResult.status !== 'completed') {
      return res.status(404).json({
        error: 'Analysis not found or not complete'
      });
    }

    const validLevels = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: 'Invalid taxonomic level',
        message: `Level must be one of: ${validLevels.join(', ')}`
      });
    }

    // In a real implementation, you would query the actual sequences
    // For now, we'll use the pre-calculated hierarchical distribution
    const nextLevelIndex = validLevels.indexOf(level) + 1;
    if (nextLevelIndex >= validLevels.length) {
      return res.status(400).json({
        error: 'No children available for species level'
      });
    }

    const nextLevel = validLevels[nextLevelIndex];
    const children = analysisResult.hierarchicalDistribution[nextLevel]?.filter(
      item => {
        // This would be more sophisticated in real implementation
        return item.name.toLowerCase().includes(parent.toLowerCase()) || 
               Math.random() > 0.7; // Mock filter
      }
    ) || [];

    res.status(200).json({
      success: true,
      data: {
        parentLevel: level,
        parentName: parent,
        childLevel: nextLevel,
        children: children.slice(0, 20) // Limit results
      }
    });

  } catch (error) {
    next(error);
  }
};

// Enhanced analysis status endpoint
export const getAnalysisStatus = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    const analysisResult = await AnalysisResult.findOne({ fileId })
      .select('fileId originalName status uploadDate analysisDate error processingTime totalSequences');
    
    if (!analysisResult) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    next(error);
  }
};
