let {animals, parks, sightings} = require('./data/data');
const {Sightings, Animals, Parks, Users} = require('../models/models');
const formatSightings = require('./data/formatData');
const {DB} = require('../config.js');

const mongoose = require('mongoose');
const async = require('async');
const log4js = require('log4js');
const logger = log4js.getLogger();
console.log(sightings)
sightings = formatSightings(sightings);


mongoose.connect(DB.dev, function (err) {
  if (!err) {
    logger.info('connected to database');
    mongoose.connection.db.dropDatabase();
    async.waterfall([
      addDefaultUser,
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

const addDefaultUser = (done) => {
  var defaultUser = new Users({
    name: 'default user'
  });
  defaultUser.save((err) => {
    if (err) {
      return done(err);
    }
    return done(null);
  });
};

const addParks = (done) => {
  async.eachSeries(parks, (park, callback) => {
    var parkDoc = new Parks(park);
    parkDoc.save((err) => {
      if (err) {
        return callback(err);
      }
      return callback();
    });
  }, (err) => {
    if (err) {
      return done(err);
    }
    return done(null);
  });
};

const addAnimals = (done) => {
  async.eachSeries(animals, (animal, callback) => {
    var animalDoc = new Animals(animal);
    animalDoc.save((err) => {
      if (err) {
        return callback(err);
      }
      return callback();
    });
  }, (err) => {
    if (err) {
      return done(err);
    }
    return done(null);
  });
};

function addSightings (done) {
  async.waterfall([
    findParkId,
    findAnimalId,
    addIds
  ], (err) => {
    if (err) {
      logger.error('ERROR SEEDING :O');
      console.log(JSON.stringify(err));
      process.exit();
    }
    logger.info('DONE SEEDING!!');
    process.exit();
  });
}

const findParkId = (done) => {
  var parkArr = [];
  async.eachSeries(sightings, (sighting, cb) => {
    Parks.find({name: sighting.park_name}, (err, doc) => {
      if (err) {
        return cb(err);
      }
      parkArr.push({name: sighting.park_name, id: doc[0]._id});

      parkArr.forEach((park) => {
        sightings.forEach((sighting) => {
          if (park.name === sighting.park_name) {
            sighting.park_id = park.id;
          }
        });
      });

      return cb();
    });
  }, (error) => {
    if (error) return done(error);
    return done(null);
  });
};

const findAnimalId = (done) => {
  var animalArr = [];
  async.eachSeries(sightings, (sighting, cb) => {
    Animals.find({common_name: sighting.animal_name}, (err, doc) => {
      if (err) {
        return cb(err);
      }
      if (doc.length) {
        animalArr.push({name: sighting.animal_name, id: doc[0]._id});
      }

      animalArr.forEach((animal) => {
        sightings.forEach((sighting) => {
          if (animal.name === sighting.animal_name) {
            sighting.animal_id = animal.id;
          }
        });
      });

      return cb();
    });
  }, (error) => {
    if (error) return done(error);
    return done(null);
  });
};

const addIds = (done) => {
  async.eachSeries(sightings, (sighting, cb) => {
    var newSighting = new Sightings(sighting);
    newSighting.save((err) => {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  }, (err) => {
    if (err) {
      return done(err);
    }
    return done(null);
  });
};
