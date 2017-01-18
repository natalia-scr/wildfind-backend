const express = require('express');
const router = express.Router();

const {getParks, getAnimals, getSightings, addUser, getUserSightings, addSighting, getAnimalSightings} = require('../controllers/controllers');

router.post('/adduser', (req, res, next) => {
  addUser(req.body, (err, data) => {
    if (err) {
      if (err === 'Name too long') {
        return res.status(400).json({error: {message: err}});
      }
      return next(err);
    }
    res.status(200).json({user: data});
  });
});

router.get('/parks', (req, res, next) => {
  getParks((err, data) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ parks: data });
  });
});

router.get('/animals', (req, res, next) => {
  const park = req.query.park;
  getAnimals(park, (err, data) => {
    if (err) {
      if (err === 'No recordings at this park') {
        return res.status(404).json(({error: {message: err}}));
      }

      return next(err);
    }
    res.status(200).json({ animals: data });
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

router.get('/animalsightings', (req, res, next) => {
  getAnimalSightings(req.query.animal_id, (err, data) => {
    if (err) {
      if (err === 'No animal query passed') {
        return res.status(400).json({error: {message: err}});
      }
      if (err === 'No sightings recorded') {
        return res.status(404).json({error: {message: err}});
      }
      return next(err);
    }
    res.status(200).json({sightings: data});
  });
});

router.get('/userlog', (req, res, next) => {
  getUserSightings(req.query.user_id, (err, data) => {
    if (err) {
      if (err === 'No user query passed') {
        return res.status(400).json({error: {message: err}});
      }
      if (err === 'No sightings recorded') {
        return res.status(404).json({error: {message: err}});
      }
      return next(err);
    }
    return res.status(200).json({sightings: data});
  });
});

router.post('/addsighting', (req, res, next) => {
  addSighting(req.body.sighting, (err, data) => {
    if (err) {
      if (err === 'Above maximum comment length') {
        return res.status(400).json({error: {message: err}});
      }
      return next(err);
    }
    res.status(200).json({sighting: data});
  });
});

module.exports = router;
