const router = require('express').Router();
const routerUsers = require('./users');
const routerMovies = require('./movies');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/ErrorNotFound');

router.use(routerUsers);
router.use(routerMovies);

router.all('/*', auth, () => {
  throw new ErrorNotFound('Страница не найдена');
});

module.exports = router;
