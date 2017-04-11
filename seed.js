// const Sequelize = require('sequelize')
// var schema = new Sequelize('savilocal', 'root', '');
var db = require('./db');
var sampleData = require('./sampleData');

db.syncTables(true).then(function() {
	sampleData.cities.forEach(function(city, index) {		
		db.City.create(
	  	{name: city.name}  	
	  ).then(function(createdCity) {	  	
			db.Tour.create({
				cityId: createdCity.dataValues.id,
				description: city.description,
				mainImage: city.mainImage
			});

			sampleData.users.forEach(function(user) {								
				if( user.city === createdCity.dataValues.name	) {
					db.UserData.create({
						type: user.type,
						userName: user.userName,
						userEmail: user.userEmail,
						mdn: user.mdn,
						country: user.country,
						photo: user.photo,
						cityId: createdCity.dataValues.id			
					})
					.then(function(createdUser) {						
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
				}				
			})
	  })
	});

	sampleData.languages.forEach(function(language) {
		db.Languages.create({
			title: language
		}).then(function(createdLanguage) {
			sampleData.users.forEach(function(user, index) {				
				user.languages.forEach(function(language) {
					if( language === createdLanguage.dataValues.title ) {
						db.UserLanguages.create({
							userId: index + 1,
							languageId: createdLanguage.id
						})
					}
				})		
			})
		})
	});
});
