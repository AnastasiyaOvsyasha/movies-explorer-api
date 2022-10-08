/* eslint-disable no-console */
require('dotenv').config();
// const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser, login, logout,
} = require('./controllers/users');

const ErrorNotFound = require('./errors/ErrorNotFound');

const { PORT = 3001, NODE_ENV, DB_CONN } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

const app = express();

// app.use(
// cors({
// origin: [
// 'http://localhost:3000',
// ],
// credentials: true,
// }),
// );

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.get('/signout', logout);
app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(1).required(),
    }),
  }),
  login,
);
app.post(
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

app.use(auth);
app.use('/movie', require('./routes/movies'));
app.use('/users', require('./routes/users'));

app.use(errorLogger);
app.use(errors());

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

mongoose.connect(NODE_ENV === 'production' ? DB_CONN : 'mongodb://localhost:27017/moviesdb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
