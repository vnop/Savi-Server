const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const helpers = require('./helpers');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mailer = require('./mailer/mailer');

module.exports = function(app, express, db) {

	app.use(morgan('dev')); //set logger
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));


	app.get('/email', function(req, res) {
		// This function takes 4 arguments (targetEmail, userName, tourName, date)
	  mailer.transporter.sendMail(mailer.mailOptions(/*........*/), (error, info) => {
       if (error) {
           return console.log(error);
       }
       console.log('Message %s sent: %s', info.messageId, info.response);
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
					res.status(500).send('error creating new tour ' + JSON.stringify(error));
				});
			}, (error) => {
				res.status(500).send('error saving image ' + JSON.stringify(error))
			}).catch((error) => {
				res.status(500).send('unknown error ' + JSON.stringify(error));
			});
		}
	});

	app.get('/api/bookings', (req, res) => {
	  let tourId = req.query.tourId;
	  let date = req.query.date;
	  if (!tourId || !date) {
	    res.status(400).send('Invalid query string');
	  } else {
	    db.Tour.find({where: {id: tourId}}).then((tour) =>  {
	      if (!tour) {
	        res.status(404).send('Tour not found');
	      } else {
	        db.City.find({where: {id: tour.dataValues.cityId}}).then((city) => {
	          if(!city) {
	            res.status(404).send('City not found');
	          } else {
	            let booking = {tour: tour, city: city, date: date};
	            let findDriver = db.UserData.find({where: {cityId: city.dataValues.id, type: 'Driver'}}).then((driver) => {
	              if (driver) {
	                booking.driver = driver;
	              }
	            });
	            let findGuide = db.UserData.find({where: {cityId: city.dataValues.id, type: 'Tour Guide'}}).then((guide) => {
	              if (guide) {
	                booking.guide = guide;
	              }
	            });

	            Promise.all([findDriver, findGuide]).then(() => {
	              if (booking.guide && booking.driver) {
	                res.json(booking).end();
	              } else {
	                res.send('We were unable to book you with the given parameters');
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
	    res.status(404).send('Image does not exist');
	  } else {
	    res.status(400).send('Invalid param string');
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
	    res.status(400).end('Invalid query string');
	  }
	});

	app.post('/api/tours', (req, res) => {
		if (!req.body || !req.body.title || !req.body.description || !req.body.cityId || !req.body.mainImage) {
			console.log(req.body);
			res.status(400).send('invalid request');
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
					res.status(500).send('error creating new tour ' + JSON.stringify(error));
				});
			}, (error) => {
				res.status(500).send('error saving image ' + JSON.stringify(error))
			}).catch((error) => {
				res.status(500).send('unknown error ' + JSON.stringify(error));
			});
		}
	});
}