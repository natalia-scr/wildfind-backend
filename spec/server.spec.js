/* eslint-env mocha */
process.env.NODE_ENV = 'test';
require('../server/server.js');
const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');

const PORT = require('../config').PORT[process.env.NODE_ENV];
const ROOT = `http://localhost:${PORT}`;

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
          console.log(res.body);
          expect(res.statusCode).to.equal(200);
          expect(res.body.parks.length).to.equal(1);
          expect(res.body.parks).to.be.an('array');
          // expect(res.body.parks[0]).to.have.all.keys(topicKeys);
          done();
        });
    });
  });
});
