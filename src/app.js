const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { port, nodeEnv } = require('./config/env');
const analysisRouter = require('./routes/analysis');
const rewriteRouter = require('./routes/rewrite');
const { errorHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait a moment and try again.' },
});

app.use('/api', apiLimiter);
app.use('/api/analyze', analysisRouter);
app.use('/api/rewrite', rewriteRouter);

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`ToneSense running on http://localhost:${port} [${nodeEnv}]`);
});

module.exports = app;
