const express = require('express');
const router = express.Router();

const {getAnimals, getSightings, addUser, getUserSightings, addSighting, getAnimalSightings} = require('../controllers/controllers');
const {Users} = require('../models/models');

router.get('/animals', (req, res) => {
  const park = req.query.park;
  console.log(park);
  getAnimals(park, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({ animals: data });
  });
});

// router.get('/users', (req, res) => {
//   getUsers((err, data) => {
//     if (err) {
//       return res.status(404).json({reason: 'Not Found'});
//     }
//     res.status(200).json({users: data});
//   });
// });
//
// function getUsers (callback) {
//   Users.find((err, data) => {
//     if (err) {
//       callback(err);
//     }
//     callback(null, data);
//   });
// }

router.post('/adduser', (req, res) => {
  addUser(req.body, (err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
    }
    res.status(200).json({user: data});
  });
});

router.get('/sightings', (req, res) => {
  getSightings((err, data) => {
    if (err) {
      return res.status(404).json({reason: 'Not Found'});
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
  getUserSightings(req.query.user, (err, data) => {
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
