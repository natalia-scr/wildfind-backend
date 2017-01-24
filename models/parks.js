var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ParkSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  lat_lng: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  active: {
    type: Boolean,
    required: true
  },
  quote: {
    type: String
  },
  quoteAuthor: {
    type: String
  },
  quoteTitle: {
    type: String
  },
  info: {
    type: String
  }
});

module.exports = mongoose.model('parks', ParkSchema);
