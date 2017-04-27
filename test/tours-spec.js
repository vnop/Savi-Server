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

describe('Tours endpoints', () => {
  var server, app;
  var city1Expected, city2Expected;
  var tour1Expected, tour2Expected, tour3Expected, tour4Expected;
  before((done) => {
    city1Expected = {name: 'Gotham', mainImage: 'gotham_city.jpg'};
    city2Expected = {name: 'Metropolis', mainImage: 'metropolis_city.jpg'};

    tour1Expected = {cityId: 1, title: 'Tour 1', description: 'First tour', mainImage: 'tour1.jpg'};
    tour2Expected = {cityId: 1, title: 'Tour 2', description: 'Second tour', mainImage: 'tour2.jpg'};
    tour3Expected = {cityId: 2, title: 'Tour 3', description: 'Third tour', mainImage: 'tour3.jpg'};
    tour4Expected = {cityId: 2, title: 'Tour 4', description: 'Fourth tour', mainImage: 'tour4.jpg'};
    db.syncTables(true, schema).then(() => {
      let cities = [];
      cities.push(db.City.create(city1Expected));
      cities.push(db.City.create(city2Expected));
      Promise.all(cities).then(() => {
        let tours = [];
        tours.push(db.Tour.create(tour1Expected));
        tours.push(db.Tour.create(tour2Expected));
        tours.push(db.Tour.create(tour3Expected));
        tours.push(db.Tour.create(tour4Expected));
        Promise.all(tours).then(() => {done()});
      });
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
    fs.unlinkSync(path.join(__dirname, '../img/' + 'gotham-eats_tour.jpg'));
    db.syncTables(true, schema).then(() => {done()});
    // done();
  });

  it('/api/tours/ should respond', (done) => {
    request(server).get('/api/tours').expect(200, done);
  });

  it('/api/tours/ should handle requesting tours by city', (done) => {
    request(server).get('/api/tours?cityId=1').end((err, res) => {
      expect(res.body.length).to.equal(2, 'should have exactly two tours');
      expect(compareSomeKeys(tour1Expected, res.body[0])).to.equal(true, 'should have the first tour');
      expect(compareSomeKeys(tour2Expected, res.body[1])).to.equal(true, 'should have the second tour');
      let hasCityTwoTours = false;
      for (var element of res.body) {
        hasCityTwoTours = hasCityTwoTours || element.cityId===2;
      }
      expect(hasCityTwoTours).to.equal(false, 'Should not have any tours from city 2');
      done();
    });
  });

  it('/api/tours?tourId=X should respond with the expected tour', (done) => {
    request(server).get('/api/tours?tourId=1').end((err, res) => {
      expect(compareSomeKeys(tour1Expected, res.body)).to.equal(true, 'should return exactly the first tour');
      done();
    });
  });

  it('post to /api/tours should create a new tour', (done) => {
    request(server).post('/api/tours').send({title: 'Gotham Eats', mainImage: 'http://i.imgur.com/zxPr3e8.jpg', description: 'Get some good eats in Gotham City', cityId: 1}).expect('created Gotham Eats', done);
  });

  it('post to /api/tours return an error when adding a tour to a city that does not exist', (done) => {
    request(server).post('/api/tours').send({title: 'Gotham Eats', mainImage: 'http://i.imgur.com/zxPr3e8.jpg', description: 'Get some good eats in Gotham City', cityId: 100}).expect(500, done);
  });

  it('newly created tour should respond correctly', (done) => {
    request(server).get('/api/tours?tourId=5').end((err, res) => {
      expect(compareSomeKeys({title: 'Gotham Eats', mainImage: 'gotham-eats_tour.jpg', description: 'Get some good eats in Gotham City', cityId: 100}, res.body)).to.equal(true, 'server should be able to serve newly created tour');
      done();
    })
  });

  it('post to /api/tours should respond with error for bad post body', (done) => {
    request(server).post('/api/tours').send({datum: 'Item', otherDatum: 'Other Item'}).expect(400, done);
  });
});