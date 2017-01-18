var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SightingSchema = new Schema({
  park_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  animal_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  observer_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  animal_name: {
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
  date: {
    type: String,
    required: true
  },
  spatial_ref: {
    type: String
  },
  obs_comment: {
    type: String,
    default: ''
  },
  obs_abundance: {
    type: Number,
    required: true,
    default: 1
  },
  obs_photo: {
    type: String
  }
});

module.exports = mongoose.model('sightings', SightingSchema);
