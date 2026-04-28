const { analyzeText } = require('../services/analysisService');
const { success } = require('../utils/apiResponse');
const { CONTEXTS } = require('../config/constants');

async function analyze(req, res, next) {
  try {
    const text = req.body.text.trim();
    const context = req.body.context || CONTEXTS.MANAGER_EMAIL;
    const language = req.body.language || 'id';

    const result = await analyzeText(text, context, language);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { analyze };
