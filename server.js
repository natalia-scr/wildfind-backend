const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const {DB} = require('./config.js');
const router = require('./routes/apiRouter');

mongoose.connect(DB.dev, (err) => {
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
