//const fs = require('fs');
const path = require('path');
//const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
// const Promise = require('bluebird');
//const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
//const helpers = require('./helpers');
// const nodemailer = require('nodemailer');
// const mailer = require('./mailer/mailer');
//var stripe = require('stripe')('sk_test_t33bUz9G1cD2X6UexENeMvpd');

//Individual Endpoints
const activitiesRoutes = require('./routes/activitiesRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const cityRoutes = require('./routes/cityRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const imagesRoutes = require('./routes/imagesRoutes.js');
const tourRoutes = require('./routes/tourRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

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


	activitiesRoutes(app, db);
	adminRoutes(app, db);
	bookingRoutes(app, db);
	cityRoutes(app, db);
	employeeRoutes(app, db);
	imagesRoutes(app, db);
	paymentsRoutes(app, db);
	tourRoutes(app, db);
	userRoutes(app, db);

	//Redirect Panel for invalid extensions
	app.get('*', function (req, res) {
  	res.status(302).redirect('/')
	})

}