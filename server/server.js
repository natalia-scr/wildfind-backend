if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const config = require('../config.js');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
const router = require('../routes/apiRouter');

mongoose.connect(db, (err) => {
  if (!err) console.log(`connected to database: ${db}`);
  else {
    process.exit();
    console.log(err);
  }
});

app.use(bodyParser.json());

app.use('/api', router);

app.get('/', function (req, res) {
  res.status(200).send({name: 'WildFind App'});
});

app.use(function (err, req, res, next) {
  if (err === 'Incorrect Format') return res.status(422).json({error: {'ID is not in the database': {comment: 'New Comment'}}});
  if (err === 'Invalid ID') return res.status(400).json({error: {message: 'Invalid ID'}});
  else return res.status(404).send({reason: 'Not Found'});
});

app.listen(PORT, () => {
  console.log(`tuned in to ${PORT} FM`);
});
