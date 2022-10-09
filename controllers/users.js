const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const AuthorizationError = require('../errors/AuthorizationError');
const ErrorServer = require('../errors/ErrorServer');
const ErrorBadRequest = require('../errors/ErrorBadRequest');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new ErrorConflict(
                'Данный email уже зарегестрирован',
              ),
            );
          }
          return next(new ErrorServer('Ошибка на сервере'));
        });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        res.send(user);
      }
      next(new ErrorNotFound('Пользователь не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Id пользователя введён некорректно'));
      }
      next(new ErrorServer('Произошла ошибка'));
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
            { expiresIn: '7d' },
          );
          res.status(200).send({ token });
        } else {
          next(new AuthorizationError('Некорректно введены имя пользователя или пароль'));
        }
      });
    })
    .catch(() => {
      next(new AuthorizationError('Некорректно введены имя пользователя или пароль'));
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({
    status: 'Выход выполнен',
  });
};
