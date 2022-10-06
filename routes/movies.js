const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getSavedMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

// const Movie = require('../models/movie');

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
      image: Joi.string().required().min(1),
      trailerLink: Joi.string().required().min(1),
      thumbnail: Joi.string().required().min(1),
      movieId: Joi.string().hex().required().length(24),
      nameRU: Joi.string().required().min(1),
      nameEN: Joi.string().required().min(1),
    }),
  }),
  createMovie,
);

movieRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().required().length(24),
    }),
  }),
  deleteMovieById,
);
// movieRouter.delete('/movies/:id', deleteMovie);

module.exports = movieRouter;
