const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const nodemailer = require('nodemailer');
const mailer = require('./mailer/mailer');
var stripe = require('stripe')('sk_test_t33bUz9G1cD2X6UexENeMvpd');

//Individual Endpoints
const userRoutes = require('./routes/userRoutes.js');
const cityRoutes = require('./routes/cityRoutes.js');
const tourRoutes = require('./routes/tourRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const activitiesRoutes = require('./routes/activitiesRoutes.js');

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

	app.post('/api/admin', (req, res) => {
		if (!req.body || !req.body.userName || !req.body.password) {
			res.status(400).send(JSON.stringify('Bad request'));
		} else {
			db.Administrator.find({where: {userName: req.body.userName}}).then((user) => {
				if (!user) {
					res.status(400).send(JSON.stringify('User not found'));
				} else {
					let authorized = bcrypt.compareSync(req.body.password, user.password);
					if (authorized) {
						res.send(JSON.stringify('Logged In Successfully'));
					} else {
						res.status(401).send(JSON.stringify('Bad Credentials'));
					}
				}
			});
		}
	});
	app.post('/payments', function(req, res){
  	console.log('payment request..', req.body)
  	var token = req.body.stripeToken; // Using Express
  	var totalAmount = parseFloat(req.body.totalAmount) * 100

  	// Create a Customer:
		// stripe.customers.create({
		//   email: "paying.user@example.com",
		//   source: token,
		// }).then(function(customer) {
		  // // YOUR CODE: Save the customer ID and other info in a database for later.
		//   return stripe.charges.create({
		//     amount: 1000,
		//     currency: "usd",
		//     customer: customer.id,
		//   });
		// }).then(function(charge) {
		  // // Use and save the charge info.
		// });

		//Charge the user's card:
		var charge = stripe.charges.create({
		  amount: totalAmount,
		  currency: "usd",
		  description: "savi test realAmount charges",
		  source: token,
		}, function(err, charge) {
			if(err) {
				console.log(err);
				res.send('Failed')
			} else {
		  	console.log('success savi payment', charge);
		  		res.send(charge)
			}
		});
	});

	cityRoutes(app, db);
	activitiesRoutes(app, db);
	bookingRoutes(app, db);

	app.get('/api/images/:imageName', (req, res) => {
	  let imageName = req.params.imageName;
	  let exists = fs.existsSync(path.join(__dirname, '/img/' + imageName));
	  if (imageName && exists) {
	    res.sendFile(path.join(__dirname, '/img/' + imageName));
	  } else if (!exists) {
	    res.status(404).send(JSON.stringify('Image does not exist'));
	  } else {
	    res.status(400).send(JSON.stringify('Invalid param string'));
	  }
	});

	tourRoutes(app, db);
	userRoutes(app, db);
	employeeRoutes(app, db);

	//Redirect Panel for invalid extensions
	app.get('*', function (req, res) {
  	res.status(302).redirect('/')
	})

}