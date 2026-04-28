const logger = require('../utils/logger');
const { error } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  logger.error(`[${req.method}] ${req.path} —`, err.message);

  if (err.message.includes('Groq API')) {
    return error(res, 'AI service temporarily unavailable. Please try again.', 503);
  }

  if (err.message.includes('JSON')) {
    return error(res, 'Failed to process AI response. Please try again.', 500);
  }

  return error(res, 'An unexpected error occurred. Please try again.', 500);
}

module.exports = { errorHandler };
