require('dotenv').config();

const required = ['GROQ_API_KEY'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[Config] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  groqApiKey: process.env.GROQ_API_KEY,
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
};
