const Movie = require('../models/movie');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  STATUS_CREATED,
} = require('../utils/constants');

module.exports.getAllUserMovies = (req, res, next) => {
  const { _id } = req.user;

  Movie.find({ owner: _id })
    .then((movies) => {
      if (!movies) { throw new ErrorNotFound('Movies not found'); }
      res.send({ data: movies });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('User ID is incorrect'));
        return;
      }
      next(err);
    });
};

module.exports.addMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.status(STATUS_CREATED).send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  const { id } = req.params;

  Movie.findById(id)
    .then((item) => {
      if (!item) { throw new ErrorNotFound('Movie not found'); }
      if (item.owner.toString() !== req.user._id) { throw new ForbiddenError('You can not delete not yours movie'); }
      return item.remove();
    })
    .then(() => {
      res.send({ message: `Movie ${id} has been removed` });
    })
    .catch((err) => {
      if (err.name === 'CastError') { // если формата id фильма специального нет, удалить условие и ошибку
        next(new ErrorBadRequest('Movie ID is incorrect'));
        return;
      }
      next(err);
    });
};
