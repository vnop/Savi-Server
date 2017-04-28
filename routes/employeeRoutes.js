const helpers = require('../helpers');

module.exports = function(app, db) {

  app.get('/api/employees', (req, res) => {
    let employ = { //object to hold inbound employee data
      type: req.query.type,
      rating: req.query.rating,
      seats: req.query.seats,
      userId: req.query.userId,
      cityId: req.query.cityId
    };
    //Depending on the query data, do one of the following searches...
    if (!employ.type && !employ.rating && !employ.seats && !employ.userId && !employ.cityId) {//if no employee query was submitted...
      db.EmployeeData.findAll().then((employees)=>{//get all the employee data
        helpers.respondDBQuery(employees, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!employ.type) { //else, if an employee type exists...
      db.EmployeeData.findAll({where: {type: employ.type}}).then((employees) => { //grab all that match
        helpers.respondDBQuery(employees, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!employ.rating) { //else, if an employee rating exists...
      db.EmployeeData.findAll({where: {rating: employ.rating}}).then((employees) => { //grab all that match
        helpers.respondDBQuery(employees, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!employ.seats) { //else, if employee seats exists...
      db.EmployeeData.findAll({where: {seats: employ.seats}}).then((employees) => { //grab all that match
        helpers.respondDBQuery(employees, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!employ.userId) { //else, if an employee id exists...
      db.EmployeeData.find({where: {userId: employ.userId}}).then((employee) => { //grab all that match
        helpers.respondDBQuery(employee, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!employ.cityId) { //else, if am employee cityId exists...
      db.EmployeeData.findAll({where: {cityId: employ.cityId}}).then((employees) => { //grab all that match
        helpers.respondDBQuery(employees, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    }
  });

  app.post('/api/employees', (req, res) => {
    if (!req.body) { //if no body exists, send 400
      res.status(400).send(JSON.stringify('invalid request'));
    } else { //otherwise...
      //get the cityId from the City table
      db.City.find({where: {name: req.body.city}}).then((city) => {
        if (!!city) {//if the city is found...
          let employ = {//store inbound employee data in employ object
            type: req.body.type,
            rating: req.body.rating,
            seats: req.body.seats,
            userId: req.body.userId,
            cityId: city.dataValues.id
          };
          //first, check to see if an employee entry exists already
          db.EmployeeData.find({where: {userId: employ.userId}}).then((employee) => {
            if (!employee) {//if such an employee already exists...
              db.EmployeeData.create(employ).then((employee) => {//create a new entry in the employee database
                res.json({exists: true, employee: employee}).end();
              }).catch((err) => {//error handling
                res.status(500).send('error creating new employee ' + JSON.stringify(err));
              });
            } else {//otherwise...
              res.json({exists: true, employee: employee}).end();//do nothing important
            }
          });
        } else {//otherwise...
          res.status(500).send('No Such City Exists').end();
        }
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    }
  });

  app.put('/api/employees/:userId', (req, res, next) => {

    //get the cityId from the City table
    db.City.find({where: {name: req.body.city}}).then((city) => {
      if (!!city) {//if city was found...
        let userId = req.params.userId;//store the userId for lookup
        let employ = {
          type: req.body.type,
          rating: req.body.rating,
          seats: req.body.seats,
          cityId: city.dataValues.id
         };

        db.EmployeeData.find({where: {userId: userId}}).then((employee) => {
          if (employee) { //if a emplpoyee is found...
            //Update the data in the database for the employee that matches the userId
            db.EmployeeData.update(employ, {where: {userId: userId}});
            helpers.respondDBQuery(employee, req, res);
          } else { //otherwise... no user exists to be updated. Send 500
            res.status(500).send('No Such Employee Exists').end();
          }
        })
      } else {//otherwise...
        res.status(500).send('No Such City Exists').end();
      }
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    })
  });

  app.delete('/api/employees/', (req, res, next) => {
    let userId = req.body.userId;

    db.EmployeeData.find({where: {userId: userId}}).then((employee) => {
      if (employee) { //if a emplpoyee is found...
        //Update the data in the database for the employee that matches the userId
        db.EmployeeData.destroy({where: {userId: userId}});
        helpers.respondDBQuery(employee, req, res);
      } else { //otherwise... no user exists to be updated. Send 500
        res.status(500).send(JSON.stringify('No Such Employee Exists'));
      }
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    })
  });
}