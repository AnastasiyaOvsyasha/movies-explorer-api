const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUserProfile } = require('../controllers/users');

const userRouter = Router();

userRouter.get('/users/me', getCurrentUser);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(1),
      email: Joi.string().required().min(1),
    }),
  }),
  updateUserProfile,
);

module.exports = userRouter;
