const helpers = require('../helpers');

module.exports = function(app, db) {

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
}