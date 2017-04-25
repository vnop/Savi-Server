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
    method: 'GET',
    url: imageURL,
    encoding: null
  }
  let validImage = false;
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        console.log('false because error on get')
        reject(err);
      } else {
        let bodyHeader = body.toString('hex', 0, 4);
        if (bodyHeader === validHeaders.jpg) {
          validImage = true;
          imageName += '.jpg';
        } else if (bodyHeader === validHeaders.png) {
          validImage = true;
          imageName += '.png';
        } else if (bodyHeader === validHeaders.gif) {
          validImage = true;
          imageName += '.gif';
        } else {
          reject('bad URL or not an image');
        }
        if (validImage) {
          var fullPath = path.join(__dirname, '/img/' + imageName);
          fs.writeFile(fullPath, body, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(imageName);
            }
          });
        }
      }
    });
  });
}

const fillBookingData = (booking, db) => {
  return new Promise((res, rej) => {
    let newObj = {};
    let asyncActions = [];
    asyncActions.push(db.Tour.find({where: {id: booking.tourId}}).then((tour) => {
      newObj.tour = tour;
    }));
    asyncActions.push(db.UserData.find({where: {id: booking.driverId}}).then((driver) => {
      newObj.driver = driver;
    }));
    asyncActions.push(db.UserData.find({where: {id: booking.tourGuideId}}).then((guide) => {
      newObj.guide = guide;
    }));
    Promise.all(asyncActions).then(() => {
      res(newObj)
    });
  });
}

module.exports = {
  respondDBQuery: respondDBQuery,
  respondDBError: respondDBError,
  saveImage: saveImage,
  fillBookingData: fillBookingData
}