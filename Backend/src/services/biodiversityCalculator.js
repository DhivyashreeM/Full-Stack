export class BiodiversityCalculator {
  static calculateShannonDiversity(speciesCounts) {
    const total = Object.values(speciesCounts).reduce((sum, count) => sum + count, 0);
    let diversity = 0;

    for (const count of Object.values(speciesCounts)) {
      const proportion = count / total;
      if (proportion > 0) {
        diversity -= proportion * Math.log(proportion);
      }
    }

    return diversity;
  }

  static calculateSimpsonDiversity(speciesCounts) {
    const total = Object.values(speciesCounts).reduce((sum, count) => sum + count, 0);
    let diversity = 0;

    for (const count of Object.values(speciesCounts)) {
      const proportion = count / total;
      diversity += proportion * proportion;
    }

    return 1 - diversity; // Simpson's Diversity Index
  }

  static calculateSpeciesRichness(speciesCounts) {
    return Object.keys(speciesCounts).length;
  }

  static calculateEvenness(speciesCounts) {
    const richness = this.calculateSpeciesRichness(speciesCounts);
    const shannon = this.calculateShannonDiversity(speciesCounts);
    return shannon / Math.log(richness);
  }

  static findDominantSpecies(speciesCounts) {
    return Object.entries(speciesCounts)
      .sort(([, a], [, b]) => b - a)[0][0];
  }
}
