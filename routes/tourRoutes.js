const helpers = require('../helpers');

module.exports = function(app, db) {

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
}