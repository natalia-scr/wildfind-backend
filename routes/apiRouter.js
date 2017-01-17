const express = require('express');
const router = express.Router();

const {getParks, getAnimals, getSightings, addUser, getUserSightings, addSighting, getAnimalSightings} = require('../controllers/controllers');

router.get('/parks', (req, res) => {
  getParks((err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({ parks: data });
  });
});

router.get('/animals', (req, res, next) => {
  const park = req.query.park;
  getAnimals(park, (err, data) => {
    if (err) {
      if (err === 'No animals found') return res.status(404).json(({reason: 'No recordings at this park'}));
      return next(err);
    }
    res.status(200).json({ animals: data });
  });
});

router.post('/adduser', (req, res) => {
  addUser(req.body, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({user: data});
  });
});

router.get('/sightings', (req, res, next) => {
  getSightings(req.query.park, (err, data) => {
    if (err) {
      if (err === 'No park query passed') {
        return res.status(400).json({error: {message: err}});
      }
      if (err === 'No recordings at this park') {
        return res.status(404).json({error: {message: err}});
      }
      return next(err);
    }
    res.status(200).json({sightings: data});
  });
});

router.get('/animalsightings', (req, res) => {
  getAnimalSightings(req.query.animal_id, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({sightings: data});
  });
});

router.get('/userlog', (req, res) => {
  getUserSightings(req.query.user_id, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    return res.status(200).json({sightings: data});
  });
});

router.post('/addsighting', (req, res) => {
  addSighting(req.body.sighting, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({sighting: data});
  });
});

module.exports = router;
