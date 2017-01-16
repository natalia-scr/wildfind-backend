if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const config = require('./config.js');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
const router = require('./routes/apiRouter');

mongoose.connect(db, (err) => {
  if (!err) console.log('connected to database');
  else {
    process.exit();
    console.log(err);
  }
});

app.use(bodyParser.json());

app.use('/api', router);

app.get('/', function (req, res) {
  res.send('WildFind App');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('tuned in to 3000 FM');
});
