const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const app = express();
const _ = require('underscore');
const db = 'mongodb://localhost/test-park-project';
const Animals = require('../models/animals');
const Sightings = require('../models/sightings');

mongoose.connect(db, (err) => {
  if (!err) console.log('connected to database');
  else console.log('error connecting to database');
});

const getAnimals = (param, callback) => {
  Animals.find(param, (err, doc) => {
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};

const getSightings = (callback) => {
  Sightings.aggregate(
   [ { $sample: { size: 10 } } ], (err, doc) => {
     if (err) {
       return callback(err);
     }

     var filteredDoc = _.uniq(doc, false, (sighting) => {
       return sighting.animal_id.toString();
     });
     callback(null, filteredDoc);
   });
};

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
