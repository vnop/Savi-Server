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

	app.get('/api/cities', (req, res) => {
	  let cityId = req.query.cityId;
	  if (!cityId) {
	    db.City.findAll().then((citiesArr) => {
	      helpers.respondDBQuery(citiesArr, req, res);
	    }).catch((err) => {
	      helpers.respondDBError(err, req, res);
	    })
	  } else {
	    db.City.find({where: {id: cityId}}).then((citiesArr) => {
	      helpers.respondDBQuery(citiesArr, req, res);
	    }).catch((err) => {
	      helpers.respondDBError(err, req, res);
	    })
	  }
	});

	app.post('/api/cities', (req, res) => {
		if (!req.body || !req.body.name || !req.body.mainImage) {
			res.status(400).send('invalid request');
		} else {
			let name = req.body.name;
			let imageUrl = req.body.mainImage;
			let mainImage = name.split(' ').join('-').toLowerCase() + '_city';
			helpers.saveImage(imageUrl, mainImage).then((imageName) => {
				db.City.create({name: name, mainImage: imageName}).then((newCity) => {
					res.send('created ' + newCity.dataValues.name);
				}).catch((error) => {
					res.status(500).send(JSON.stringify('error creating new tour ' + JSON.stringify(error)));
				});
			}, (error) => {
				res.status(500).send(JSON.stringify('error saving image ' + JSON.stringify(error)));
			}).catch((error) => {
				res.status(500).send(JSON.stringify('unknown error ' + JSON.stringify(error)));
			});
		}
	});

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

	app.get('/api/bookings', (req, res) => {
		// console.log('bookings request...', req.query);
	  let tourId = req.query.tourId;
	  let date = req.query.date;
	  let userId = req.query.userId;
	  if (!tourId && !date && !!userId) {
	  	db.UserData.find({where: {userAuthId: userId}}).then((user) => {
	  		db.Booking.findAll({where: {touristId: user.id}}).then((bookingsList) => {
	  			let retArr = [];
	  			let asyncActions = [];

	  			for (var booking of bookingsList) {
	  				asyncActions.push(helpers.fillBookingData(booking, db).then((newBooking) => {
	  					retArr.push(newBooking);
	  				}));
	  			}

	  			Promise.all(asyncActions).then(() => {
	  				res.json(retArr).end();
	  			});
	  		})
	  	});
	  } else if (!tourId || !date || !userId) {
	    res.status(400).send(JSON.stringify('Invalid query string'));
	  } else {
	  	// console.log('getting tour..');
	    db.Tour.find({where: {id: tourId}}).then((tour) =>  {
	      if (!tour) {
	        res.status(404).send(JSON.stringify('Tour not found'));
	      } else {
	        db.City.find({where: {id: tour.dataValues.cityId}}).then((city) => {
	          if(!city) {
	            res.status(404).send(JSON.stringify('City not found'));
	          } else {
	            let booking = {tour: tour, city: city, date: date};
	            var driverOffering, guideOffering;
	            let findDriver = db.Offering.find({where: {cityId: city.dataValues.id, userType: 'Driver', date: date}}).then((driver) => {
	              if (driver) {
	                driverOffering = driver;
	              }
	            });
	            let findGuide = db.Offering.find({where: {cityId: city.dataValues.id, userType: 'Tour Guide', date: date}}).then((guide) => {
	              if (guide) {
	                guideOffering = guide;
	              }
	            });

	            Promise.all([findDriver, findGuide]).then(() => {
	              if (!!guideOffering && !!driverOffering) {

	              	let asyncActions = [];
	              	asyncActions.push(db.UserData.find({where: {id: driverOffering.userId}}).then((user) => {
	              		booking.driver = user;
	              	}));
	              	asyncActions.push(db.UserData.find({where: {id: guideOffering.userId}}).then((user) => {
	              		booking.guide = user;
	              	}));
	              	asyncActions.push(db.EmployeeData.find({where: {id: driverOffering.userId}}).then((user) => {
	              		booking.driverEmployeeData = user;
	              	}));
	              	asyncActions.push(db.EmployeeData.find({where: {id: guideOffering.userId}}).then((user) => {
	              		booking.guideEmployeeData = user;
	              	}));
	              	asyncActions.push(db.Offering.destroy({where: {id: driverOffering.id}}));
	              	asyncActions.push(db.Offering.destroy({where: {id: guideOffering.id}}));
	              	Promise.all(asyncActions).then(() => {
	               		db.UserData.find({where: {userAuthId: userId}}).then((user) => {
	               			if (!user) {
	               				res.status(400).send(JSON.stringify('user does not exist'));
	               			} else {
				              	let tourName = booking.tour.dataValues.title;
				              	let destinataries = [
													booking.driver.dataValues,
													booking.guide.dataValues,
													user.dataValues
				              	];
				              	mailer.sendMailToAll(destinataries, tourName, booking.date).then(function(response){
				              		// console.log('mail response', response);
				              	}, function(error) {
				              		// console.log(error)
				              	});
		               			db.Booking.create({
		               				driverId: booking.driver.id,
		               				touristId: user.id,
		               				tourGuideId: booking.guide.id,
		               				tourId: tourId,
		               				passengers: req.query.seats || null,
		               				date: date,
		               				cityId: booking.city.id
		               			});
		               			res.json(booking).end();
	               			}
	               		})
	              	});

	              } else {
	                res.status(400).send(JSON.stringify('We were unable to book you with the given parameters'));
	              }
	            })
	          }
	        });
	      }
	    });
	  }
	});

	// app.get('/api/test', (req, res) => {
	// 	let saveImage = helpers.saveImage('http://1.bp.blogspot.com/-4x8LvBUopUg/UP_3v-hRgcI/AAAAAAAAC90/rerm6FhEJ4I/s1600/Anthony+Lamb+-+Nick+Cage+as+Salvador+Dali.jpg', 'test-img');
	// 	saveImage.then((imageName) => {
	// 		res.send('saved image as ' + imageName)
	// 	}, (err) => {
	// 		res.status(500).send(err);
	// 	}).catch((err) => {
	// 		res.status(500).send(err);
	// 	});
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

	app.get('/api/tours', (req, res) => {
	  let cityId = req.query.cityId;
	  let tourId = req.query.tourId;

	  if (!cityId && !tourId) {
	    db.Tour.findAll().then((toursArr) => {
	      helpers.respondDBQuery(toursArr, req, res);
	    }).catch((err) => {
	      helpers.respondDBError(err, req, res);
	    });
	  } else if (!!tourId) {
	    db.Tour.find({where: {id: tourId}}).then((tour) => {
	      helpers.respondDBQuery(tour, req, res);
	    }).catch((err) => {
	      helpers.respondDBError(err, req, res);
	    })
	  } else if (!!cityId) {
	    db.Tour.findAll({where: {cityId: cityId}}).then((toursArr) => {
	      helpers.respondDBQuery(toursArr, req, res);
	    }).catch((err) => {
	      helpers.respondDBError(err, req, res);
	    });
	  } else {
	    res.status(400).send(JSON.stringify('Invalid query string'));
	  }
	});

	app.post('/api/tours', (req, res) => {
		if (!req.body || !req.body.title || !req.body.description || !req.body.cityId || !req.body.mainImage) {
			res.status(400).send(JSON.stringify('invalid request'));
		} else {
			let mainImage = req.body.title.split(' ').join('-').toLowerCase() + '_tour';
			helpers.saveImage(req.body.mainImage, mainImage).then((imageName) => {
				let newTour = {
					title: req.body.title,
					description: req.body.description,
					mainImage: imageName,
					cityId: req.body.cityId
				}

				db.Tour.create(newTour).then((newTour) => {
					res.send('created ' + newTour.dataValues.title);
				}).catch((error) => {
					res.status(500).send(JSON.stringify('error creating new tour ' + JSON.stringify(error)));
				});
			}, (error) => {
				res.status(500).send(JSON.stringify('error saving image ' + JSON.stringify(error)));
			}).catch((error) => {
				res.status(500).send(JSON.stringify('unknown error ' + JSON.stringify(error)));
			});
		}
	});

	app.get('/api/users', (req, res) => {
		let user = {
			name: req.query.userName,
			email: req.query.userEmail,
			mdn: req.query.mdn, //mobile device number
			country: req.query.country,
			city: req.query.city
		};

		if (!user.name && !user.email && !user.mdn && !user.country && !user.city) { //if no user data came from the req.body...
			db.UserData.findAll().then((users) => { //grab all data from the table instead
				helpers.respondDBQuery(users, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!user.name) { //else, if a user name exists...
			db.UserData.find({where: {userName: user.name}}).then((user) => {
				helpers.respondDBQuery(user, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!user.email) { //else, if a user email exists...
			db.UserData.find({where: {userEmail: user.email}}).then((user) => {
				helpers.respondDBQuery(user, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!user.mdn) { //else, if a user mobile device number exists...
			db.UserData.find({where: {mdn: user.mdn}}).then((user) => {
				helpers.respondDBQuery(user, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!user.country) { //else, if a user country exists...
			db.UserData.findAll({where: {country: user.country}}).then((users) => { //grab all that match
				helpers.respondDBQuery(users, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!user.city) { //else, if a user city exists...
			db.UserData.findAll({where: {city: user.city}}).then((users) => { //grab all that match
				helpers.respondDBQuery(users, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		}
	});

	app.post('/api/users', (req, res) => {
		let userId = req.body.userId;
		db.UserData.find({where: {userAuthId: userId}}).then((user) => {
			if(!user) {
				if (!req.body.profileData) {
					res.json({exists: false, user: null}).end();
				} else {
					let newUser = {
						userName: req.body.profileData.name,
						userEmail: req.body.profileData.email,
						mdn: req.body.profileData.phone,
						country: req.body.profileData.country,
						city: req.body.profileData.city,
						userAuthId: req.body.userId
					};
					helpers.saveImage(req.body.profileData.photo, newUser.userName.split(' ').join('-').toLowerCase()).then((imageName) => {
						newUser.photo = imageName;
						// if (!city) {
						// 	res.status(404).send('City not found');
						// } else {
						db.UserData.create(newUser).then((user) => {
							for (var language of req.body.profileData.languages) {
								db.Languages.find({where: {title: language}}).then((lang) => {
									if (lang) {
										db.UserLanguages.create({
											userId: user.dataValues.id,
											languageId: lang.dataValues.id
										});
									}
								});
							}
							res.json({exists: true, user: user}).end();
						}).catch((error) => {
							res.status(500).send(JSON.stringify('error creating new user ' + JSON.stringify(error)));
						});

					}, (error) => {
						res.status(500).send(JSON.stringify('error saving image ' + JSON.stringify(error)));
					});
				}
			} else {
				res.json({exists: true, user: user}).end();
			}
		})
	});

	app.put('/api/users/:userAuthId', (req, res, next) => {
		let userAID = req.params.userAuthId;

		db.UserData.find({where: {userAuthId: userAID}}).then((user) => {
			if (user) { //if a user is found...
				//Update the data in the database for the user that matches the userAuthId
				db.UserData.update({
					userName: req.body.userName,
					userEmail: req.body.userEmail,
					mdn: req.body.mdn,
					country: req.body.country,
					photo: req.body.photo,
					type: req.body.type,
					city: req.body.city
				}, {where: {userAuthId: userAID}});
				helpers.respondDBQuery(user, req, res);
			} else { //otherwise... no user exists to be updated. Send 500
				res.status(500).send(JSON.stringify('No Such User Exists'));
			}
		}).catch((err) => {
			helpers.respondDBError(err, req, res);
		})
	});

	//returns a list of employee data
	app.get('/api/employees', (req, res) => {
		let employ = { //object to hold inbound employee data
	    type: req.query.type,
	    rating: req.query.rating,
	    seats: req.query.seats,
	    userId: req.query.userId,
	    cityId: req.query.cityId
		};
		//Depending on the query data, do one of the following searches...
		if (!employ.type && !employ.rating && !employ.seats && !employ.userId && !employ.cityId) {//if no employee query was submitted...
			db.EmployeeData.findAll().then((employees)=>{//get all the employee data
				helpers.respondDBQuery(employees, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!employ.type) { //else, if an employee type exists...
			db.EmployeeData.findAll({where: {type: employ.type}}).then((employees) => { //grab all that match
				helpers.respondDBQuery(employees, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!employ.rating) { //else, if an employee rating exists...
			db.EmployeeData.findAll({where: {rating: employ.rating}}).then((employees) => { //grab all that match
				helpers.respondDBQuery(employees, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!employ.seats) { //else, if employee seats exists...
			db.EmployeeData.findAll({where: {seats: employ.seats}}).then((employees) => { //grab all that match
				helpers.respondDBQuery(employees, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!employ.userId) { //else, if an employee id exists...
			db.EmployeeData.find({where: {userId: employ.userId}}).then((employee) => { //grab all that match
				helpers.respondDBQuery(employee, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		} else if (!!employ.cityId) { //else, if am employee cityId exists...
			db.EmployeeData.findAll({where: {cityId: employ.cityId}}).then((employees) => { //grab all that match
				helpers.respondDBQuery(employees, req, res);
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		}
	});

	app.post('/api/employees', (req, res) => {
		if (!req.body) { //if no body exists, send 400
			res.status(400).send(JSON.stringify('invalid request'));
		} else { //otherwise...
		  //get the cityId from the City table
			db.City.find({where: {name: req.body.city}}).then((city) => {
				if (!!city) {//if the city is found...
					let employ = {//store inbound employee data in employ object
				    type: req.body.type,
				    rating: req.body.rating,
				    seats: req.body.seats,
				    userId: req.body.userId,
				    cityId: city.dataValues.id
				  };
				  //first, check to see if an employee entry exists already
				  db.EmployeeData.find({where: {userId: employ.userId}}).then((employee) => {
				  	if (!employee) {//if such an employee already exists...
				  		db.EmployeeData.create(employ).then((employee) => {//create a new entry in the employee database
				  			res.json({exists: true, employee: employee}).end();
				  		}).catch((err) => {//error handling
				  			res.status(500).send('error creating new employee ' + JSON.stringify(err));
				  		});
				  	} else {//otherwise...
				  		res.json({exists: true, employee: employee}).end();//do nothing important
				  	}
				  });
				} else {//otherwise...
					res.status(500).send('No Such City Exists').end();
				}
			}).catch((err) => {
				helpers.respondDBError(err, req, res);
			});
		}
	});

	app.put('/api/employees/:userId', (req, res, next) => {

	  //get the cityId from the City table
		db.City.find({where: {name: req.body.city}}).then((city) => {
			if (!!city) {//if city was found...
				let userId = req.params.userId;//store the userId for lookup
				let employ = {
			    type: req.body.type,
			    rating: req.body.rating,
			    seats: req.body.seats,
			    cityId: city.dataValues.id
			   };

				db.EmployeeData.find({where: {userId: userId}}).then((employee) => {
					if (employee) { //if a emplpoyee is found...
						//Update the data in the database for the employee that matches the userId
						db.EmployeeData.update(employ, {where: {userId: userId}});
						helpers.respondDBQuery(employee, req, res);
					} else { //otherwise... no user exists to be updated. Send 500
						res.status(500).send('No Such Employee Exists').end();
					}
				})
			} else {//otherwise...
				res.status(500).send('No Such City Exists').end();
			}
		}).catch((err) => {
			helpers.respondDBError(err, req, res);
		})
	});

	app.delete('/api/employees/', (req, res, next) => {
		let userId = req.body.userId;

		db.EmployeeData.find({where: {userId: userId}}).then((employee) => {
			if (employee) { //if a emplpoyee is found...
				//Update the data in the database for the employee that matches the userId
				db.EmployeeData.destroy({where: {userId: userId}});
				helpers.respondDBQuery(employee, req, res);
			} else { //otherwise... no user exists to be updated. Send 500
				res.status(500).send(JSON.stringify('No Such Employee Exists'));
			}
		}).catch((err) => {
			helpers.respondDBError(err, req, res);
		})
	});

	//Redirect Panel for invalid extensions
	app.get('*', function (req, res) {
  	res.status(302).redirect('/')
	})

}


// //REFRACTORED ROUTES TO USE AFTER
// const path = require('path');
// const https = require('https');
// const morgan = require('morgan');
// const express = require('express');
// const bodyParser = require('body-parser');

// module.exports = function(app, express, db, log) {
// 	if (log === undefined) {
// 		var log = true;
// 	}
// 	app.use((req, res, next) => {
// 		res.header('Access-Control-Allow-Origin', '*');
// 		res.header('Access-Control-Allow-Headers', require('./headers-list'));
// 		next();
// 	});
// 	app.use(express.static(path.join(__dirname, '/panel'))); //serves up access to panel
// 	if(log) {
// 		app.use(morgan('dev')); //set logger
// 	}
// 	app.use(bodyParser.json());
// 	app.use(bodyParser.urlencoded({ extended: true }));

// 	//Individual Endpoints, see the "routes" folder to modify their behavior
// 	//require('./routes/activitiesRoutes.js')(app, db); //API endpoints available for friends to integrate our app with theirs
// 	require('./routes/adminRoutes.js')(app, db); //for handling logins on the control panel
// 	require('./routes/bookingRoutes.js')(app, db); //for handling the event of booking a tour
// 	require('./routes/cityRoutes.js')(app, db); //for handling GET and POST reqests to the Cities tables
// 	require('./routes/employeeRoutes.js')(app, db); //for handling GET, POST, PUT, and DELETE requests on the Employees table
// 	require('./routes/paymentsRoutes.js')(app, db); //for handling Stripe related payments
// 	require('./routes/imagesRoutes.js')(app, db); //for handling storing image files on the deployment server
// 	require('./routes/tourRoutes.js')(app, db); //for handling GET and POST requests on the Tours table
// 	require('./routes/userRoutes.js')(app, db); //for handling GET, POST, and PUT requests on the Users table

// 	//Redirect Panel for invalid extensions
// 	app.get('*', function (req, res) {
//   	res.status(302).redirect('/')
// 	})

// }