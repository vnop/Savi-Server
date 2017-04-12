'use strict'
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');

const db = require('./db');
const helpers = require('./helpers');
const config = require('./config/config');

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

app.get('/api/bookings', (req, res) => {
  let tourId = req.query.tourId;
  let date = req.query.date;
  if (!tourId || !date) {
    res.status(400).send('Invalid query string');
  } else {
    db.Tour.find({where: {id: tourId}}).then((tour) => ) {
      if (!tour) {
        res.status(404).send('Tour not found');
      } else {
        db.City.find({where: {id: tour.dataValues.cityId}}).then((city) => {
          if(!city) {
            res.status(404).send('City not found');
          } else {
            let booking = {tour: tour, city: city, date: date};
            let findDriver = db.User.find({where: {cityId: city.dataValues.id, type: 'Driver'}}).then((driver) => {
              if (driver) {
                booking.driver = driver;
              }
            });
            let findGuide = db.user.find({where: {cityId: city.dataValues.id, type: 'Tour Guide'}}).then((guide) => {
              if (guide) {
                booking.guide = guide;
              }
            });

            Promise.all([findDriver, findGuide]).then(() => {
              if (booking.guide && booking.driver) {
                res.json(booking).end();
              } else {
                res.send('We were unable to book you with the given parameters');
              }
            })
          }
        });
      }
    }
  }
});

app.get('/api/test', (req, res) => {
  res.status(404).send('error');
});

app.get('/api/images/:imageName', (req, res) => {
  let imageName = req.params.imageName;
  let exists = fs.existsSync(path.join(__dirname, '/img/' + imageName));
  if (imageName && exists) {
    res.sendFile(path.join(__dirname, '/img/' + imageName));
  } else if (!exists) {
    res.status(404).send('Image does not exist');
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

