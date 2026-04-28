const { rewriteText } = require('../services/rewriteService');
const { success } = require('../utils/apiResponse');
const { CONTEXTS, REWRITE_MODES } = require('../config/constants');

async function rewrite(req, res, next) {
  try {
    const text = req.body.text.trim();
    const context = req.body.context || CONTEXTS.MANAGER_EMAIL;
    const mode = req.body.mode || REWRITE_MODES.PROFESSIONAL;
    const language = req.body.language || 'id';

    const rewritten = await rewriteText(text, context, mode, language);
    return success(res, { rewritten });
  } catch (err) {
    next(err);
  }
}

module.exports = { rewrite };
