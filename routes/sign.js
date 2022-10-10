const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { login, createUser, logout } = require('../controllers/users');

const router = Router();

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().min(1).required(),
      email: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isEmail(value)) {
            return value;
          }
          return helpers.message('Поле email заполнено некорректно');
        }),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      password: Joi.string().required(),
      email: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isEmail(value)) {
            return value;
          }
          return helpers.message('Поле email заполнено некорректно');
        }),
    }),
  }),
  createUser,
);

router.post('/signout', logout);

module.exports = router;
