const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorConflict = require('../errors/ErrorConflict');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { JWT_PRODUCTION_KEY } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  STATUS_CREATED,
} = require('../utils/constants');

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.find({ _id })
    .then((user) => res.send({ data: user[0] }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, email, password: hash,
      },
    ))
    .then((user) => {
      const userWithOutPassword = user.toObject();
      delete userWithOutPassword.password;
      res.status(STATUS_CREATED).send(userWithOutPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest(err.message));
        return;
      }
      if (err.code === 11000) {
        next(new ErrorConflict(`User with email ${email} already exist`));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(`User ID ${userId} is not found`);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Invalid data passed when updating profile'));
        return;
      }
      if (err.code === 11000) {
        next(new ErrorConflict(`User with email ${email} already exist`));
        return;
      }
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('User ID is incorrect'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_PRODUCTION_KEY, { expiresIn: '7d' });
      res.cookie('authorization', token, {
        maxAge: 3600000 * 24 * 7, httpOnly: true, secure: true, sameSite: 'none', domain: 'localhost',
      }).send({ message: 'Athorization successful' });
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  const userId = req.user._id;
  res.clearCookie('authorization', { secure: true, sameSite: 'none' }).send({ message: `Signout user ${userId} is successful` });
};
