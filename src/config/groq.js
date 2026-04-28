const { groqApiKey } = require('./env');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function groqChat(messages, options = {}) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: options.temperature ?? 0.25,
      max_tokens: options.maxTokens ?? 1200,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq API ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

module.exports = { groqChat };
