import mongoose from 'mongoose';

const sequenceStatsSchema = new mongoose.Schema({
  totalLength: { type: Number, required: true },
  averageLength: { type: Number, required: true },
  gcContent: { type: Number, required: true },
  nContent: { type: Number, required: true },
  ambiguousBases: { type: Number, default: 0 },
  shortestSequence: { type: Number, required: true },
  longestSequence: { type: Number, required: true }
});

const qualityMetricsSchema = new mongoose.Schema({
  qualityScore: { type: Number, required: true },
  contaminationRisk: { type: Number, required: true },
  completeness: { type: Number, required: true },
  averageQuality: { type: Number, required: true },
  lowQualitySequences: { type: Number, default: 0 }
});

const hierarchicalDistributionSchema = new mongoose.Schema({
  kingdom: [{
    name: String,
    count: Number,
    percentage: Number,
    children: [String]
  }],
  phylum: [{
    name: String,
    count: Number,
    percentage: Number,
    children: [String]
  }],
  class: [{
    name: String,
    count: Number,
    percentage: Number,
    children: [String]
  }],
  order: [{
    name: String,
    count: Number,
    percentage: Number,
    children: [String]
  }],
  family: [{
    name: String,
    count: Number,
    percentage: Number,
    children: [String]
  }],
  genus: [{
    name: String,
    count: Number,
    percentage: Number,
    children: [String]
  }],
  species: [{
    name: String,
    count: Number,
    percentage: Number
  }]
});

const geographicDistributionSchema = new mongoose.Schema({
  byCountry: [{
    country: String,
    count: Number,
    percentage: Number,
    coordinates: {
      lat: Number,
      lng: Number
    },
    speciesCount: Number,
    intensity: Number
  }],
  coordinates: [{
    lat: Number,
    lng: Number,
    country: String,
    species: String
  }]
});

const biodiversityIndicesSchema = new mongoose.Schema({
  shannonIndex: { type: Number, required: true },
  simpsonIndex: { type: Number, required: true },
  speciesRichness: { type: Number, required: true },
  evenness: { type: Number, required: true },
  dominance: { type: Number, required: true }
});

const analysisResultSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  analysisDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  totalSequences: { type: Number, required: true },
  sequenceStats: sequenceStatsSchema,
  qualityMetrics: qualityMetricsSchema,
  hierarchicalDistribution: hierarchicalDistributionSchema,
  geographicDistribution: geographicDistributionSchema,
  biodiversityIndices: biodiversityIndicesSchema,
  processingTime: { type: Number, default: 0 },
  error: { type: String, default: null }
}, {
  timestamps: true
});

// Indexes for faster queries
analysisResultSchema.index({ fileId: 1 });
analysisResultSchema.index({ uploadDate: -1 });
analysisResultSchema.index({ status: 1 });

export default mongoose.model('AnalysisResult', analysisResultSchema);
