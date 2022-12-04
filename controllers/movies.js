const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const ErrorBadRequest = require('../errors/ErrorBadRequest');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'При создании фильма переданы некорректные данные',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const { id: _id } = req.params;
  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new ErrorBadRequest('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          'Вы не можете удалять фильмы других пользователей',
        );
      }
      return Movie.findByIdAndDelete(_id).then(() => res.send({ message: `Movie with ID ${_id} deleted.` }));
    })
    .catch(next);
};
