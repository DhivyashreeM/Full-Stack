import { FastaParser } from './fastaParser.js';
import { TaxonomyService } from './taxonomyService.js';
import { performance } from 'perf_hooks';
import fs from 'fs/promises';

export class AnalysisEngine {
  constructor() {
    this.fastaParser = new FastaParser();
    this.taxonomyService = new TaxonomyService();
  }

  async analyzeFastaFile(filePath, fileName) {
    const startTime = performance.now();
    
    try {
      console.log(`🔍 Starting analysis of: ${fileName}`);
      
      // Validate file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Parse FASTA file
      console.log('📖 Step 1: Parsing FASTA file...');
      const parser = new FastaParser(filePath);
      const parseResult = await parser.parse();
      
      if (!parseResult.success) {
        throw new Error('FASTA parsing failed');
      }

      const { sequences, stats } = parseResult;
      console.log(`✅ Parsed ${sequences.length} sequences`);

      if (sequences.length === 0) {
        throw new Error('No valid sequences found in FASTA file');
      }

      // Enhanced taxonomic classification
      console.log('🔬 Step 2: Taxonomic classification...');
      const classifications = await this.taxonomyService.classifyMultipleSequences(sequences);
      
      // Calculate hierarchical distribution
      console.log('📊 Step 3: Calculating hierarchical distribution...');
      const hierarchicalDistribution = this.taxonomyService.calculateHierarchicalDistribution(classifications);

      // Calculate geographic distribution
      console.log('🌍 Step 4: Calculating geographic distribution...');
      const geographicDistribution = this.taxonomyService.calculateGeographicDistribution(classifications);

      // Calculate quality metrics
      console.log('📈 Step 5: Calculating quality metrics...');
      const qualityMetrics = this._calculateQualityMetrics(sequences, stats);

      // Calculate biodiversity indices
      console.log('📊 Step 6: Calculating biodiversity indices...');
      const biodiversityIndices = this._calculateBiodiversityIndices(hierarchicalDistribution);

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      console.log(`🎉 Analysis completed in ${(processingTime / 1000).toFixed(2)} seconds`);

      return {
        fileName,
        totalSequences: sequences.length,
        sequenceStats: stats,
        qualityMetrics,
        hierarchicalDistribution,
        geographicDistribution,
        biodiversityIndices,
        processingTime,
        analyzedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  _calculateQualityMetrics(sequences, stats) {
    const totalSequences = sequences.length;
    
    if (totalSequences === 0) {
      return {
        qualityScore: 0,
        contaminationRisk: 100,
        completeness: 0,
        averageQuality: 0,
        lowQualitySequences: 0
      };
    }

    // Count low quality sequences
    const lowQualitySequences = sequences.filter(seq => 
      seq.nContent > 5 || seq.length < 100
    ).length;

    const averageQuality = sequences.reduce((sum, seq) => {
      let qualityScore = 100;
      qualityScore -= Math.min(50, seq.nContent * 2);
      if (seq.length < 100) qualityScore -= 20;
      if (seq.length < 50) qualityScore -= 30;
      const ambiguousRatio = seq.ambiguousBases / seq.length;
      qualityScore -= Math.min(30, ambiguousRatio * 100);
      return sum + Math.max(0, qualityScore);
    }, 0) / totalSequences;

    const contaminationRisk = Math.min(100, (lowQualitySequences / totalSequences) * 100);
    const completeness = Math.max(0, 100 - contaminationRisk);

    return {
      qualityScore: Math.round(averageQuality * 10) / 10,
      contaminationRisk: Math.round(contaminationRisk * 10) / 10,
      completeness: Math.round(completeness * 10) / 10,
      averageQuality: Math.round(averageQuality * 10) / 10,
      lowQualitySequences
    };
  }

  _calculateBiodiversityIndices(hierarchicalDistribution) {
    const speciesData = hierarchicalDistribution.species || [];
    const total = speciesData.reduce((sum, species) => sum + species.count, 0);
    
    if (total === 0) {
      return {
        shannonIndex: 0,
        simpsonIndex: 0,
        speciesRichness: 0,
        evenness: 0,
        dominance: 0
      };
    }
    
    let shannon = 0;
    let simpson = 0;
    
    for (const species of speciesData) {
      const proportion = species.count / total;
      if (proportion > 0) {
        shannon -= proportion * Math.log(proportion);
        simpson += proportion * proportion;
      }
    }
    
    const maxShannon = speciesData.length > 0 ? Math.log(speciesData.length) : 0;
    const evenness = speciesData.length > 1 ? shannon / maxShannon : 0;
    
    return {
      shannonIndex: Math.round(shannon * 100) / 100,
      simpsonIndex: Math.round(simpson * 100) / 100,
      speciesRichness: speciesData.length,
      evenness: Math.round(evenness * 100) / 100,
      dominance: Math.round((1 - simpson) * 100) / 100
    };
  }

  async validateFastaFile(filePath) {
    try {
      const parser = new FastaParser(filePath);
      const result = await parser.parse();
      
      return {
        isValid: true,
        sequenceCount: result.sequences.length,
        totalLength: result.stats.totalLength,
        averageLength: result.stats.averageLength
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }
}
