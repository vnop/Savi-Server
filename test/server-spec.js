'use strict'

const request = require('supertest');
const express = require('express');
const http = require('http');
const port = 1337;

describe('server load test', () => {
  var server, app;
  beforeEach(() => {
    app = express();
    require('../routes')(app, express);
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
});