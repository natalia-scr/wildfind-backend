import express from 'express';
import mongoose from 'mongoose';
// const bodyParser = require('body-parser');
const app = express();

import db from 'mongodb://localhost/test-park-project';
import {getAnimals, getSightings} from '../controllers/controllers';

mongoose.connect(db, (err) => {
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
