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

describe('Bookings endpoint', () => {
  var server, app;
  var city1Expected, city2Expected;
  var tour1Expected, tour2Expected, tour3Expected, tour4Expected;
  var user1Expected, user2Expected, user3Expected;
  var offering1expected, offering2expected, offering3expected, offering4expected;
  before((done) => {
    city1Expected = {name: 'Gotham', mainImage: 'gotham_city.jpg'};
    city2Expected = {name: 'Metropolis', mainImage: 'metropolis_city.jpg'};

    tour1Expected = {cityId: 1, title: 'Tour 1', description: 'First tour', mainImage: 'tour1.jpg'};
    tour2Expected = {cityId: 1, title: 'Tour 2', description: 'Second tour', mainImage: 'tour2.jpg'};
    tour3Expected = {cityId: 2, title: 'Tour 3', description: 'Third tour', mainImage: 'tour3.jpg'};
    tour4Expected = {cityId: 2, title: 'Tour 4', description: 'Fourth tour', mainImage: 'tour4.jpg'};

    offering1expected = {cityId: 1, userId: 1, userType: 'Driver', seats: 0, date: '00-00-0000'};
    offering2expected = {cityId: 1, userId: 2, userType: 'Tour Guide', seats: 0, date: '00-00-0000'};
    offering3expected = {cityId: 1, userId: 1, userType: 'Driver', seats: 0, date: '00-00-0001'};
    offering4expected = {cityId: 1, userId: 2, userType: 'Tour Guide', seats: 0, date: '00-00-0001'};

    user1Expected = {
      type: 'Driver',
      userName: 'Bruce Wayne',
      userEmail: 'bwayne@wayneenterprises.com',
      mdn: '202-555-0173',
      country: 'USA',
      photo: 'bruce-wayne.jpg',
      city: 'Gotham',
      userAuthId: 'ABCDEFGHIJKLMNOP1'
    }

    user2Expected = {
      type: 'Tour Guide',
      userName: 'Barbara Gordon',
      userEmail: 'bgordon@gcpd.gov',
      mdn: '202-555-0174',
      country: 'USA',
      photo: 'barbara-gordon.jpg',
      cityId: 'Gotham',
      userAuthId: 'ABCDEFGHIJKLMNOP2'
    }

    user3Expected = {
      type: 'Tourist',
      userName: 'Dick Grayson',
      userEmail: 'nightwing@gotham.gov',
      mdn: '202-555-0175',
      country: 'USA',
      photo: 'dick-grayson.jpg',
      cityId: 'Gotham',
      userAuthId: 'ABCDEFGHIJKLMNOP3'
    }
    db.syncTables(true, schema).then(() => {
      let cities = [];
      cities.push(db.City.create(city1Expected));
      cities.push(db.City.create(city2Expected));
      Promise.all(cities).then(() => {
        let toursAndUsers = [];
        toursAndUsers.push(db.Tour.create(tour1Expected));
        toursAndUsers.push(db.Tour.create(tour2Expected));
        toursAndUsers.push(db.Tour.create(tour3Expected));
        toursAndUsers.push(db.Tour.create(tour4Expected));
        toursAndUsers.push(db.UserData.create(user1Expected));
        toursAndUsers.push(db.UserData.create(user2Expected));
        toursAndUsers.push(db.UserData.create(user3Expected));
        toursAndUsers.push(db.Offering.create(offering1expected));
        toursAndUsers.push(db.Offering.create(offering2expected));
        toursAndUsers.push(db.Offering.create(offering3expected));
        toursAndUsers.push(db.Offering.create(offering4expected));
        Promise.all(toursAndUsers).then(() => {done()});
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
    db.syncTables(true, schema).then(() => {done()});
  });

  it('/api/bookings should respond with 400 if no/incorrect queries supplied', (done) => {
    request(server).get('/api/bookings').expect(400, done);
  });

  it('/api/bookings should respond with a booking object with queried', (done) => {
    request(server).get('/api/bookings?tourId=1&date=00-00-0000&userId=ABCDEFGHIJKLMNOP3').end((err, res) => {
      expect(compareSomeKeys(user1Expected, res.body.driver)).to.equal(true, 'Should have the correct driver');
      expect(compareSomeKeys(user2Expected, res.body.guide)).to.equal(true, 'Should have the correct tourguide');
      expect(compareSomeKeys(city1Expected, res.body.city)).to.equal(true, 'Should have the correct city');
      expect(compareSomeKeys(tour1Expected, res.body.tour)).to.equal(true, 'Should have the correct tour');
      expect(res.body.date).to.equal('00-00-0000', 'should have the correct date');
      done();
    });
  });

  it('/api/bookings should respond with a list of bookings if queried only with a userId', (done) => {
    request(server).get('/api/bookings?userId=ABCDEFGHIJKLMNOP3').end((err, res) => {
      expect(compareSomeKeys(user1Expected, res.body[0].driver)).to.equal(true, 'Should have the correct driver');
      expect(compareSomeKeys(user2Expected, res.body[0].guide)).to.equal(true, 'Should have the correct tourguide');
      expect(compareSomeKeys(city1Expected, res.body[0].city)).to.equal(true, 'Should have the correct city');
      expect(compareSomeKeys(tour1Expected, res.body[0].tour)).to.equal(true, 'Should have the correct tour');
      expect(res.body[0].date).to.equal('00-00-0000', 'should have the correct date');
      done();
    });
  });

  it('/api/bookings should respond with a failure if there are no offerings', (done) => {
    request(server).get('/api/bookings?tourId=1&date=00-00-0000&userId=ABCDEFGHIJKLMNOP3').expect('"We were unable to book you with the given parameters"', done);
  });

  it('/api/bookings should respond with an error if the userId does not exist', (done) => {
    request(server).get('/api/bookings?tourId=1&date=00-00-0001&userId=ABCDEFGHIJKLMNOP4').expect('"user does not exist"', done);
  });
});