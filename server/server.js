if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const config = require('../config.js');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV];
const router = require('../routes/apiRouter');

console.log({
  env: process.env.NODE_ENV,
  db
});

mongoose.connect(db, (err) => {
  if (!err) console.log(`connected to database: ${db}`);
  else {
    // process.exit();
    console.log(err);
  }
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.status(200).json({name: 'WildFind App'});
});

app.use('/api', router);

app.use(function (err, req, res, next) {
  if (err === 'Invalid ID') return res.status(400).json({error: {message: 'Invalid ID'}});
  else return res.status(404).json({reason: 'Not Found'});
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`tuned in to ${PORT} FM`);
});
