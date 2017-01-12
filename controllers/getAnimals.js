const Animals = require('../models/animals');

module.exports = (param, callback) => {
  Animals.find(param, (err, doc) => {
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};
