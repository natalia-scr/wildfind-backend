const async = require('async');

const {Sightings, Animals} = require('../models/models');

module.exports = (user, finalCallback) => {
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
    console.log(user);
    Sightings.find({observer_id: user}, (err, doc) => {
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
        console.log(animals, 'animals');
        sighting.taxon_group = animals[0].taxon_group;
        sighting.latin_name = animals[0].latin_name;
        sighting.common_name = animals[0].common_name;
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
