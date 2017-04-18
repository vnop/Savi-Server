'use strict'
require('./env');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');

const db = require('./db/db');
const helpers = require('./helpers');
const config = require('./config/config');

const schema = new Sequelize(config.dbName, 'root', config.password);

db.syncTables(false, schema);
const app = express();

require('./routes.js')(app, express, db);

// var pKey = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/privkey.pem');
// var cert = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/fullchain.pem');
// var ca = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/chain.pem');

// let server = https.createServer({key: pKey, cert: cert, ca: ca}, app);

// server.listen(config.port, () => {console.log('listening on port', config.port)});

app.listen(config.port, () => {console.log('listening on port... ' + config.port)});


