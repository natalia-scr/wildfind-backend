const {Users} = require('../models/models');

module.exports = (user, callback) => {
  var newUser = new Users(user);
  newUser.save((err) => {
    if (err) {
      return callback(err);
    }
    var userId = newUser._id;
    callback(null, userId);
  });
};
