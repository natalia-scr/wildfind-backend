const async = require('async');
const {Sightings, Animals, Parks, Users} = require('../models/models');
const parks = require('./data/parks');

const formatSightings = require('./data/formatData');
const log4js = require('log4js');
const logger = log4js.getLogger();

const animals = [{
  'taxon_group': 'Bird',
  'latin_name': 'Aix galericulata',
  'common_name': 'Mandarin Duck',
  'wiki_name': 'mandarin_duck',
  'photo': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Pair_of_mandarin_ducks.jpg',
  'smallImg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Pair_of_mandarin_ducks.jpg/200px-Pair_of_mandarin_ducks.jpg',
  'description': 'The mandarin duck (Aix galericulata) is a perching duck species found in East Asia. It is medium-sized, at 41–49 cm (16–19 in) long with a 65–75 cm (26–30 in) wingspan. It is closely related to the North American wood duck, the only other member of the genus Aix. Aix is an Ancient Greek word used by Aristotle to refer to an unknown diving bird, and galericulata is the Latin for a wig, derived from galerum, a cap or bonnet.'
}, {
  'taxon_group': 'Bird',
  'latin_name': 'Turdus iliacus',
  'common_name': 'Redwing',
  'wiki_name': 'redwing',
  'photo': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Redwing_Turdus_iliacus.jpg',
  'smallImg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Redwing_Turdus_iliacus.jpg/200px-Redwing_Turdus_iliacus.jpg',
  'description': 'The redwing (Turdus iliacus) is a bird in the thrush family, Turdidae, native to Europe and Asia, slightly smaller than the related song thrush.\n\n'
}, {
  'taxon_group': 'Bird',
  'latin_name': 'Columba livia (feral)',
  'common_name': 'Feral Pigeon',
  'wiki_name': 'feral_pigeon',
  'photo': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Rock_Pigeon_Columba_livia.jpg',
  'smallImg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rock_Pigeon_Columba_livia.jpg/200px-Rock_Pigeon_Columba_livia.jpg',
  'description': 'Feral pigeons (Columba livia domestica), also called city doves, city pigeons, or street pigeons, are pigeons that are derived from the domestic pigeons that have returned to the wild. The domestic pigeon was originally bred from the wild rock dove, which naturally inhabits sea-cliffs and mountains. Rock (i.e., \'wild\'), domestic, and feral pigeons are all the same species and will readily interbreed. Feral pigeons find the ledges of buildings to be a substitute for sea cliffs, have become adapted to urban life, and are abundant in towns and cities throughout much of the world.'
}, {
  'taxon_group': 'Bird',
  'latin_name': 'Aythya fuligula',
  'common_name': 'Tufted Duck',
  'wiki_name': 'tufted_duck',
  'photo': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Tufted-Duck-male-female.jpg',
  'smallImg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Tufted-Duck-male-female.jpg/144px-Tufted-Duck-male-female.jpg',
  'description': 'The Tufted duck (Aythya fuligula) is a small diving duck with a population of close to one million birds. The scientific name is derived from Ancient Greek aithuia an unidentified seabird mentioned by authors including Hesychius and Aristotle, and Latin, fuligo \'soot\' and gula \'throat\'.'
}]

let sightings =  [{
   'animal_name': 'Redwing',
   'date': '30/07/2011',
   'spatial_ref': 'SJ83449511',
   'obs_abundance': 1,
   'obs_comment': '',
   'latitude': 53.452484,
   'longitude': -2.2508325
 },
 {
   'animal_name': 'Redwing',
   'date': '28/01/2012',
   'spatial_ref': 'SJ83419535',
   'obs_abundance': 1,
   'obs_comment': '',
   'latitude': 53.454641,
   'longitude': -2.251297
 },
 {
   'animal_name': 'Feral Pigeon',
   'date': '30/07/2011',
   'spatial_ref': 'SJ83589482',
   'obs_abundance': 1,
   'obs_comment': '',
   'latitude': 53.449882,
   'longitude': -2.2487091
 },
 {
   'animal_name': 'Tufted Duck',
   'date': '28/01/2012',
   'spatial_ref': 'SJ83419535',
   'obs_abundance': 2,
   'obs_comment': '',
   'latitude': 53.454641,
   'longitude': -2.251297
 },
 {
   'animal_name': 'Mandarin Duck',
   'date': '28/01/2012',
   'spatial_ref': 'SJ83429501',
   'obs_abundance': 1,
   'obs_comment': '',
   'latitude': 53.451585,
   'longitude': -2.2511283
 }];

sightings = formatSightings(sightings);

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

const addSightings = (done) => {
  async.waterfall([
    addParkId,
    addAnimalId,
    addUserId,
    saveSightings,
    addParkIdToAnimal
  ], (err, data) => {
    if (err) {
      console.log(JSON.stringify(err));
      done(err);
    }
    done(data);
  });
};

 const addParkId = (done) => {
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

 const addAnimalId = (done) => {
   var animalArr = [];
   async.eachSeries(sightings, (sighting, eachCallback) => {
     Animals.find({common_name: sighting.animal_name}, (err, doc) => {
       if (err) {
         return eachCallback(err);
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

       return eachCallback();
     });
   }, (error) => {
     if (error) return done(error);
     return done(null);
   });
 };

 const addUserId = (done) => {
   async.eachSeries(sightings, (sighting, eachCallback) => {
     Users.find((err, doc) => {
       if (err) {
         return eachCallback(err);
       }
       sighting.observer_id = doc[0]._id;
       return eachCallback();
     });
   }, (error) => {
     if (error) return done(error);
     return done(null);
   });
 };

 const saveSightings = (done) => {
   async.eachSeries(sightings, (sighting, eachCallback) => {
     var newSighting = new Sightings(sighting);
     newSighting.save((err) => {
       if (err) {
         return eachCallback(err);
       }
       return eachCallback();
     });
   }, (err) => {
     if (err) {
       return done(err);
     }
     return done();
   });
 };

 const addParkIdToAnimal = (done) => {
   const animalIds = [];

   async.eachSeries(sightings, (sighting, cb) => {
     if (animalIds.indexOf(sighting.animal_id) === -1) {
       animalIds.push(sighting.animal_id);

       Animals.findById(sighting.animal_id, (err, animal) => {
         if (err) return cb(err);
         animal.park_ids = animal.park_ids ? animal.park_ids.concat(sighting.park_id.toString()) : [sighting.park_id.toString()];
         animal.save((err, updatedAnimal) => {
           if (err) {
             return cb(err);
           }
           return cb(null);
         });
       });
     } else {
       cb(null);
     }
   }, (err) => {
     if (err) {
       return done(err);
     }
     let ids = {};
     ids.animal = sightings[0].animal_id.toString();
     ids.park = sightings[0].park_id.toString();
     ids.user = sightings[0].observer_id.toString();
     return done(null, ids);
   });
 };

const saveTestData = (cb) => {
  async.waterfall(
    [addDefaultUser, addParks, addAnimals, addSightings],
    (data, err) => {
      if (err) console.log(err);
      else {
        console.log('Test data seeded successfully.');
        cb(data);
      }
    });
};

module.exports = saveTestData;
