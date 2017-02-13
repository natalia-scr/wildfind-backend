const _ = require('underscore');

const {Sightings} = require('../models/models');

module.exports = (park, callback) => {
  if (!park) {
    return callback('No park query passed');
  }
  Sightings.find({park_id: park}, (err, sightings) => {
    if (!sightings) {
      err = 'Invalid ID';
    } else if (sightings.length === 0) {
      err = 'No recordings at this park';
    }
    if (err) {
      return callback(err);
    }
    let sample = [];
    while (sample.length < 16) {
      sample.push(sightings[Math.floor(Math.random() * sightings.length)]);
    }
    let uniqueDoc = _.uniq(sample, (sighting) => {
      return sighting.animal_id.toString();
    });
    uniqueDoc = _.uniq(uniqueDoc, (sighting) => {
      return JSON.stringify(`${sighting.lat_lng.latitude},${sighting.lat_lng.longitude}`);
    });
    callback(null, uniqueDoc);
  });
};
