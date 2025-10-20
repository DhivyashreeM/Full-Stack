export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    details = Object.values(error.errors).map(err => err.message);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate resource';
    details = 'A resource with this identifier already exists';
  }

  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Custom error with status code
  if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  }

  // Development vs production error details
  const errorResponse = {
    error: true,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: details || error.message 
    }),
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(errorResponse);
};
