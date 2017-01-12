import animals from './animals';
import parks from '/parks';
import sightings from './sightings';

const formatSightings = () => {
  sightings.map(sighting => {
    sighting.park_name = 'Alexandra Park';
    sighting.lat_lng = {
      latitude: sighting.latitude,
      longitude: sighting.longitude
    };
    sighting.date = new Date(sighting.date);
  });
};
