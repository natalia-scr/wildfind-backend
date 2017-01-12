var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const AnimalSchema = new Schema({
  common_name: {
    type: String,
    required: true
  },
  latin_name: {
    type: String,
    required: true
  },
  taxon_group: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('animals', AnimalSchema);
