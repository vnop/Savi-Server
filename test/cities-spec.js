'use strict'

const fs = require('fs');
const path = require('path');
const db = require('../db/db');
const express = require('express');
const expect = require('expect.js');
const request = require('supertest');
const Sequelize = require('sequelize');

const config = require('../config/config');
const compareSomeKeys = require('./lib/test-helpers');

const schema = new Sequelize('test', config.uname, config.password, {logging: false});
const port = 1337;

describe('Cities endpoints', () => {
  var server, app;
  var city1Expected, city2Expected;

  before((done) => {
    city1Expected = {name: 'Gotham', mainImage: 'gotham_city.jpg'};
    city2Expected = {name: 'Metropolis', mainImage: 'metropolis_city.jpg'};

    db.syncTables(true, schema).then(() => {
      let cities = [];
      cities.push(db.City.create(city1Expected));
      cities.push(db.City.create(city2Expected));
      Promise.all(cities).then(() => {done()});
    });
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
    fs.unlinkSync(path.join(__dirname, '../img/' + 'central-city_city.jpg'));
    db.syncTables(true, schema).then(() => {done()});
    // done();
  });

  it('/api/cities should respond', (done) => {
    request(server).get('/api/cities').expect(200, done);
  });

  it('/api/cities?cityId=X should respond with cities previously added', (done) => {
    request(server).get('/api/cities').expect('[{"id":1,"name":"Gotham","mainImage":"gotham_city.jpg"},{"id":2,"name":"Metropolis","mainImage":"metropolis_city.jpg"}]', done);
  });

  it('/api/cities? should respond with a single city by id', (done) => {
    request(server).get('/api/cities?cityId=1').expect('{"id":1,"name":"Gotham","mainImage":"gotham_city.jpg"}', done);
  });

  it('post to /api/cities should create a new city', (done) => {
    request(server).post('/api/cities').send({name: 'Central City', mainImage: 'http://i.imgur.com/w1S5ZM5.jpg'}).expect('created Central City', done);
  });

  it('newly created city should respond correctly', (done) => {
    request(server).get('/api/cities?cityId=3').end((err, res) => {
      expect(compareSomeKeys({name: 'Central City', mainImage: 'central-city_city.jpg'}, res.body)).to.equal(true, 'server should be able to serve newly created city');
      done();
    })
  });

  it('post to /api/cities should respond with error for bad post body', (done) => {
    request(server).post('/api/cities').send({datum: 'Item', otherDatum: 'Other Item'}).expect(400, done);
  });

});