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

	app.get('/api/activities', (req, res) => {
		let cityName = req.query.city;
		let price = req.query.price;
		db.City.find({where: {name: cityName}}).then((city) => {
			if (!city) {
				res.status(404).send(JSON.stringify('no tours available in this city'));
			} else {
				db.Tour.findAll({where: {cityId: city.id}}).then((tourList) => {
					if (tourList.length < 1) {
						res.status(404).send(JSON.stringify('no tours available in this city'));
					} else {
						let toursArray = [];

						for (var tour of tourList) {
							if (tour.price <= price) {
								var newTourInfo = {
									title: tour.title,
									description: tour.description,
									city: cityName,
									mainImage: tour.mainImage,
									price: tour.price
								}
								toursArray.push(newTourInfo);
							}
						}
						res.json(toursArray).end();
					}
				}).catch((error) => {res.status(500).send(JSON.stringify('error fetching tours'))});
			}
		}).catch((error) => {res.status(500).send(JSON.stringify('error fetching city information'))});
	});

	bookingRoutes(app, db);

	// app.get('/api/bookings', (req, res) => {
	// 	// console.log('bookings request...', req.query);
	//   let tourId = req.query.tourId;
	//   let date = req.query.date;
	//   let userId = req.query.userId;
	//   if (!tourId && !date && !!userId) {
	//   	db.UserData.find({where: {userAuthId: userId}}).then((user) => {
	//   		db.Booking.findAll({where: {touristId: user.id}}).then((bookingsList) => {
	//   			let retArr = [];
	//   			let asyncActions = [];

	//   			for (var booking of bookingsList) {
	//   				asyncActions.push(helpers.fillBookingData(booking, db).then((newBooking) => {
	//   					retArr.push(newBooking);
	//   				}));
	//   			}

	//   			Promise.all(asyncActions).then(() => {
	//   				res.json(retArr).end();
	//   			});
	//   		})
	//   	});
	//   } else if (!tourId || !date || !userId) {
	//     res.status(400).send(JSON.stringify('Invalid query string'));
	//   } else {
	//   	// console.log('getting tour..');
	//     db.Tour.find({where: {id: tourId}}).then((tour) =>  {
	//       if (!tour) {
	//         res.status(404).send(JSON.stringify('Tour not found'));
	//       } else {
	//         db.City.find({where: {id: tour.dataValues.cityId}}).then((city) => {
	//           if(!city) {
	//             res.status(404).send(JSON.stringify('City not found'));
	//           } else {
	//             let booking = {tour: tour, city: city, date: date};
	//             var driverOffering, guideOffering;
	//             let findDriver = db.Offering.find({where: {cityId: city.dataValues.id, userType: 'Driver', date: date}}).then((driver) => {
	//               if (driver) {
	//                 driverOffering = driver;
	//               }
	//             });
	//             let findGuide = db.Offering.find({where: {cityId: city.dataValues.id, userType: 'Tour Guide', date: date}}).then((guide) => {
	//               if (guide) {
	//                 guideOffering = guide;
	//               }
	//             });

	//             Promise.all([findDriver, findGuide]).then(() => {
	//               if (!!guideOffering && !!driverOffering) {

	//               	let asyncActions = [];
	//               	asyncActions.push(db.UserData.find({where: {id: driverOffering.userId}}).then((user) => {
	//               		booking.driver = user;
	//               	}));
	//               	asyncActions.push(db.UserData.find({where: {id: guideOffering.userId}}).then((user) => {
	//               		booking.guide = user;
	//               	}));
	//               	asyncActions.push(db.EmployeeData.find({where: {id: driverOffering.userId}}).then((user) => {
	//               		booking.driverEmployeeData = user;
	//               	}));
	//               	asyncActions.push(db.EmployeeData.find({where: {id: guideOffering.userId}}).then((user) => {
	//               		booking.guideEmployeeData = user;
	//               	}));
	//               	asyncActions.push(db.Offering.destroy({where: {id: driverOffering.id}}));
	//               	asyncActions.push(db.Offering.destroy({where: {id: guideOffering.id}}));
	//               	Promise.all(asyncActions).then(() => {
	//                		db.UserData.find({where: {userAuthId: userId}}).then((user) => {
	//                			if (!user) {
	//                				res.status(400).send(JSON.stringify('user does not exist'));
	//                			} else {
	// 			              	let tourName = booking.tour.dataValues.title;
	// 			              	let destinataries = [
	// 												booking.driver.dataValues,
	// 												booking.guide.dataValues,
	// 												user.dataValues
	// 			              	];
	// 			              	mailer.sendMailToAll(destinataries, tourName, booking.date).then(function(response){
	// 			              		// console.log('mail response', response);
	// 			              	}, function(error) {
	// 			              		// console.log(error)
	// 			              	});
	// 	               			db.Booking.create({
	// 	               				driverId: booking.driver.id,
	// 	               				touristId: user.id,
	// 	               				tourGuideId: booking.guide.id,
	// 	               				tourId: tourId,
	// 	               				passengers: req.query.seats || null,
	// 	               				date: date,
	// 	               				cityId: booking.city.id
	// 	               			});
	// 	               			res.json(booking).end();
	//                			}
	//                		})
	//               	});

	//               } else {
	//                 res.status(400).send(JSON.stringify('We were unable to book you with the given parameters'));
	//               }
	//             })
	//           }
	//         });
	//       }
	//     });
	//   }
	// });

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