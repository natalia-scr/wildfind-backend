const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const {DB} = require('../config.js');
const router = require('../routes/apiRouter');

mongoose.connect(DB.dev, (err) => {
  if (!err) console.log('connected to database');
  else console.log('error connecting to database');
});

app.use(bodyParser.json());

app.use('/api', router);

app.get('/', function (req, res) {
  res.send('WildFind App');
});

app.listen(3000, () => {
  console.log('tuned in to 3000 FM');
});
