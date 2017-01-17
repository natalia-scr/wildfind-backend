/* eslint-env mocha */
process.env.NODE_ENV = 'test';
require('../server/server.js');
const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');

const PORT = require('../config').PORT[process.env.NODE_ENV];
const ROOT = `http://localhost:${PORT}`;

const parkKeys = ['name', 'location', 'active', 'lat_lng', '__v', '_id'];
const animalKeys = ['common_name', 'latin_name', 'taxon_group', 'photo',
'description', 'records', 'abundance', '__v', '_id', 'park_ids'];
const sightingsKeys = ['_id', 'date', 'spatial_ref', 'park_id', 'animal_id', 'observer_id',
'obs_abundance', 'obs_comment', 'lat_lng', '__v'];

const invalidID = {error: {message: 'Invalid ID'}};
const notFound = {error: {message: 'No recordings at this park'}};

describe.only('app', function () {
  let reqIDs = {};
  before(function (done) {
    mongoose.connection.once('connected', function () {
      mongoose.connection.db.dropDatabase(function () {
        console.log('DB dropped!');
      });
      saveTestData(function (idsObj) {
        reqIDs = idsObj;
        reqIDs.invalid_id = '5842ddc7dcbf6d3bc883';
        reqIDs.incorrect_id = '584666dcbec52a5b9d852942';
        console.log(reqIDs);
        done();
      });
    });
  });
  after(function (done) {
    mongoose.connection.db.dropDatabase();
    done();
  });
  describe('GET /', function () {
    it('should return status ok', function (done) {
      request(ROOT)
        .get('/')
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.body.name).to.equal('WildFind App');
          done();
        });
    });
  });
  describe('GET /parks', function () {
    it('should return all parks', function (done) {
      request(ROOT)
        .get('/api/parks')
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.body.parks.length).to.equal(1);
          expect(res.body.parks).to.be.an('array');
          expect(res.body.parks[0]).to.have.all.keys(parkKeys);
          done();
        });
    });
  });
  describe('GET /animals', function () {
    it('should return all animals', function (done) {
      request(ROOT)
        .get('/api/animals')
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.body.animals.length).to.equal(4);
          expect(res.body.animals).to.be.an('array');
          expect(res.body.animals[0]).to.have.all.keys(animalKeys);
          done();
        });
    });
  });
  describe('GET /animals by park ID', function () {
    it('should return all animals with park ID', function (done) {
      request(ROOT)
        .get(`/api/animals?park=${reqIDs.park}`)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.body.animals.length).to.equal(4);
          expect(res.body.animals).to.be.an('array');
          expect(res.body.animals[0]).to.have.all.keys(animalKeys);
          expect(res.body.animals[0].park_ids[0]).to.equal(reqIDs.park);
          done();
        });
    });
    it('should return invalid ID message if the ID format is incorrect', (done) => {
      request(ROOT)
        .get(`/api/animals?park=${reqIDs.invalid_id}`)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.eql(invalidID);
          done();
        });
    });
    it('should return no `No recordings at this park`', (done) => {
      request(ROOT)
        .get(`/api/animals?park=${reqIDs.incorrect_id}`)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.eql({reason: 'No recordings at this park'});
          done();
        });
    });
  });
  describe(`GET /sightings`, function () {
    it('should return a random group of sightings', function (done) {
      request(ROOT)
        .get(`/api/sightings?park=${reqIDs.park}`)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.body.sightings.length).to.be.above(1);
          expect(res.body.sightings.length).to.be.below(11);
          expect(res.body.sightings).to.be.an('array');
          expect(res.body.sightings[0]).to.have.all.keys(sightingsKeys);
          expect(res.body.sightings[0].park_id).to.equal(reqIDs.park);
          done();
        });
    });
    it('should return no park id inputted if no park query is passed', (done) => {
      request(ROOT)
        .get(`/api/sightings`)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.eql({error: {message: 'No park query passed'}});
          done();
        });
    });
    it('should return invalid ID message if the ID format is incorrect', (done) => {
      request(ROOT)
        .get(`/api/sightings?park=${reqIDs.invalid_id}`)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.eql(invalidID);
          done();
        });
    });
    it('should return no `No recordings at this park`', (done) => {
      request(ROOT)
        .get(`/api/sightings?park=${reqIDs.incorrect_id}`)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.eql(notFound);
          done();
        });
    });
  });
});
