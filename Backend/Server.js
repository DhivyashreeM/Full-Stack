import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running successfully!', 
    message: 'Biodiversity API is working',
    timestamp: new Date().toISOString() 
  });
});

// File upload test route
app.post('/api/upload', (req, res) => {
  res.json({ 
    jobId: 'test-' + Date.now(),
    status: 'processing',
    message: 'File upload endpoint is working' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Biodiversity backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
