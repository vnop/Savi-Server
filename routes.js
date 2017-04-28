const path = require('path');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(app, express, db, log) {
	if (log === undefined) {
		var log = true;
	}
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', require('./headers-list'));
		next();
	});
	app.use(express.static(path.join(__dirname, '/panel'))); //serves up access to panel
	if(log) {
		app.use(morgan('dev')); //set logger
	}
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	//Individual Endpoints
	require('./routes/activitiesRoutes.js')(app, db);
	require('./routes/adminRoutes.js')(app, db);
	require('./routes/bookingRoutes.js')(app, db);
	require('./routes/cityRoutes.js')(app, db);
	require('./routes/employeeRoutes.js')(app, db);
	require('./routes/paymentsRoutes.js')(app, db);
	require('./routes/imagesRoutes.js')(app, db);
	require('./routes/tourRoutes.js')(app, db);
	require('./routes/userRoutes.js')(app, db);

	//Redirect Panel for invalid extensions
	app.get('*', function (req, res) {
  	res.status(302).redirect('/')
	})

}