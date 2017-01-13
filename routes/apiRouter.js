const express = require('express');
const router = express.Router();

const {getAnimals, getSightings} = require('../controllers/controllers');

router.get('/animals', (req, res) => {
  const park = req.query.park;
  getAnimals(park, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({ animals: data });
  });
});

router.get('/random-sightings', (req, res) => {
  getSightings((err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({sightings: data});
  });
});

module.exports = router;
