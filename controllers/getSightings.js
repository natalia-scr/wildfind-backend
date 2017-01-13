const _ = require('underscore');

const Sightings = require('../models/sightings');

module.exports = (callback) => {
  Sightings.aggregate(
   [ { $sample: { size: 10 } } ], (err, doc) => {
     if (err) {
       return callback(err);
     }

     var filteredDoc = _.uniq(doc, false, (sighting) => {
       return sighting.animal_id.toString();
     });
     callback(null, filteredDoc);
   });
};
