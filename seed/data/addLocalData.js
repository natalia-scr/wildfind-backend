let localSightings = [
  {
    'animal_name': 'Blackbird',
    'spatial_ref': 'SJ83449511',
    'obs_abundance': 1,
    'obs_comment': '',
    'latitude': 53.501823,
    'longitude': -2.194366
  }, {
    'animal_name': 'Mandarin Duck',
    'spatial_ref': 'SJ83479518',
    'obs_abundance': 1,
    'obs_comment': '',
    'latitude': 53.501834,
    'longitude': -2.194133
  }, {
    'animal_name': 'Feral Pigeon',
    'spatial_ref': 'SJ83589482',
    'obs_abundance': 1,
    'obs_comment': '',
    'latitude': 53.501611,
    'longitude': -2.194235
  }, {
    'animal_name': 'Tufted Duck',
    'spatial_ref': 'SJ83419535',
    'obs_abundance': 2,
    'obs_comment': '',
    'latitude': 53.502099,
    'longitude': -2.194964
  }, {
    'animal_name': 'Redwing',
    'spatial_ref': 'SJ83429501',
    'obs_abundance': 1,
    'obs_comment': '',
    'latitude': 53.502019,
    'longitude': -2.195377
  }, {
    'animal_name': 'Goosander',
    'spatial_ref': 'SJ83479522',
    'obs_abundance': 1,
    'obs_comment': '',
    'latitude': 53.501875,
    'longitude': -2.195812
  }, {
    'animal_name': 'Canada Goose',
    'spatial_ref': 'SJ83519516',
    'obs_abundance': 2,
    'obs_comment': '',
    'latitude': 53.501668,
    'longitude': -2.196080
  }, {
    'animal_name': 'Mallard',
    'spatial_ref': 'SJ83619478',
    'obs_abundance': 6,
    'obs_comment': '',
    'latitude': 53.501457,
    'longitude': -2.196670
  }, {
    'animal_name': 'Woodpigeon',
    'spatial_ref': 'SJ83649497',
    'obs_abundance': 2,
    'obs_comment': '',
    'latitude': 53.501352,
    'longitude': -2.197132
  }, {
    'animal_name': 'Pink-footed Goose',
    'spatial_ref': 'SJ83729494',
    'obs_abundance': 1,
    'obs_comment': '',
    'latitude': 53.501448,
    'longitude': -2.195039
  }
];

module.exports = (sightings) => {
  var mappedData = localSightings.map((sighting) => {
    sighting.park_name = 'Northcoders';
    sighting.date = '18/01/2017';
    sighting.lat_lng = {
      latitude: sighting.latitude,
      longitude: sighting.longitude
    };
    const day = sighting.date.slice(0, 2);
    const month = sighting.date.slice(4, 6);
    const year = sighting.date.slice(8);
    sighting.date = new Date(`${month}/${day}/${year}`);
    return sighting;
  });
  sightings = sightings.concat(mappedData);
  return sightings;
};
