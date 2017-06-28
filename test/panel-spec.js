'use strict'

const db = require('../db/db');
const express = require('express');
const request = require('supertest');
const Sequelize = require('sequelize');
const config = require('../config/config');

const schema = new Sequelize('test', config.uname, config.password, {logging: false});
const port = 1337;

describe('Admin Control Panel', () => {
  var app, server;

  before((done) => {
    db.syncTables(true, schema).then(() => {done();});
  });

  after((done) => {
    db.syncTables(true, schema).then(() => {done();});
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

  it('should respond with 200 when loading panel', (done) => {
    request(server).get('/').expect(200, done);
  });

  it('/api/cities should respond', (done) => {
    request(server).get('/api/cities').expect(200, done);
  });

  it('/api/tours should respond', (done) => {
    request(server).get('/api/tours').expect(200, done);
  });
});