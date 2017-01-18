const {Parks} = require('../models/models');

module.exports = (callback) => {
  Parks.find((err, doc) => {
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });
};
