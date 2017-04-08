const Sequelize = require('sequelize')
var schema = new Sequelize('savilocal', 'root', '');
var db = require('./db');

<<<<<<< HEAD
db.syncTables(true).then(function() {
  // Use this section to add data
});
