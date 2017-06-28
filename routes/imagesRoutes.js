const fs = require('fs');
const path = require('path');

module.exports = function(app, db) {

  app.get('/api/images/:imageName', (req, res) => {
    let imageName = req.params.imageName;
    let folder = path.join(__dirname, '../img/');//direct path
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