'use strict'
const db = require('./db');
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const https = require('https');
const config = require('./config/config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helpers = require('./helpers');
const path = require('path');

db.syncTables(false);
const app = express();

app.use(morgan('dev')); //set logger
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/cities', (req, res) => {
  let cityId = req.query.cityId;
  if (!cityId) {
    db.City.findAll().then((citiesArr) => {
      helpers.respondDBQuery(citiesArr, req, res);
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    })
  } else {
    db.City.find({where: {id: cityId}}).then((citiesArr) => {
      helpers.respondDBQuery(citiesArr, req, res);
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    })
  }
});

// app.get('/api/bookings')

app.get('/api/test', (req, res) => {
  res.status(404).send('error');
});

app.get('/api/images/:imageName', (req, res) => {
  let imageName = req.params.imageName;
  if (imageName) {
    res.sendFile(path.join(__dirname, '/img/' + imageName), null, (err) => {
      if(err) {
        console.log('Error on image get\n', JSON.stringify({file: imageName, error: err}));
        res.status(404).json(err).end();
      } else {
        console.log('Sent file', imageName);
      }
    });
  } else {
    res.status(400).send('Invalid param string');
  }
});

app.get('/api/tours', (req, res) => {
  let cityId = req.query.cityId;
  let tourId = req.query.tourId;

  if (!cityId && !tourId) {
    db.Tour.findAll().then((toursArr) => {
      helpers.respondDBQuery(toursArr, req, res);
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    });
  } else if (!!tourId) {
    db.Tour.find({where: {id: tourId}}).then((tour) => {
      helpers.respondDBQuery(tour, req, res);
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    })
  } else if (!!cityId) {
    db.Tour.findAll({where: {cityId: cityId}}).then((toursArr) => {
      helpers.respondDBQuery(toursArr, req, res);
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    });
  } else {
    res.status(400).end('Invalid query string');
  }
});

var pKey = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/fullchain.pem');
var ca = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/chain.pem');

let server = https.createServer({key: pKey, cert: cert, ca: ca}, app);

server.listen(config.port, () => {console.log('listening on port', config.port)});

