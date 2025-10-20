import axios from 'axios';

export class TaxonomyService {
  constructor() {
    this.taxonomyCache = new Map();
    this.geoCache = new Map();
  }

  async classifySequence(header, sequence) {
    // Enhanced mock classification with full taxonomic hierarchy
    const classification = this._enhancedClassification(header, sequence);
    return classification;
  }

  _enhancedClassification(header, sequence) {
    const headerLower = header.toLowerCase();
    
    // Mock data with full taxonomic hierarchy
    const mockTaxonomies = [
      {
        kingdom: 'Animalia', phylum: 'Chordata', class: 'Mammalia',
        order: 'Primates', family: 'Hominidae', genus: 'Homo', species: 'sapiens',
        confidence: 0.95, location: { country: 'Global', lat: 0, lng: 0 }
      },
      {
        kingdom: 'Plantae', phylum: 'Tracheophyta', class: 'Magnoliopsida',
        order: 'Rosales', family: 'Rosaceae', genus: 'Rosa', species: 'rubiginosa',
        confidence: 0.92, location: { country: 'Europe', lat: 48.8566, lng: 2.3522 }
      },
      {
        kingdom: 'Fungi', phylum: 'Basidiomycota', class: 'Agaricomycetes',
        order: 'Agaricales', family: 'Amanitaceae', genus: 'Amanita', species: 'muscaria',
        confidence: 0.88, location: { country: 'North America', lat: 40.7128, lng: -74.0060 }
      },
      {
        kingdom: 'Protista', phylum: 'Sarcomastigophora', class: 'Polycystinea',
        order: 'Spumellarida', family: 'Thalassicollidae', genus: 'Thalassicolla', species: 'nucleata',
        confidence: 0.85, location: { country: 'Ocean', lat: 0, lng: 0 }
      },
      {
        kingdom: 'Bacteria', phylum: 'Proteobacteria', class: 'Gammaproteobacteria',
        order: 'Enterobacterales', family: 'Enterobacteriaceae', genus: 'Escherichia', species: 'coli',
        confidence: 0.90, location: { country: 'Global', lat: 0, lng: 0 }
      }
    ];

    // Select taxonomy based on sequence characteristics
    const gcContent = this._calculateGCContent(sequence);
    const length = sequence.length;
    
    let selectedTaxonomy;
    
    if (gcContent > 60 && length > 1000) {
      selectedTaxonomy = mockTaxonomies[1]; // Plantae
    } else if (gcContent < 40 && length < 500) {
      selectedTaxonomy = mockTaxonomies[4]; // Bacteria
    } else if (headerLower.includes('homo') || headerLower.includes('human')) {
      selectedTaxonomy = mockTaxonomies[0]; // Animalia
    } else if (headerLower.includes('fungus') || headerLower.includes('mushroom')) {
      selectedTaxonomy = mockTaxonomies[2]; // Fungi
    } else {
      // Random selection with weights
      const randomIndex = Math.floor(Math.random() * mockTaxonomies.length);
      selectedTaxonomy = mockTaxonomies[randomIndex];
    }

    // Add some variation
    const variation = {
      confidence: Math.max(0.7, selectedTaxonomy.confidence - Math.random() * 0.2),
      location: this._getRandomLocation(selectedTaxonomy.location)
    };

    return { ...selectedTaxonomy, ...variation };
  }

  _calculateGCContent(sequence) {
    const gcCount = (sequence.match(/[GC]/g) || []).length;
    return sequence.length > 0 ? (gcCount / sequence.length) * 100 : 0;
  }

  _getRandomLocation(baseLocation) {
    const variations = [
      { country: 'United States', lat: 39.8283, lng: -98.5795 },
      { country: 'Brazil', lat: -14.2350, lng: -51.9253 },
      { country: 'China', lat: 35.8617, lng: 104.1954 },
      { country: 'India', lat: 20.5937, lng: 78.9629 },
      { country: 'Australia', lat: -25.2744, lng: 133.7751 },
      { country: 'South Africa', lat: -30.5595, lng: 22.9375 },
      { country: 'Russia', lat: 61.5240, lng: 105.3188 },
      { country: 'Germany', lat: 51.1657, lng: 10.4515 }
    ];
    
    if (baseLocation.country === 'Global') {
      return variations[Math.floor(Math.random() * variations.length)];
    }
    
    return baseLocation;
  }

  async classifyMultipleSequences(sequences, batchSize = 100) {
    const classifications = [];
    
    for (let i = 0; i < sequences.length; i += batchSize) {
      const batch = sequences.slice(i, i + batchSize);
      const batchClassifications = await Promise.all(
        batch.map(seq => this.classifySequence(seq.header, seq.sequence))
      );
      classifications.push(...batchClassifications);
      
      if (i + batchSize < sequences.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return classifications;
  }

  calculateHierarchicalDistribution(sequences, classifications) {
    const hierarchyLevels = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
    const distribution = {};
    
    hierarchyLevels.forEach(level => {
      distribution[level] = this._calculateLevelDistribution(classifications, level);
    });
    
    return distribution;
  }

  _calculateLevelDistribution(classifications, level) {
    const levelCounts = new Map();
    
    classifications.forEach((classification, index) => {
      const levelValue = classification[level];
      
      if (!levelCounts.has(levelValue)) {
        levelCounts.set(levelValue, {
          count: 0,
          totalLength: 0,
          sequences: [],
          children: new Set()
        });
      }
      
      const levelData = levelCounts.get(levelValue);
      levelData.count++;
      
      // Store next level for drill-down
      const nextLevel = this._getNextLevel(level);
      if (nextLevel && classification[nextLevel]) {
        levelData.children.add(classification[nextLevel]);
      }
    });
    
    const total = classifications.length;
    const result = Array.from(levelCounts.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      percentage: (data.count / total) * 100,
      children: Array.from(data.children)
    }));
    
    return result.sort((a, b) => b.count - a.count);
  }

  _getNextLevel(level) {
    const hierarchy = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
    const index = hierarchy.indexOf(level);
    return index < hierarchy.length - 1 ? hierarchy[index + 1] : null;
  }

  calculateGeographicDistribution(classifications) {
    const countryCounts = new Map();
    const coordinates = [];
    
    classifications.forEach(classification => {
      const { country, lat, lng } = classification.location;
      
      if (!countryCounts.has(country)) {
        countryCounts.set(country, {
          count: 0,
          coordinates: { lat, lng },
          species: new Set()
        });
      }
      
      const countryData = countryCounts.get(country);
      countryData.count++;
      countryData.species.add(classification.species);
      
      coordinates.push({ lat, lng, country, species: classification.species });
    });
    
    const total = classifications.length;
    const distribution = Array.from(countryCounts.entries()).map(([country, data]) => ({
      country,
      count: data.count,
      percentage: (data.count / total) * 100,
      coordinates: data.coordinates,
      speciesCount: data.species.size,
      intensity: data.count / Math.max(...Array.from(countryCounts.values()).map(d => d.count))
    }));
    
    return {
      byCountry: distribution.sort((a, b) => b.count - a.count),
      coordinates: coordinates
    };
  }
}
