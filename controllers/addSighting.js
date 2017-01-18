const {Sightings} = require('../models/models');

module.exports = (sighting, callback) => {
  if (!sighting.obs_comment) {
    sighting.obs_comment = '';
  } else if (sighting.obs_comment.length > 1000) {
    return callback('Above maximum comment length');
  }
  const newSighting = new Sightings({
    park_id: sighting.park_id,
    animal_id: sighting.animal_id,
    observer_id: sighting.observer_id,
    lat_lng: sighting.lat_lng,
    date: new Date(),
    obs_abundance: sighting.obs_abundance,
    obs_comment: sighting.obs_comment
  });

  newSighting.save((err) => {
    if (err) {
      return callback(err);
    }
    callback(null, newSighting);
  });
};
