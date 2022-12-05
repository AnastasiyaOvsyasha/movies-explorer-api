const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');
const { validateId } = require('../utils/validateId');

const movieValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле постер к фильму заполнено некорректно');
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле трейлер к фильму заполнено некорректно');
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message(
          'Поле миниатюра постера к фильму заполнено некорректно',
        );
      }),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom(validateId),
  }),
});

const userUpdateValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: false } }),
  }),
});

const userCreateValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const userLoginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
});

module.exports = {
  movieValidation,
  movieIdValidation,
  userCreateValidation,
  userUpdateValidation,
  userLoginValidation,
};
