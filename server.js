'use strict'
require('./db.js')
const express = require('express')
const app = express()
const mysql = require('mysql');
const seed = require('./seed');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'savilocal'
});
 
connection.connect();

//seed.refreshTables();
 
app.get('*', (req, res) => {
  res.send('hullo werld')
})

let port = 5000

app.listen(port, () => {console.log('listening on port', port)})