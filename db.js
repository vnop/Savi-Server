const Sequelize = require('sequelize')
var schema = new Sequelize('savilocal', 'root', 'savitravel');

var UserData = schema.define('user_data', {
  user_name: Sequelize.STRING,
  user_email: Sequelize.DATE,
  mdn: Sequelize.INTEGER,
  country: Sequelize.STRING,
  photo: Sequelize.STRING
});

var DriverData = schema.define('driver_data', {
  rating: Sequelize.INTEGER,
  seats: Sequelize.INTEGER
});

var TourGuideData = schema.define('tour_guide_data', {
  rating: Sequelize.INTEGER,
});

var City = schema.define('city', {
	name: Sequelize.STRING
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
	description: Sequelize.STRING
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
UserData.belongsToMany(Languages, {as: 'user', through: UserLanguages});
Languages.belongsToMany(UserData, {as: 'languages', through: UserLanguages});

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
