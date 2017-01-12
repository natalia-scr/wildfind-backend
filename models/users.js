var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('users', UserSchema);
