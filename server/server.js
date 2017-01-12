const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const app = express();

const {getAnimals, getSightings} = require('../controllers/controllers');
const {DB} = require('../config.js');

mongoose.connect(DB.dev, (err) => {
  if (!err) console.log('connected to database');
  else console.log('error connecting to database');
});

app.get('/animals', (req, res) => {
  const param = req.params;
  getAnimals(param, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({animals: data});
  });
});

app.get('/randomSightings', (req, res) => {
  getSightings((err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({sightings: data});
  });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
