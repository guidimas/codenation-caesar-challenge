const express = require('express');
const app = express();
const caesar = require('./caesar');
const port = 3000;

require('dotenv/config');

app.set('view engine', 'pug');

const generateAnswerMiddleware = async (req, res, next) => {
  req.response = await caesar.generateAnswer();
  next();
}

app.get('/', generateAnswerMiddleware, (req, res) => {
  res.render('index', { token: process.env.CODENATION_TOKEN, response: req.response });
});

app.listen(port, () => console.log(`App listening on port ${port}!`))