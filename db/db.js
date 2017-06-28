'use strict'
const Sequelize = require('sequelize');
// const config = require('../config/config');
// var schema = new Sequelize(config.dbName, 'root', config.password);


var syncTables = function(force, schema) {
  module.exports.schema = schema;

  module.exports.Administrator = schema.define('administrator', {
    userName: Sequelize.STRING,
    password: Sequelize.STRING
  });

  module.exports.UserData = schema.define('user_data', {
    userName: Sequelize.STRING,
    userEmail: Sequelize.STRING,
    mdn: Sequelize.STRING,
    country: Sequelize.STRING,
    photo: Sequelize.STRING,
    type: { type: Sequelize.STRING, defaultValue: 'Tourist'},
    userAuthId: Sequelize.STRING,
    city: Sequelize.STRING
  });

  // module.exports.DriverData = schema.define('driver_data', {
  //   rating: Sequelize.INTEGER,
  //   seats: Sequelize.INTEGER
  // });

  // module.exports.TourGuideData = schema.define('tour_guide_data', {
  //   rating: Sequelize.INTEGER,
  // });

  module.exports.EmployeeData = schema.define('employee_data', {
    type: Sequelize.STRING,
    rating: Sequelize.FLOAT,
    seats: Sequelize.INTEGER
  });

  module.exports.City = schema.define('city', {
    name: Sequelize.STRING,
    mainImage: Sequelize.TEXT
  }, {timestamps: false});

  module.exports.Languages = schema.define('languages', {
    title: Sequelize.STRING
  });

  module.exports.UserLanguages = schema.define('user_languages', {
  });

  module.exports.Offering = schema.define('offering', {
    date: Sequelize.STRING,
    userType: Sequelize.STRING,
    seats: Sequelize.INTEGER
  });

  module.exports.Booking = schema.define('booking', {
    passengers: Sequelize.INTEGER,
    date: Sequelize.STRING
  });

  module.exports.Tour = schema.define('tour', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    mainImage: Sequelize.TEXT,
    price: Sequelize.FLOAT
  });

  // module.exports.DriverData.belongsTo(module.exports.UserData, {as: 'user'});
  // module.exports.TourGuideData.belongsTo(module.exports.UserData, {as: 'user'});
  module.exports.EmployeeData.belongsTo(module.exports.UserData, {as: 'user'});
  module.exports.Tour.belongsTo(module.exports.City, {as: 'city'});
  module.exports.Offering.belongsTo(module.exports.City, {as: 'city'});
  // module.exports.Offering.belongsTo(module.exports.UserData, {as: 'driver'});
  // module.exports.Offering.belongsTo(module.exports.UserData, {as: 'tourGuide'});
  module.exports.Offering.belongsTo(module.exports.UserData, {as: 'user'});
  // module.exports.Offering.belongsTo(module.exports.EmployeeData, {as: 'employee'});
  // module.exports.Booking.belongsTo(module.exports.Offering, {as: 'offering'});
  module.exports.Booking.belongsTo(module.exports.UserData, {as: 'driver'});
  module.exports.Booking.belongsTo(module.exports.UserData, {as: 'tourGuide'});
  module.exports.Booking.belongsTo(module.exports.UserData, {as: 'tourist'});
  module.exports.Booking.belongsTo(module.exports.Tour, {as: 'tour'});
  module.exports.Booking.belongsTo(module.exports.City, {as: 'city'});
  module.exports.EmployeeData.belongsTo(module.exports.City, {as: 'city'});
  module.exports.UserData.belongsToMany(module.exports.Languages, {as: 'user', through: module.exports.UserLanguages, foreignKey: 'userId' });
  module.exports.Languages.belongsToMany(module.exports.UserData, {as: 'languages', through: module.exports.UserLanguages, foreignKey: 'languageId' });

  return schema.sync({force: force});
}

module.exports = {
 //  UserData: UserData,
 //  DriverData: DriverData,
	// City: City,
	// TourGuideData: TourGuideData,
	// Languages: Languages,
	// UserLanguages: UserLanguages,
	// Offering: Offering,
	// Booking: Booking,
	// Tour: Tour,
	// schema: schema,
  syncTables: syncTables
}
