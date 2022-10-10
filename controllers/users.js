const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const AuthorizationError = require('../errors/AuthorizationError');
const ErrorServer = require('../errors/ErrorServer');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
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
          return next(new ErrorConflict('Данный email уже зарегестрирован'));
        }
        return next(new ErrorServer('Ошибка на сервере'));
      });
  });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
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

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'none',
          });
          res.send({ data: user.toJSON() });
        } else {
          next(
            new AuthorizationError(
              'Некорректно введены имя пользователя или пароль',
            ),
          );
        }
      });
    })
    .catch(() => {
      next(
        new AuthorizationError(
          'Некорректно введены имя пользователя или пароль',
        ),
      );
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({
    status: 'Выход выполнен',
  });
};
