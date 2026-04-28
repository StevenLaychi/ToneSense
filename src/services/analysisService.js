const { groqChat } = require('../config/groq');
const { buildAnalysisPrompt } = require('./promptBuilder');
const { parseJsonFromLLM } = require('../utils/parseJson');
const logger = require('../utils/logger');

async function analyzeText(text, context, language) {
  const prompt = buildAnalysisPrompt(text, context, language);

  const raw = await groqChat(
    [{ role: 'user', content: prompt }],
    { temperature: 0.2, maxTokens: 1200 }
  );

  logger.debug('Analysis raw response:', raw.substring(0, 200));

  const result = parseJsonFromLLM(raw);

  return sanitizeAnalysisResult(result);
}

function sanitizeAnalysisResult(data) {
  return {
    tone: String(data.tone || 'Unknown'),
    sentiment: String(data.sentiment || 'neutral'),
    emotion: String(data.emotion || 'unknown'),
    risk_score: Math.min(1, Math.max(0, parseFloat(data.risk_score) || 0)),
    risk_level: String(data.risk_level || 'Low'),
    confidence: Math.min(100, Math.max(0, parseInt(data.confidence, 10) || 70)),
    risk_words: Array.isArray(data.risk_words)
      ? data.risk_words
          .filter((w) => w && w.word && w.reason)
          .map((w) => ({ word: String(w.word), reason: String(w.reason) }))
      : [],
    summary: String(data.summary || ''),
  };
}

module.exports = { analyzeText };
