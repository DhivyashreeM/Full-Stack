import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

export class FastaParser {
  constructor(filePath) {
    this.filePath = filePath;
    this.sequences = [];
    this.stats = {
      totalSequences: 0,
      totalLength: 0,
      averageLength: 0,
      gcContent: 0,
      nContent: 0,
      ambiguousBases: 0,
      shortestSequence: Infinity,
      longestSequence: 0
    };
  }

  async parse() {
    const startTime = performance.now();
    
    try {
      const fileContent = await fs.promises.readFile(this.filePath, 'utf8');
      const lines = fileContent.split('\n');
      
      let currentHeader = '';
      let currentSequence = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('>')) {
          // Save previous sequence if exists
          if (currentHeader && currentSequence) {
            this._processSequence(currentHeader, currentSequence);
          }
          
          // Start new sequence
          currentHeader = trimmedLine.substring(1).trim();
          currentSequence = '';
        } else if (trimmedLine && currentHeader) {
          // Append to current sequence
          currentSequence += trimmedLine.toUpperCase();
        }
      }

      // Don't forget the last sequence
      if (currentHeader && currentSequence) {
        this._processSequence(currentHeader, currentSequence);
      }

      this._calculateOverallStats();
      
      const endTime = performance.now();
      this.stats.processingTime = endTime - startTime;

      return {
        sequences: this.sequences,
        stats: this.stats,
        success: true
      };
    } catch (error) {
      throw new Error(`FASTA parsing failed: ${error.message}`);
    }
  }

  _processSequence(header, sequence) {
    const sequenceData = {
      header: header,
      sequence: sequence,
      length: sequence.length,
      gcContent: this._calculateGCContent(sequence),
      nContent: this._calculateNContent(sequence),
      ambiguousBases: this._countAmbiguousBases(sequence)
    };

    this.sequences.push(sequenceData);
    this.stats.totalSequences++;
    this.stats.totalLength += sequence.length;
    
    // Update min/max lengths
    this.stats.shortestSequence = Math.min(this.stats.shortestSequence, sequence.length);
    this.stats.longestSequence = Math.max(this.stats.longestSequence, sequence.length);
  }

  _calculateGCContent(sequence) {
    const gcCount = (sequence.match(/[GC]/g) || []).length;
    return sequence.length > 0 ? (gcCount / sequence.length) * 100 : 0;
  }

  _calculateNContent(sequence) {
    const nCount = (sequence.match(/[N]/g) || []).length;
    return sequence.length > 0 ? (nCount / sequence.length) * 100 : 0;
  }

  _countAmbiguousBases(sequence) {
    const ambiguousBases = sequence.match(/[NRYKMSWBDHV]/g) || [];
    return ambiguousBases.length;
  }

  _calculateOverallStats() {
    if (this.sequences.length === 0) return;

    this.stats.averageLength = this.stats.totalLength / this.stats.totalSequences;
    
    // Calculate overall GC content
    const totalGC = this.sequences.reduce((sum, seq) => sum + seq.gcContent, 0);
    this.stats.gcContent = totalGC / this.sequences.length;
    
    // Calculate overall N content
    const totalN = this.sequences.reduce((sum, seq) => sum + seq.nContent, 0);
    this.stats.nContent = totalN / this.sequences.length;
    
    // Total ambiguous bases
    this.stats.ambiguousBases = this.sequences.reduce((sum, seq) => sum + seq.ambiguousBases, 0);
  }

  // Method to get sequence statistics for reporting
  getSequenceStats() {
    return this.stats;
  }

  // Method to get all sequences
  getSequences() {
    return this.sequences;
  }

  // Method to sample sequences (for large files)
  getSequenceSample(sampleSize = 100) {
    if (this.sequences.length <= sampleSize) {
      return this.sequences;
    }
    
    // Simple random sampling
    const shuffled = [...this.sequences].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, sampleSize);
  }
}
