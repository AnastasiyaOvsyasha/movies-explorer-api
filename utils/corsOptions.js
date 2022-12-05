const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://diploma.praktikum.nomoredomains.icu',
    'https://diploma.praktikum.nomoredomains.icu',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = {
  corsOptions,
};
