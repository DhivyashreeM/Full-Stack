// Simple in-memory storage for development without MongoDB
const analysisResults = new Map();

export class MemoryStorage {
  static async saveAnalysisResult(fileId, data) {
    analysisResults.set(fileId, {
      ...data,
      id: fileId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'completed'
    });
    return data;
  }

  static async getAnalysisResult(fileId) {
    return analysisResults.get(fileId) || null;
  }

  static async getAllAnalysisResults() {
    return Array.from(analysisResults.values());
  }

  static async updateAnalysisResult(fileId, updates) {
    const existing = analysisResults.get(fileId);
    if (existing) {
      const updated = { ...existing, ...updates, updatedAt: new Date() };
      analysisResults.set(fileId, updated);
      return updated;
    }
    return null;
  }

  static async deleteAnalysisResult(fileId) {
    return analysisResults.delete(fileId);
  }
}
