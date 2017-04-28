const fs = require('fs');
const Promise = require('bluebird');
const path = require('path');

module.exports = function(app, db) {

  app.get('/api/images/:imageName', (req, res) => {
    let imageName = req.params.imageName;
    let folder = path.join(__dirname, '../img/');
    console.log(path.join(__dirname, '../img/'))
    //let exists = fs.existsSync(path.join(__dirname, '../img/' + imageName));
    let exists = fs.existsSync(folder+imageName);
    if (imageName && exists) {
      res.sendFile(folder+imageName);
    } else if (!exists) {
      res.status(404).send(JSON.stringify('Image does not exist'));
    } else {
      res.status(400).send(JSON.stringify('Invalid param string'));
    }
  });
}