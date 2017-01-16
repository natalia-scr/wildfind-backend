const Sightings = require('../models/sightings');

module.exports = (animalId, callback) => {
  Sightings.find({animal_id: animalId}, (err, doc) => {
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};
