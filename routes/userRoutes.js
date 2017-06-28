const helpers = require('../helpers');

module.exports = function(app, db) {

  app.get('/api/users', (req, res) => {
    let user = {
      name: req.query.userName,
      email: req.query.userEmail,
      mdn: req.query.mdn, //mobile device number
      country: req.query.country,
      city: req.query.city
    };

    if (!user.name && !user.email && !user.mdn && !user.country && !user.city) { //if no user data came from the req.body...
      db.UserData.findAll().then((users) => { //grab all data from the table instead
        helpers.respondDBQuery(users, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!user.name) { //else, if a user name exists...
      db.UserData.find({where: {userName: user.name}}).then((user) => {
        helpers.respondDBQuery(user, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!user.email) { //else, if a user email exists...
      db.UserData.find({where: {userEmail: user.email}}).then((user) => {
        helpers.respondDBQuery(user, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!user.mdn) { //else, if a user mobile device number exists...
      db.UserData.find({where: {mdn: user.mdn}}).then((user) => {
        helpers.respondDBQuery(user, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!user.country) { //else, if a user country exists...
      db.UserData.findAll({where: {country: user.country}}).then((users) => { //grab all that match
        helpers.respondDBQuery(users, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    } else if (!!user.city) { //else, if a user city exists...
      db.UserData.findAll({where: {city: user.city}}).then((users) => { //grab all that match
        helpers.respondDBQuery(users, req, res);
      }).catch((err) => {
        helpers.respondDBError(err, req, res);
      });
    }
  });

  app.post('/api/users', (req, res) => {
    let userId = req.body.userId;
    db.UserData.find({where: {userAuthId: userId}}).then((user) => {
      if(!user) {
        if (!req.body.profileData) {
          res.json({exists: false, user: null}).end();
        } else {
          let newUser = {
            userName: req.body.profileData.name,
            userEmail: req.body.profileData.email,
            mdn: req.body.profileData.phone,
            country: req.body.profileData.country,
            city: req.body.profileData.city,
            userAuthId: req.body.userId
          };
          helpers.saveImage(req.body.profileData.photo, newUser.userName.split(' ').join('-').toLowerCase()).then((imageName) => {
            newUser.photo = imageName;
            db.UserData.create(newUser).then((user) => {
              for (var language of req.body.profileData.languages) {
                db.Languages.find({where: {title: language}}).then((lang) => {
                  if (lang) {
                    db.UserLanguages.create({
                      userId: user.dataValues.id,
                      languageId: lang.dataValues.id
                    });
                  }
                });
              }
              res.json({exists: true, user: user}).end();
            }).catch((error) => {
              res.status(500).send(JSON.stringify('error creating new user ' + JSON.stringify(error)));
            });

          }, (error) => {
            res.status(500).send(JSON.stringify('error saving image ' + JSON.stringify(error)));
          });
        }
      } else {
        res.json({exists: true, user: user}).end();
      }
    })
  });

  app.put('/api/users/:userAuthId', (req, res, next) => {
    let userAID = req.params.userAuthId;

    db.UserData.find({where: {userAuthId: userAID}}).then((user) => {
      if (user) { //if a user is found...
        //Update the data in the database for the user that matches the userAuthId
        db.UserData.update({
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          mdn: req.body.mdn,
          country: req.body.country,
          photo: req.body.photo,
          type: req.body.type,
          city: req.body.city
        }, {where: {userAuthId: userAID}});
        helpers.respondDBQuery(user, req, res);
      } else { //otherwise... no user exists to be updated. Send 500
        res.status(500).send(JSON.stringify('No Such User Exists'));
      }
    }).catch((err) => {
      helpers.respondDBError(err, req, res);
    })
  });
}