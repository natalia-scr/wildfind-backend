const async = require('async');
const {Animals} = require('../models/models');
const {Sightings} = require('../models/models');

module.exports = function getAnimals (park, finalCallback) {
  if (park) {
    if (park.length !== 24) {
      return finalCallback('Invalid ID');
    }
  }
  async.waterfall(
    [
      findAnimals,
      addSightingTotal
    ],
    (err, data) => {
      if (data.length === 0) {
        err = 'No recordings at this park';
      }
      if (err) {
        return finalCallback(err);
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
