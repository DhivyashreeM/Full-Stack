import { AnalysisResult, TaxonomicChildrenResponse } from '../types/types';

const API_BASE_URL = 'http://localhost:3001/api';

export const apiService = {
  // Upload endpoints
  async uploadFastaFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('fastaFile', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Analysis endpoints
  async getAnalysisResults(fileId: string): Promise<{ success: boolean; data: AnalysisResult }> {
    const response = await fetch(`${API_BASE_URL}/analysis/${fileId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analysis: ${response.statusText}`);
    }

    return response.json();
  },

  async getAnalysisStatus(fileId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/analysis/${fileId}/status`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }

    return response.json();
  },

  async getTaxonomicChildren(
    fileId: string, 
    level: string, 
    parent: string
  ): Promise<{ success: boolean; data: TaxonomicChildrenResponse }> {
    const params = new URLSearchParams({ level, parent });
    const response = await fetch(`${API_BASE_URL}/analysis/${fileId}/taxonomy?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch taxonomic children: ${response.statusText}`);
    }

    return response.json();
  },

  // Report endpoints
  async generateReport(fileId: string, format: string = 'json'): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/${fileId}?format=${format}`);
    
    if (!response.ok) {
      throw new Error(`Failed to generate report: ${response.statusText}`);
    }

    if (format === 'csv') {
      return response.blob();
    }

    return response.json();
  },

  async getChartData(fileId: string, chartType: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/${fileId}/charts?chartType=${chartType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }

    return response.json();
  }
};

// Utility function to check backend health
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};
