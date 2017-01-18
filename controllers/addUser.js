const {Users} = require('../models/models');

module.exports = (user, callback) => {
  if (user.name.length > 15) {
    return callback('Name too long');
  }
  var newUser = new Users(user);
  newUser.save((err) => {
    if (err) {
      return callback(err);
    }
    var userId = newUser._id;
    callback(null, userId);
  });
};
