const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const movieRouter = require('./movies');
const userRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const router = Router();

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(1).required(),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().min(1).required(),
    }),
  }),
  createUser,
);

router.use(auth);
router.use(movieRouter);
router.use(userRouter);
module.exports = router;
