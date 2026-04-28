const { error } = require('../utils/apiResponse');
const { CONTEXTS, REWRITE_MODES, LANGUAGES } = require('../config/constants');

const VALID_CONTEXTS = Object.values(CONTEXTS);
const VALID_MODES = Object.values(REWRITE_MODES);
const VALID_LANGUAGES = Object.values(LANGUAGES);

function validateAnalyze(req, res, next) {
  const { text, context, language } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return error(res, 'Text is required and must be a non-empty string.', 400);
  }

  if (text.trim().length < 5) {
    return error(res, 'Text is too short to analyze. Please enter at least 5 characters.', 400);
  }

  if (text.length > 3000) {
    return error(res, 'Text exceeds maximum length of 3000 characters.', 400);
  }

  if (context && !VALID_CONTEXTS.includes(context)) {
    return error(res, 'Invalid context value.', 400);
  }

  if (language && !VALID_LANGUAGES.includes(language)) {
    return error(res, 'Invalid language. Use "id" or "en".', 400);
  }

  next();
}

function validateRewrite(req, res, next) {
  const { text, context, mode, language } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return error(res, 'Text is required and must be a non-empty string.', 400);
  }

  if (text.length > 3000) {
    return error(res, 'Text exceeds maximum length of 3000 characters.', 400);
  }

  if (!mode || !VALID_MODES.includes(mode)) {
    return error(res, `Invalid mode. Valid options: ${VALID_MODES.join(', ')}.`, 400);
  }

  if (context && !VALID_CONTEXTS.includes(context)) {
    return error(res, 'Invalid context value.', 400);
  }

  if (language && !VALID_LANGUAGES.includes(language)) {
    return error(res, 'Invalid language. Use "id" or "en".', 400);
  }

  next();
}

module.exports = { validateAnalyze, validateRewrite };
