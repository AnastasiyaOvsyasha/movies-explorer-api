const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getCurrentUser, updateUserInfo } = require('../controllers/users');

const userRouter = Router();

userRouter.get('/users/me', getCurrentUser);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(1),
      email: Joi.string().required().min(1).custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Email введен неверно');
      }),
    }),
  }),

  updateUserInfo,
);

module.exports = userRouter;
