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
    while (sample.length < 10) {
      sample.push(sightings[Math.floor(Math.random() * sightings.length)]);
    }
    const uniqueDoc = _.uniq(sample, (sighting) => {
      return sighting.animal_id.toString();
    });
    callback(null, uniqueDoc);
  });
};
