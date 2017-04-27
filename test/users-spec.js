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

describe('Users endpoint', () => {
  var user1Expected, user2Expected, cityExpected;
  var app, server;
  before((done) => {
    cityExpected = {
      name: 'Metropolis',
      mainImage: 'metropolis_city.jpg'
    }
    user1Expected = {
      type: 'Tourist',
      userName: 'Bruce Wayne',
      userEmail: 'bwayne@wayneenterprises.com',
      mdn: '202-555-0173',
      country: 'USA',
      photo: 'bruce-wayne.jpg',
      city: 'Gotham',
      userAuthId: 'ABCDEFGHIJKLMNOP1'
    };
    user2Expected = {
      type: 'Tourist',
      userName: 'Barbara Gordon',
      userEmail: 'bgordon@gcpd.gov',
      mdn: '202-555-0174',
      country: 'USA',
      photo: 'barbara-gordon.jpg',
      city: 'Gotham',
      userAuthId: 'ABCDEFGHIJKLMNOP2'
    }
    db.syncTables(true, schema).then(() => {
      db.City.create(cityExpected).then(() => {
        db.UserData.create(user1Expected).then(() => {done()});
      })
    })
  });

  after((done) => {
    fs.unlinkSync(path.join(__dirname, '../img/' + 'barbara-gordon.jpg'));
    db.syncTables(true, schema).then(() => {done()});
    // done();
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

  it('should find a user that exists', (done) => {
    request(server).post('/api/users').send({userId: user1Expected.userAuthId}).end((err, res) => {
      expect(res.body.exists).to.equal(true, 'should respond with true for a user that exists');
      expect(compareSomeKeys(user1Expected, res.body.user)).to.equal(true, 'should respond with the correct user data');
      done();
    });
  });

  it('should not find a user that does not exist', (done) => {
    request(server).post('/api/users').send({userId: user2Expected.userAuthId}).end((err, res) => {
      expect(res.body.exists).to.equal(false, 'should respond with false for a user that does not exist');
      expect(res.body.user).to.equal(null, 'should respond with null user data');
      done();
    });
  });

  it('should create a user that does not exist when given the data', (done) => {
    let newUserData = {
      name: user2Expected.userName,
      email: user2Expected.userEmail,
      phone: user2Expected.mdn,
      photo: 'https://upload.wikimedia.org/wikipedia/en/d/df/Barbara_Gordon_Batgirl.jpg',
      city: 'Gotham',
      country: 'USA',
      languages: []
    }
    request(server).post('/api/users').send({userId: user2Expected.userAuthId, profileData: newUserData}).end((err, res) => {
      expect(res.body.exists).to.equal(true, 'should respond with false for a user that does not exist');
      expect(compareSomeKeys(user2Expected, res.body.user)).to.equal(true, 'should respond with the new user data');
      done();
    });
  });

  it('should be able to GET a user by name', (done) => {
    request(server).get('/api/users?userName=Bruce Wayne').end((err, res) => {
      expect(res.body.userName).to.equal(user1Expected.userName, 'should match the user searched by name');
      done();
    });
  });

  it('should be able to GET a user by email', (done) => {
    request(server).get('/api/users?userEmail=bwayne@wayneenterprises.com').end((err, res) => {
      expect(res.body.userEmail).to.equal(user1Expected.userEmail, 'should match the user searched by email');
      done();
    });
  });

  it('should be able to GET a user by MDN', (done) => {
    request(server).get('/api/users?mdn=202-555-0173').end((err, res) => {
      expect(res.body.mdn).to.equal(user1Expected.mdn, 'should match the user searched by MDN');
      done();
    });
  });

  it('should be able to GET multiple users by country', (done) => {
    request(server).get('/api/users?country=USA').end((err, res) => {
      expect(res.body.length>0).to.equal(true, 'should return multiple users');
      done();
    });
  });

  it('should be able to GET the exact number of users entered', (done) => {
    request(server).get('/api/users').end((err, res) => {
      expect(res.body.length).to.equal(2, 'should return 2 users');
      done();
    });
  });
});