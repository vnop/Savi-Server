const request = require('request');
const fs = require('fs');
const path = require('path');

const respondDBQuery = (dbResponse, req, res) => {
  if (!dbResponse) {
    res.status(500).send('No DB Entries matched the request');
  } else {
    res.json(dbResponse).end();
  }
}

const respondDBError = (DBError, req, res) => {
  res.json({error: DBError}).status(500).send;
}

const saveImage = (imageURL, imageName) => {
  let validHeaders = {
    jpg: 'ffd8ffe0',
    png: '89504e47',
    gif: '47494638'
  };

  let options = {
    method: GET,
    url: imageURL,
    encoding: null
  }

  request(options, (err, res, body) => {
    let fullPath = path.join(__dirname, '/img/' + imageName);
    if (err) {
      return false
    } else {
      let bodyHeader = body.toString('hex', 0, 4);
      if (bodyHeader === validHeaders.jpg) {
        fullPath += '.jpg';
      } else if (bodyHeader === validHeaders.png) {
        fullPath += '.png';
      } else if (bodyHeader === validHeaders.gif) {
        fullPath += '.gif'
      } else {
        return false;
      }
    }
  });

  return new Promise((resolve, reject) => {
    fs.writeFile(fullPath, body, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  respondDBQuery: respondDBQuery,
  respondDBError: respondDBError,
  saveImage: saveImage
}