const helpers = require('../helpers');
const mailer = require('../mailer/mailer.js');
const Promise = require('bluebird');

module.exports = function(app, db) {

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
}