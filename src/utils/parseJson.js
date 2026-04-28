/**
 * Safely extracts and parses the first JSON object found in a string.
 * Handles markdown code fences and surrounding text from LLM responses.
 */
function parseJsonFromLLM(raw) {
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty or invalid response from AI.');
  }

  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('No valid JSON object found in AI response.');
  }

  try {
    return JSON.parse(match[0]);
  } catch {
    throw new Error('Failed to parse JSON from AI response.');
  }
}

module.exports = { parseJsonFromLLM };
