import express from 'express';
import { generateReport, getChartData } from '../controllers/reportController.js';

const router = express.Router();

// Generate analysis report
router.get('/:fileId', generateReport);

// Get chart data for visualization
router.get('/:fileId/charts', getChartData);

export default router;
