// const Sequelize = require('sequelize')
// var schema = new Sequelize('savilocal', 'root', '');
var db = require('./db');
var sampleData = require('./sampleData');

db.syncTables(true).then(function() {
	sampleData.cities.forEach(function(city) {
		db.City.create(
	  	{name: city.name}  	
	  ).then(function(createdCity) {
			db.Tour.create({
				cityId: createdCity.dataValues.id,
				description: city.description
			});	
	  })
	});

	sampleData.languages.forEach(function(language) {
		db.Languages.create({
			title: language
		})
	})

	sampleData.users.forEach(function(user) {
		db.UserData.create({
			type: user.type,
			userName: user.userName,
			userEmail: user.userEmail,
			mdn: user.mdn,
			country: user.country,
			photo: user.photo,
		}).then(function(createdUser) {
			if(createdUser.dataValues.type == 'Tour Guide') {
				db.TourGuideData.create({
					userId: createdUser.dataValues.id,
					rating: 0
				})
			} else if(createdUser.dataValues.type == 'Driver') {
				db.DriverData.create({
					userId: createdUser.dataValues.id,
					rating: 0,
					seats: 8
				})
			}
		});
	})
});
