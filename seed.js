var db = require('./db');

var refreshTables = function()  {
	db.schema.sync({force: true});	
}

module.exports = {
	refreshTables: refreshTables
}












