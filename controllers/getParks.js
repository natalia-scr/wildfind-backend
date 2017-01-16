const Parks = require('../models/parks');

module.exports = (callback) => {
  Parks.find((err, doc) => {
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};
