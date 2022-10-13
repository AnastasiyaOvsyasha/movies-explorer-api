const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
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
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле image (url) заполнено некорректно');
      }),
      trailerLink: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле trailerLink (url) заполнено некорректно');
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле thumbnail (url) заполнено некорректно');
      }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

movieRouter.delete(
  '/movies/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().required().length(24),
    }),
  }),
  deleteMovieById,
);

module.exports = movieRouter;
