export interface FastaFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  sequenceCount: number;
}

export interface AnalysisResult {
  fileId: string;
  fileName: string;
  originalName: string;
  totalSequences: number;
  analysisDate: string;
  uploadDate: string;
  processingTime: number;
  sequenceStats: SequenceStats;
  qualityMetrics: QualityMetrics;
  hierarchicalDistribution: HierarchicalDistribution;
  geographicDistribution: GeographicDistribution;
  biodiversityIndices: BiodiversityIndices;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface HierarchicalDistribution {
  kingdom: TaxonomicLevel[];
  phylum: TaxonomicLevel[];
  class: TaxonomicLevel[];
  order: TaxonomicLevel[];
  family: TaxonomicLevel[];
  genus: TaxonomicLevel[];
  species: TaxonomicLevel[];
}

export interface TaxonomicLevel {
  name: string;
  count: number;
  percentage: number;
  averageConfidence?: number;
  children?: string[];
  sequences?: any[];
}

export interface GeographicDistribution {
  byCountry: CountryDistribution[];
  coordinates: GeoCoordinate[];
}

export interface CountryDistribution {
  country: string;
  count: number;
  percentage: number;
  coordinates: Coordinates;
  speciesCount: number;
  kingdomCount: number;
  intensity: number;
}

export interface GeoCoordinate {
  lat: number;
  lng: number;
  country: string;
  species: string;
  kingdom: string;
  intensity: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BiodiversityIndices {
  shannonIndex: number;
  simpsonIndex: number;
  speciesRichness: number;
  evenness: number;
  dominance: number;
}

export interface SequenceStats {
  totalLength: number;
  averageLength: number;
  gcContent: number;
  nContent: number;
  ambiguousBases: number;
  shortestSequence: number;
  longestSequence: number;
}

export interface QualityMetrics {
  qualityScore: number;
  contaminationRisk: number;
  completeness: number;
  averageQuality: number;
  lowQualitySequences: number;
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  currentStep?: string;
}

export interface TaxonomicChildrenResponse {
  parentLevel: string;
  parentName: string;
  childLevel: string;
  children: TaxonomicLevel[];
}
