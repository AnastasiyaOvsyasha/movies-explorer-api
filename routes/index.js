const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/ErrorNotFound');

router.use(require('./sign'));

router.use(auth);

router.use(require('./movies'));
router.use(require('./users'));

router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

module.exports = router;
