import mongoose from 'mongoose';

const analysisJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'anonymous'
  },
  originalFilename: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'analyzing', 'completed', 'error'],
    default: 'uploading'
  },
  progress: {
    type: Number,
    default: 0
  },
  currentStep: {
    type: String,
    default: 'Initializing'
  },
  config: {
    calculateDiversity: { type: Boolean, default: true },
    generateCharts: { type: Boolean, default: true },
    includeStatistics: { type: Boolean, default: true },
    confidenceThreshold: { type: Number, default: 0.8 }
  },
  results: {
    totalSpecies: Number,
    totalObservations: Number,
    speciesDiversity: Number,
    dominantSpecies: String,
    analysisTime: Number,
    data: [{
      species: String,
      count: Number,
      location: String,
      timestamp: Date,
      confidence: Number
    }],
    charts: {
      speciesDistribution: [{
        name: String,
        value: Number
      }],
      temporalDistribution: [{
        name: String,
        value: Number
      }],
      locationHeatmap: [{
        name: String,
        value: Number
      }]
    }
  },
  error: {
    message: String,
    stack: String
  },
  estimatedTime: Number,
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, {
  timestamps: true
});

// Index for faster queries
analysisJobSchema.index({ jobId: 1 });
analysisJobSchema.index({ userId: 1 });
analysisJobSchema.index({ status: 1 });
analysisJobSchema.index({ createdAt: 1 });

export default mongoose.model('AnalysisJob', analysisJobSchema);
