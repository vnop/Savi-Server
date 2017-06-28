'use strict'

const fs = require('fs');
const path = require('path');
const db = require('../db/db');
const express = require('express');
const expect = require('expect.js');
const request = require('supertest');
const Sequelize = require('sequelize');
const helpers = require('../helpers');

const config = require('../config/config');
const compareSomeKeys = require('./lib/test-helpers');

const schema = new Sequelize('test', config.uname, config.password, {logging: false});
const port = 1337;

describe('Images endpoint', () => {
  var server, app;

  before((done) => {
    helpers.saveImage('http://i.imgur.com/zxPr3e8.jpg', 'test-img0').then(() => {done()});
  });

  beforeEach(() => {
    app = express();
    require('../routes')(app, express, db, false);
    server = app.listen(port, () => {
    });
  });
  afterEach((done) => {
    server.close(done);
  });

  after((done) => {
    fs.unlinkSync(path.join(__dirname, '../img/' + 'test-img0.jpg'));
    db.syncTables(true, schema).then(() => {done()});
    // done();
  });

  it('/api/images should return an error for a nonexistant image', (done) => {
    request(server).get('/api/images/nonexistantImage').expect(404, done);
  });

  it('/api/images should return properly for a requested image that exists', (done) => {
    request(server).get('/api/images/test-img0.jpg').expect(200, done);
  })
});