const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new AuthorizationError('Необходимо зарегестрироваться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
    );
  } catch (err) {
    throw new AuthorizationError('Необходимо зарегестрироваться');
  }

  req.user = payload;
  next();
};
