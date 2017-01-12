const express = require('express');
const router = express.Router();

const {getAnimals, getSightings} = require('../controllers/controllers');

router.get('/animals', (req, res) => {
  const param = req.params;
  getAnimals(param, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({animals: data});
  });
});

router.get('/randomSightings', (req, res) => {
  getSightings((err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({sightings: data});
  });
});

module.exports = router;
