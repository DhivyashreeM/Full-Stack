export const validateAnalysisConfig = (req, res, next) => {
  const { config } = req.body;
  
  if (!config) {
    return next();
  }

  const errors = [];

  if (config.confidenceThreshold && 
      (config.confidenceThreshold < 0.5 || config.confidenceThreshold > 1)) {
    errors.push('Confidence threshold must be between 0.5 and 1.0');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid configuration', 
      details: errors 
    });
  }

  next();
};
