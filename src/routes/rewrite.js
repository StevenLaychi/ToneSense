const { Router } = require('express');
const { rewrite } = require('../controllers/rewriteController');
const { validateRewrite } = require('../middlewares/validate');

const router = Router();

router.post('/', validateRewrite, rewrite);

module.exports = router;
