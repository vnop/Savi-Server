'use strict'
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const db = require('./db');
const helpers = require('./helpers');
const config = require('./config/config');

db.syncTables(false);
const app = express();

app.use(morgan('dev')); //set logger
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes.js')(app, express);

// THIS IS A CHANGE

var pKey = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/fullchain.pem');
var ca = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/chain.pem');

let server = https.createServer({key: pKey, cert: cert, ca: ca}, app);

server.listen(config.port, () => {console.log('listening on port', config.port)});
//app.listen(config.port, () => {console.log('listening on port... ' + config.port)});


