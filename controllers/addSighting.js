const {Sightings} = require('../models/models');

module.exports = (sighting, callback) => {
  console.log(sighting);
  const newSighting = new Sightings({
    park_id: sighting.park_id,
    animal_id: sighting.animal_id,
    observer_id: sighting.observer_id,
    lat_lng: sighting.lat_lng,
    date: new Date(),
    obs_abundance: sighting.obs_abundance
  });
  console.log(newSighting);
  newSighting.save((err) => {
    if (err) {
      return callback(err);
    }
    callback(null, newSighting);
  });
};