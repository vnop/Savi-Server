'use strict'
const Sequelize = require('sequelize')
const config = require('./config/config');
var schema = new Sequelize(config.dbName, 'root', config.password);

var UserData = schema.define('user_data', {
  userName: Sequelize.STRING,
  userEmail: Sequelize.STRING,
  mdn: Sequelize.STRING,
  country: Sequelize.STRING,
  photo: Sequelize.STRING,
  type: { type: Sequelize.STRING, defaultValue: 'Turist'}
});

var DriverData = schema.define('driver_data', {
  rating: Sequelize.INTEGER,
  seats: Sequelize.INTEGER
});

var TourGuideData = schema.define('tour_guide_data', {
  rating: Sequelize.INTEGER,
});

var City = schema.define('city', {
	name: Sequelize.STRING,
  mainImage: Sequelize.TEXT
}, {timestamps: false});

var Languages = schema.define('languages', {
  title: Sequelize.STRING
});

var UserLanguages = schema.define('user_languages', {

});

var Offering = schema.define('offering', {
  start: Sequelize.DATE,
  end: Sequelize.DATE
});

var Booking = schema.define('booking', {
	passengers: Sequelize.INTEGER
});

var Tour = schema.define('tour', {
  title: Sequelize.STRING,
	description: Sequelize.STRING,
  mainImage: Sequelize.TEXT
});

DriverData.belongsTo(UserData, {as: 'user'});
TourGuideData.belongsTo(UserData, {as: 'user'});
Tour.belongsTo(City, {as: 'city'});
Offering.belongsTo(Tour, {as: 'tour'});
Offering.belongsTo(UserData, {as: 'driver'});
Offering.belongsTo(UserData, {as: 'tourGuide'});
Booking.belongsTo(Offering, {as: 'offering'});
Booking.belongsTo(UserData, {as: 'driver'});
Booking.belongsTo(UserData, {as: 'tourGuide'});
Booking.belongsTo(UserData, {as: 'tourist'});
UserData.belongsTo(City, {as: 'city'});
UserData.belongsToMany(Languages, {as: 'user', through: UserLanguages, foreignKey: 'userId' });
Languages.belongsToMany(UserData, {as: 'languages', through: UserLanguages, foreignKey: 'languageId' });

var syncTables = function(force) {
  return schema.sync({force: force});
}

module.exports = {
	UserData: UserData,
	DriverData: DriverData,
	City: City,
	TourGuideData: TourGuideData,
	Languages: Languages,
	UserLanguages: UserLanguages,
	Offering: Offering,
	Booking: Booking,
	Tour: Tour,
	schema: schema,
  syncTables: syncTables
}
