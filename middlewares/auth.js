const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
    } catch (err) {
      next(new AuthorizationError('Необходимо авторизоваться'));
    }

    req.user = payload;

    next();
  } else {
    next(new AuthorizationError('Необходимо авторизоваться'));
  }
};

module.exports = auth;
