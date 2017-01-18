const async = require('async');

const {Sightings, Animals} = require('../models/models');

module.exports = (user, finalCallback) => {
  if (!user) {
    return finalCallback('No user query passed');
  }
  async.waterfall([
    findSightings,
    addAnimalInfo
  ], (err, data) => {
    if (err) {
      return finalCallback(err);
    }
    return finalCallback(null, data);
  });

  function findSightings (callback) {
    Sightings.find({observer_id: user}, (err, doc) => {
      if (!doc) {
        err = 'Invalid ID';
      } else if (!doc.length) {
        err = 'No sightings recorded';
      }
      if (err) {
        return callback(err);
      }
      return callback(null, doc);
    });
  }

  function addAnimalInfo (sightings, callback) {
    async.map(sightings, (sighting, mapCallback) => {
      Animals.find({_id: sighting.animal_id}, (err, animals) => {
        if (err) {
          return mapCallback(err);
        }
        sighting = sighting.toJSON();
        sighting.taxon_group = animals[0].taxon_group;
        sighting.latin_name = animals[0].latin_name;
        mapCallback(null, sighting);
      });
    }, (err, res) => {
      if (err) {
        callback(err);
      }

      callback(null, res);
    });
  }
};
