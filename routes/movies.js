const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  getSavedMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const movieRouter = Router();

movieRouter.get('/movies', getSavedMovies);

movieRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(1),
      director: Joi.string().required().min(1),
      duration: Joi.number().required().min(1),
      year: Joi.number().required().min(1),
      description: Joi.string().required().min(1),
      image: Joi.string().required().custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Поле image (url) заполнено некорректно');
      }),
      trailerLink: Joi.string().required().custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Поле trailerLink (url) заполнено некорректно');
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Поле thumbnail (url) заполнено некорректно (не соответствует формату URL)');
      }),
      movieId: Joi.string().required().min(1),
      nameRU: Joi.string().required().min(1),
      nameEN: Joi.string().required().min(1),
    }),
  }),
  createMovie,
);

movieRouter.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovieById,
);

module.exports = movieRouter;
