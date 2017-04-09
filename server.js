'use strict'
var db = require('./db');
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const https = require('https');
const config = require('./config/config');
const bodyParser = require('body-parser');
const morgan = require('morgan');

db.syncTables(false);
const app = express();


app.use(morgan('dev')); //set logger
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/api/cities', (req, res) => {
  db.City.findAll().then((citiesArr) => {
    res.json(citiesArr);
    res.end()
  }).catch(() => {
    res.status(500).end();
  })
});

app.get('/api/tours', (req, res) => {
  let cityId = req.query.cityId;

  if (!cityId) {
    db.Tour.findAll().then((toursArr) => {
      res.json(toursArr);
      res.end();
    }).catch(() => {
      res.status(500).end();
    });
  }

  db.Tour.findAll({where: {cityId: cityId}}).then((toursArr) => {
    res.json(toursArr);
    res.end();
  }).catch(() => {
    res.status(500).end();
  });
});

var pKey = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/fullchain.pem');
var ca = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/chain.pem');

let server = https.createServer({key: pKey, cert: cert, ca: ca}, app);

server.listen(config.port, () => {console.log('listening on port', config.port)});

