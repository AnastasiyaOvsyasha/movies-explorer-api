const { Schema, Types, model } = require('mongoose');

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => /(https?:\/\/(([\w-]+\.)+)+([\w])+((\/[a-z_0-9\-:~\\.%\\/?#[\]@!$&'\\(\\)*+,;=]+)+)?)/g.test(v),
      message: (props) => `${props.value} — ссылка не валидна!`,
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => /(https?:\/\/(([\w-]+\.)+)+([\w])+((\/[a-z_0-9\-:~\\.%\\/?#[\]@!$&'\\(\\)*+,;=]+)+)?)/g.test(v),
      message: (props) => `${props.value} — ссылка не валидна!`,
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => /(https?:\/\/(([\w-]+\.)+)+([\w])+((\/[a-z_0-9\-:~\\.%\\/?#[\]@!$&'\\(\\)*+,;=]+)+)?)/g.test(v),
      message: (props) => `${props.value} — ссылка на миниатюру постера фильма не валидна!`,
    },
    required: true,
  },
  owner: {
    type: Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = model('movie', movieSchema);
