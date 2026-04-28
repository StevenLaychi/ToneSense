const { Router } = require('express');
const { analyze } = require('../controllers/analysisController');
const { validateAnalyze } = require('../middlewares/validate');

const router = Router();

router.post('/', validateAnalyze, analyze);

module.exports = router;
