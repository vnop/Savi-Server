const db = require('./db');
const Sequelize = require('sequelize');
const config = require('../config/config');
const seeder = require('./seeder.js');
const schema = new Sequelize(config.dbName, 'root', config.password);

schema.drop().then(() => {
  db.syncTables(true, schema).then(() => {seeder.seedDatabase(db)});
});
