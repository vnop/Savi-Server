const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const helpers = require('./helpers');
const mailer = require('./mailer/mailer')

module.exports = function(app, express, db) {
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

	app.post('/api/test', (req, res) => {
		let query = req.body.imageURL;
		console.log('query', query);
		let saveStatus = helpers.saveImage(query, 'testImg');
		if (!saveStatus) {
			res.status(500).send('something went wrong');
		} else {
			res.send('okay');
		}
	});

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
}