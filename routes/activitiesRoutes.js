const helpers = require('../helpers');

module.exports = function(app, db) {
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
}