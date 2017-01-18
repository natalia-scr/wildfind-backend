const animals = require('./animals');
const sightings = require('./sightings');
const request = require('superagent');
const async = require('async');
const fs = require('fs');

module.exports = (sightings) => {
  return sightings.map((sighting) => {
    sighting.park_name = 'Alexandra Park';
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
};

const getWikiData = (callback) => {
  async.waterfall([
    firstGetImg,
    secondGetImg,
    getText
  ], (err, res) => {
    if (err) {
      return callback(err);
    }
    return callback(null, res);
  });
};

const firstGetImg = (done) => {
  async.mapSeries(animals, (animal, mapCallback) => {
    const name = animal.wiki_name;
    console.log(animal.wiki_name);
    request
      .get(`http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&titles=${name}`)
      .end((err, res) => {
        if (err) mapCallback(err);
        for (var key in res.body.query.pages) {
          animal.photo = res.body.query.pages[key].pageimage;
          animal.smallImg = res.body.query.pages[key].thumbnail.source;
          mapCallback(null, animal);
        }
      });
  }, (err) => {
    if (err) return done(err);
    return done(null, animals);
  });
};

const secondGetImg = (newAnimalsData, done) => {
  async.mapSeries(newAnimalsData, (animal, mapCallback) => {
    const imgName = `File:${animal.photo}`.replace('&', '%26');
    request
      .get(`http://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=${imgName}`)
      .end((err, res) => {
        if (err) mapCallback(err);
        for (var key in res.body.query.pages) {
          animal.photo = res.body.query.pages[key].imageinfo[0].url;
          mapCallback(null, animal);
        }
      });
  }, (err) => {
    if (err) return done(err);
    return done(null, newAnimalsData);
  });
};

const getText = (newAnimalsData, done) => {
  async.mapSeries(newAnimalsData, (animal, mapCallback) => {
    const name = animal.wiki_name;
    request
      .get(`http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&titles=${name}`)
      .end((err, res) => {
        if (err) mapCallback(err);
        for (var key in res.body.query.pages) {
          animal.description = res.body.query.pages[key].extract;
          mapCallback(null, animal);
        }
      });
  }, (err) => {
    if (err) return done(err);
    return done(null, newAnimalsData);
  });
};

const save = (err, res) => {
  if (err) return console.log(err);
  fs.writeFile(`formattedAnimals.js`, JSON.stringify(res), (err) => {
    if (err) console.log(err);
    console.log('file saved');
  });
};
