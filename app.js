const express = require('express');
const app = express();
const caesar = require('./caesar');
const port = 3000;

require('dotenv/config');

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  caesar.generateAnswer();
  res.render('index', { token: process.env.CODENATION_TOKEN });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))