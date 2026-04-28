const { groqChat } = require('../config/groq');
const { buildRewritePrompt } = require('./promptBuilder');
const logger = require('../utils/logger');

async function rewriteText(text, context, mode, language) {
  const prompt = buildRewritePrompt(text, context, mode, language);

  const rewritten = await groqChat(
    [{ role: 'user', content: prompt }],
    { temperature: 0.45, maxTokens: 800 }
  );

  logger.debug('Rewrite result:', rewritten.substring(0, 200));

  return rewritten.trim();
}

module.exports = { rewriteText };
