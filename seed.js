var db = require('./db');

db.syncTables(true).then(function() {
  db.City.create({
    name: 'new york'
  }).then(function() {
    db.City.create({
      name: 'santiago'
    })
  })
});

