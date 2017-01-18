const Sightings = require('../models/sightings');

module.exports = (animalId, callback) => {
  if (!animalId) {
    return callback('No animal query passed');
  }
  Sightings.find({animal_id: animalId}, (err, doc) => {
    if (!doc) {
      err = 'Invalid ID';
    } else if (!doc.length) {
      err = 'No sightings recorded';
    }
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};
