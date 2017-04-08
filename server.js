'use strict'
require('./db.js');
const express = require('express');
const mysql = require('mysql');
const seed = require('./seed');
const fs = require('fs');
const https = requre('https');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'savilocal'
});

connection.connect();

//seed.refreshTables();

const app = express();
app.get('*', (req, res) => {
  res.send('hullo werld');
});


let port = 8080;


var pKey = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/fullchain.pem');
var ca = fs.readFileSync('/etc/letsencrypt/live/savi-travel.com/chain.pem');

let server = https.createServer({key: pKey, cert: cert, ca: ca}, app);

server.listen(port, () => {console.log('listening on port', port)});