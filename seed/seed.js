import animals from '../data';
import parks from './data/parks';
import sightings from './data/sightings';
import {Sightings, Animals, Parks} from '../models/model';

import mongoose from 'mongoose';
import async from 'async';
import log4js from 'log4js';
const logger = log4js.getLogger();

mongoose.connect('mongodb://localhost/parkapp-test', function (err) {
  if (!err) {
    logger.info('connected to database');
    mongoose.connection.db.dropDatabase();
    async.waterfall([
      addParks,
      addAnimals,
      addSightings
    ], function (err) {
      if (err) {
        logger.error('ERROR SEEDING :O');
        console.log(JSON.stringify(err));
        process.exit();
      }
      logger.info('DONE SEEDING!!');
      process.exit();
    });
  } else {
    logger.error('DB ERROR');
    console.log(JSON.stringify(err));
    process.exit();
  }
});

function addParks (done) {
  async.eachSeries(parks, function (park, callback) {
    var parkDoc = new Parks(park);
    parkDoc.save(function (err) {
      if (err) {
        return callback(err);
      }
      return callback();
    });
  }, function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
}

function addAnimals (done) {
  async.eachSeries(animals, function (animal, callback) {
    var animalDoc = new Animals(animal);
    animalDoc.save(function (err) {
      if (err) {
        return callback(err);
      }
      return callback();
    });
  }, function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
}

function addSightings (done) {
  async.waterfall([
    findParkId,
    findAnimalId,
    addIds
  ], function (err) {
    if (err) {
      logger.error('ERROR SEEDING :O');
      console.log(JSON.stringify(err));
      process.exit();
    }
    logger.info('DONE SEEDING!!');
    process.exit();
  });
}

function findParkId (done) {
  var parkArr = [];
  async.eachSeries(sightings, function (sighting, cb) {
    Parks.find({name: sighting.park_name}, function (err, doc) {
      if (err) {
        return cb(err);
      }
      parkArr.push({name: sighting.park_name, id: doc[0]._id});

      parkArr.forEach(function (park) {
        sightings.forEach(function (sighting) {
          if (park.name === sighting.park_name) {
            sighting.park_id = park.id;
          }
        });
      });

      return cb();
    });
  }, function (error) {
    if (error) return done(error);
    return done(null);
  });
}

function findAnimalId (done) {
  var animalArr = [];
  async.eachSeries(sightings, function (sighting, cb) {
    Animals.find({common_name: sighting.animal_name}, function (err, doc) {
      if (err) {
        return cb(err);
      }
      if (doc.length) {
        animalArr.push({name: sighting.animal_name, id: doc[0]._id});
      }

      animalArr.forEach(function (animal) {
        sightings.forEach(function (sighting) {
          if (animal.name === sighting.animal_name) {
            sighting.animal_id = animal.id;
          }
        });
      });

      return cb();
    });
  }, function (error) {
    if (error) return done(error);
    return done(null);
  });
}

function addIds (done) {
  async.eachSeries(sightings, function (sighting, cb) {
    var newSighting = new Sightings(sighting);
    newSighting.save(function (err) {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  }, function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
}
