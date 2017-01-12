const Animals = require('../models/animals');

export const getAnimals = (param, callback) => {
  Animals.find(param, (err, doc) => {
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};
