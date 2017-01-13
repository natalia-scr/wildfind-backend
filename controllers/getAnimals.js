var {ObjectId} = require('mongodb');

const Animals = require('../models/animals');

module.exports = (park, callback) => {
  const query = park ? {park_ids: park} : {};
  Animals.find(query, (err, doc) => {

    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};
