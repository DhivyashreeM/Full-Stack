import AnalysisResult from '../models/AnalysisResult.js';

export const generateReport = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { format = 'json' } = req.query;

    const analysisResult = await AnalysisResult.findOne({ fileId });
    
    if (!analysisResult) {
      return res.status(404).json({
        error: 'Analysis not found'
      });
    }

    if (analysisResult.status !== 'completed') {
      return res.status(400).json({
        error: 'Analysis not complete',
        message: 'Cannot generate report for incomplete analysis'
      });
    }

    // Generate comprehensive report
    const report = {
      metadata: {
        fileId: analysisResult.fileId,
        fileName: analysisResult.originalName,
        analysisDate: analysisResult.analysisDate,
        uploadDate: analysisResult.uploadDate,
        processingTime: analysisResult.processingTime,
        totalSequences: analysisResult.totalSequences
      },
      sequenceStatistics: analysisResult.sequenceStats,
      qualityAssessment: analysisResult.qualityMetrics,
      biodiversity: {
        familyDistribution: analysisResult.familyDistribution,
        diversityMetrics: {
          shannonIndex: calculateShannonIndex(analysisResult.familyDistribution),
          simpsonIndex: calculateSimpsonIndex(analysisResult.familyDistribution),
          speciesRichness: analysisResult.familyDistribution.length,
          evenness: calculateEvenness(analysisResult.familyDistribution)
        }
      },
      recommendations: generateRecommendations(analysisResult)
    };

    if (format === 'csv') {
      const csvReport = generateCSVReport(report);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=report-${fileId}.csv`);
      return res.send(csvReport);
    }

    res.status(200).json({
      success: true,
      data: report
    });

  } catch (error) {
    next(error);
  }
};

// Biodiversity metrics calculations
function calculateShannonIndex(familyDistribution) {
  const total = familyDistribution.reduce((sum, family) => sum + family.count, 0);
  let shannon = 0;
  
  for (const family of familyDistribution) {
    const proportion = family.count / total;
    if (proportion > 0) {
      shannon -= proportion * Math.log(proportion);
    }
  }
  
  return Math.round(shannon * 100) / 100;
}

function calculateSimpsonIndex(familyDistribution) {
  const total = familyDistribution.reduce((sum, family) => sum + family.count, 0);
  let simpson = 0;
  
  for (const family of familyDistribution) {
    const proportion = family.count / total;
    simpson += proportion * proportion;
  }
  
  return Math.round(simpson * 100) / 100;
}

function calculateEvenness(familyDistribution) {
  const shannon = calculateShannonIndex(familyDistribution);
  const maxShannon = Math.log(familyDistribution.length);
  return familyDistribution.length > 1 ? Math.round((shannon / maxShannon) * 100) / 100 : 0;
}

function generateRecommendations(analysisResult) {
  const recommendations = [];
  const { qualityMetrics, familyDistribution, sequenceStats } = analysisResult;

  if (qualityMetrics.contaminationRisk > 10) {
    recommendations.push({
      type: 'warning',
      category: 'Quality',
      message: 'High contamination risk detected. Consider additional filtering.',
      suggestion: 'Implement quality filtering and remove low-complexity regions.'
    });
  }

  if (qualityMetrics.lowQualitySequences > analysisResult.totalSequences * 0.1) {
    recommendations.push({
      type: 'warning',
      category: 'Quality',
      message: 'More than 10% of sequences are low quality.',
      suggestion: 'Apply length and quality filters to improve dataset quality.'
    });
  }

  if (sequenceStats.nContent > 2) {
    recommendations.push({
      type: 'info',
      category: 'Sequencing',
      message: 'Elevated N-content detected in sequences.',
      suggestion: 'Check sequencing quality and consider trimming ambiguous bases.'
    });
  }

  if (familyDistribution.length < 5) {
    recommendations.push({
      type: 'info',
      category: 'Diversity',
      message: 'Low family diversity detected.',
      suggestion: 'Sample may be from a specialized environment or require deeper sequencing.'
    });
  }

  const topFamilyPercentage = familyDistribution[0]?.percentage || 0;
  if (topFamilyPercentage > 80) {
    recommendations.push({
      type: 'info',
      category: 'Diversity',
      message: 'Single family dominance detected.',
      suggestion: 'Consider if this reflects the true biological sample or indicates bias.'
    });
  }

  if (qualityMetrics.qualityScore > 90) {
    recommendations.push({
      type: 'success',
      category: 'Quality',
      message: 'Excellent sequence quality achieved.',
      suggestion: 'Dataset is suitable for detailed biodiversity analysis.'
    });
  }

  return recommendations;
}

function generateCSVReport(report) {
  let csv = 'Biodiversity Analysis Report\n\n';
  
  csv += 'METADATA\n';
  csv += 'File Name,Analysis Date,Total Sequences,Processing Time (ms)\n';
  csv += `"${report.metadata.fileName}","${report.metadata.analysisDate}",${report.metadata.totalSequences},${report.metadata.processingTime}\n\n`;
  
  csv += 'SEQUENCE STATISTICS\n';
  csv += 'Total Length,Average Length,GC Content (%),N Content (%),Ambiguous Bases,Shortest Sequence,Longest Sequence\n';
  const stats = report.sequenceStatistics;
  csv += `${stats.totalLength},${stats.averageLength},${stats.gcContent},${stats.nContent},${stats.ambiguousBases},${stats.shortestSequence},${stats.longestSequence}\n\n`;
  
  csv += 'FAMILY DISTRIBUTION\n';
  csv += 'Family,Count,Percentage (%)\n';
  report.biodiversity.familyDistribution.forEach(family => {
    csv += `"${family.family}",${family.count},${family.percentage}\n`;
  });
  csv += '\n';
  
  csv += 'DIVERSITY METRICS\n';
  csv += 'Shannon Index,Simpson Index,Species Richness,Evenness\n';
  const metrics = report.biodiversity.diversityMetrics;
  csv += `${metrics.shannonIndex},${metrics.simpsonIndex},${metrics.speciesRichness},${metrics.evenness}\n`;
  
  return csv;
}

export const getChartData = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { chartType = 'familyDistribution' } = req.query;

    const analysisResult = await AnalysisResult.findOne({ fileId });
    
    if (!analysisResult || analysisResult.status !== 'completed') {
      return res.status(404).json({
        error: 'Analysis not found or not complete'
      });
    }

    let chartData;
    
    switch (chartType) {
      case 'familyDistribution':
        chartData = analysisResult.familyDistribution.map(family => ({
          name: family.family,
          value: family.count,
          percentage: family.percentage
        }));
        break;
        
      case 'qualityMetrics':
        chartData = [
          { name: 'Quality Score', value: analysisResult.qualityMetrics.qualityScore },
          { name: 'Completeness', value: analysisResult.qualityMetrics.completeness },
          { name: 'Contamination Risk', value: analysisResult.qualityMetrics.contaminationRisk }
        ];
        break;
        
      case 'sequenceLengths':
        chartData = generateLengthDistribution(analysisResult.sequenceStats);
        break;
        
      default:
        return res.status(400).json({
          error: 'Invalid chart type',
          message: 'Supported chart types: familyDistribution, qualityMetrics, sequenceLengths'
        });
    }

    res.status(200).json({
      success: true,
      data: {
        chartType,
        data: chartData,
        metadata: {
          fileId: analysisResult.fileId,
          fileName: analysisResult.originalName
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

function generateLengthDistribution(stats) {
  const distributions = [
    { range: '0-500', count: Math.round(stats.totalSequences * 0.1) },
    { range: '501-1000', count: Math.round(stats.totalSequences * 0.2) },
    { range: '1001-2000', count: Math.round(stats.totalSequences * 0.35) },
    { range: '2001-5000', count: Math.round(stats.totalSequences * 0.25) },
    { range: '5001+', count: Math.round(stats.totalSequences * 0.1) }
  ];
  
  return distributions;
}
