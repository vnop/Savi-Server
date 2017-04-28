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

	//Individual Endpoints, see the "routes" folder to modify their behavior
	//require('./routes/activitiesRoutes.js')(app, db); //API endpoints available for friends to integrate our app with theirs
	require('./routes/adminRoutes.js')(app, db); //for handling logins on the control panel
	require('./routes/bookingRoutes.js')(app, db); //for handling the event of booking a tour
	require('./routes/cityRoutes.js')(app, db); //for handling GET and POST reqests to the Cities tables
	require('./routes/employeeRoutes.js')(app, db); //for handling GET, POST, PUT, and DELETE requests on the Employees table
	require('./routes/paymentsRoutes.js')(app, db); //for handling Stripe related payments
	require('./routes/imagesRoutes.js')(app, db); //for handling storing image files on the deployment server
	require('./routes/tourRoutes.js')(app, db); //for handling GET and POST requests on the Tours table
	require('./routes/userRoutes.js')(app, db); //for handling GET, POST, and PUT requests on the Users table

	//Redirect Panel for invalid extensions
	app.get('*', function (req, res) {
  	res.status(302).redirect('/')
	})

}