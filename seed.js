// const Sequelize = require('sequelize')
// var schema = new Sequelize('savilocal', 'root', '');

'use strict';

const db = require('./db');
const sampleData = require('./sampleData');
const Promise = require('bluebird');


const getCityId = (name) => {
	return db.City.find({where: {name: name}}).then((city) => {
		return city.dataValues.id;
	});
};


const seedDatabase = () => {
	let cityCreation = [];
	sampleData.cities.forEach((city, index) => {
		let createSingleCity = db.City.create({
			name: city.name,
			mainImage: city.mainImage
		});
		cityCreation.push(createSingleCity);
	});

	let languageCreation = [];
	sampleData.languages.forEach((language, index) => {
		let createSingleLanguage = db.Languages.create({
			title: language
		});
		languageCreation.push(createSingleLanguage);
	});

	Promise.all(cityCreation).then(() => {
		sampleData.tours.forEach((tour, index) => {
			getCityId(tour.city).then((cityId) => {
				db.Tour.create({
					cityId: cityId,
					title: tour.title,
					description: tour.description,
					mainImage: tour.mainImage
				})
			});
		});
	});

	Promise.all(languageCreation.concat(cityCreation)).then(() => {
		sampleData.users.forEach((user, index) => {
			getCityId(user.city).then((cityId) => {
				db.UserData.create({
					type: user.type,
					userName: user.userName,
					userEmail: user.userEmail,
					mdn: user.mdn,
					country: user.country,
					photo: user.photo,
					city: cityId
				}).then((createdUser) => {
					user.languages.forEach((language, index) => {
						db.Languages.find({where: {title: language}}).then((language) => {
							db.UserLanguages.create({
								userId: createdUser.dataValues.id,
								languageId: language.dataValues.id
							});
						});
					});
				});
			});
		});
	});
}

db.syncTables(true).then(seedDatabase);
/*
db.syncTables(true).then(function() {
	sampleData.cities.forEach(function(city, index) {
		db.City.create(
	  	{
	  		name: city.name,
	  		mainImage: city.mainImage
	  	}
	  ).then(function(createdCity) {
	  	city.tours.forEach((tour, index) => {
	  		db.Tour.create({
	  			cityId: createdCity.dataValues.id,
	  			title: tour.title,
	  			description: tour.description,
	  			mainImage: tour.mainImage
	  		});
	  	});
			// db.Tour.create({
			// 	cityId: createdCity.dataValues.id,
			// 	description: city.description,
			// 	mainImage: city.mainImage
			// });
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
					})
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
						}).catch((error) => {console.log('error on creating user_language', error, '\n*****************************************************************')});
					}
				})
			})
		})
	});

});
*/