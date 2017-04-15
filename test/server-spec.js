'use strict'

const request = require('supertest');
const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');
const testDBSetup = require('./testDBSetup');
const db = require('../db/db');

const port = 1337;

describe('server load test', () => {
  var server, app;
  before((done) => {
    testDBSetup(db).then(done);
  });

  beforeEach(() => {
    app = express();
    require('../routes')(app, express, db);
    server = app.listen(port, () => {
      console.log('server listening on', port);
    });
  });
  afterEach((done) => {
    server.close(done);
  });

  it('/api/cities/ should respond', (done) => {
    request(server).get('/api/cities').expect(200, done);
  });

  it('/api/tours/ should respond', (done) => {
    request(server).get('/api/tours').expect(200, done);
  });

  it('should respond with 404 for unknown route', (done) => {
    request(server).get('/unknown').expect(404, done);
  });

  it('This test is a test test', (done) => {
    request(server).get('/api/cities').end((err, res) => {
      console.log(res);
      done();
    });
  });
});