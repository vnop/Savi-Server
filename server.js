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
const Sequelize = require('sequelize');

const db = require('./db/db');
const helpers = require('./helpers');
const config = require('./config/config');

const schema = new Sequelize(config.dbName, config.uname, config.password);

db.syncTables(false, schema);
const app = express()



require('./routes.js')(app, express, db);

var pKey = fs.readFileSync(config.pKeyPath);
var cert = fs.readFileSync(config.certPath);

let server = https.createServer({key: pKey, cert: cert}, app);

server.listen(config.port, () => {console.log('listening on port', config.port)});