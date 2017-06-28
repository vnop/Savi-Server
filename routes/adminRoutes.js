const helpers = require('../helpers');
const bcrypt = require('bcrypt-nodejs');

module.exports = function(app, db) {
  app.post('/api/admin', (req, res) => {
    if (!req.body || !req.body.userName || !req.body.password) {
      res.status(400).send(JSON.stringify('Bad request'));
    } else {
      db.Administrator.find({where: {userName: req.body.userName}}).then((user) => {
        if (!user) {
          res.status(400).send(JSON.stringify('User not found'));
        } else {
          let authorized = bcrypt.compareSync(req.body.password, user.password);
          if (authorized) {
            res.send(JSON.stringify('Logged In Successfully'));
          } else {
            res.status(401).send(JSON.stringify('Bad Credentials'));
          }
        }
      });
    }
  });
}