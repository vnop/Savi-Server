'use strict'

const db = require('../db/db');
const express = require('express');
const expect = require('expect.js');
const mailer = require('../mailer/mailer');

const port = 1337;

describe('Automatic mailer', () => {

  var server, app;

  beforeEach(() => {
    app = express();
    require('../routes')(app, express, db, false);
    server = app.listen(port, () => {
    });
  });

  afterEach((done) => {
    server.close(done);
  });

  var fakeUsers = [
    {
      userEmail: 'user@gmail.com',
      userName: 'John',
      type: 'Driver'
    },
    {
      userEmail: 'anotherUser@gmail.com',
      userName: 'Patrick',
      type: 'Driver'
    },
    {
      userEmail: 'aThirdUser@gmail.com',
      userName: 'Sean',
      type: 'Driver'
    }
  ]

  it('mailer.sendMailToAll should be a function', (done) => {
    expect(typeof(mailer.sendMailToAll)).to.be('function')
    done();
  });

  it('/api/bookings should send email successfully', function(done) {
    this.timeout(5000);

    mailer.sendMailToAll(fakeUsers, 'Test Tour', 'Test Date').then(function(emailResponse) {
      expect(emailResponse.emailResMessage).to.be('Email sent successfully!');
      done()
    });
  });

  it('/api/bookings should send email to all destinataries', function(done) {
    this.timeout(10000);
    var count = 0;
    mailer.sendMailToAll(fakeUsers, 'Test Tour', 'Test Date').then(function(emailResponse) {
      if(emailResponse.lastIndex === fakeUsers.length - 1) {
        done()
      }
    }, function(error) {
      console.log(error)
    });
  });
});