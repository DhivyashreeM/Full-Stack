import fs from 'fs/promises';
import path from 'path';

export class FileManager {
  constructor() {
    this.uploadDir = process.env.UPLOAD_PATH || './uploads';
    this.resultsDir = process.env.RESULTS_PATH || './results';
  }

  async ensureDirectories() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }

    try {
      await fs.access(this.resultsDir);
    } catch {
      await fs.mkdir(this.resultsDir, { recursive: true });
    }
  }

  async saveAnalysisResult(fileId, data) {
    const resultPath = path.join(this.resultsDir, `${fileId}.json`);
    await fs.writeFile(resultPath, JSON.stringify(data, null, 2));
    return resultPath;
  }

  async getAnalysisResult(fileId) {
    const resultPath = path.join(this.resultsDir, `${fileId}.json`);
    try {
      const data = await fs.readFile(resultPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error cleaning up file:', error);
      return false;
    }
  }

  async getFileStats(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch {
      return null;
    }
  }
}
