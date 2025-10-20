import mongoose from 'mongoose';

const speciesSchema = new mongoose.Schema({
  scientificName: {
    type: String,
    required: true,
    unique: true
  },
  commonName: {
    type: String,
    required: true
  },
  family: String,
  kingdom: String,
  conservationStatus: {
    type: String,
    enum: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD'],
    default: 'LC'
  },
  habitat: [String],
  description: String,
  imageUrl: String,
  geographicRange: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  observations: [{
    location: String,
    count: Number,
    date: Date,
    confidence: Number
  }],
  metadata: {
    firstRecorded: Date,
    lastUpdated: Date,
    dataSource: String
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
speciesSchema.index({ 'geographicRange.coordinates': '2dsphere' });

export default mongoose.model('Species', speciesSchema);
