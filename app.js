/* eslint-disable no-console */
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000, NODE_ENV, DB_CONN } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000',
      // 'https://diploma.praktikum.nomoredomains.icu',
      // 'http://diploma.praktikum.nomoredomains.icu',
    ],
    credentials: true,
  }),
);

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
mongoose.connect(
  NODE_ENV === 'production' ? DB_CONN : 'mongodb://localhost:27017/moviesdb',
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use(require('./routes'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
