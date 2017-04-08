var db = require('./db');

db.syncTables(true);

db.City.create({
  name: 'new york'
});
