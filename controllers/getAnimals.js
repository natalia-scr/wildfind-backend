const async = require('async');
const Animals = require('../models/animals');
const Sightings = require('../models/sightings');

module.exports = function getAnimals (park, finalCallback) {
  async.waterfall(
    [
      findAnimals,
      addSightingTotal
    ],
    (err, data) => {
      // call finalCallback
      if (err) {
        console.log(err, 'Could not find animals');
        finalCallback(err);
      }
      finalCallback(null, data);
    }
  );

  function findAnimals (callback) {
    const query = park ? {park_ids: park} : {};
    Animals.find(query, (err, doc) => {
      if (err) {
        return callback(err);
      }
      callback(null, doc);
    });
  }

  function addSightingTotal (animals, callback) {
      // async map over the articles
      // find the comment count and add it
    async.map(animals, (animal, mapCallback) => {
      Sightings.find({animal_id: animal._id}, (err, sightings) => {
        if (err) {
          mapCallback(err);
        }
        animal = animal.toJSON();
        animal.records = sightings.length;
        animal.abundance = sightings.reduce((acc, curr) => {
          acc += curr.obs_abundance;
          return acc;
        }, 0);
        mapCallback(null, animal);
      });
    }, (err, res) => {
      if (err) {
        callback(err);
      }
      callback(null, res);
    });
  }
};
