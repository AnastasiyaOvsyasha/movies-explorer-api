/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;

const app = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
}
main();
