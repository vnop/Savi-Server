const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const https = require('https');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const helpers = require('../helpers');
const nodemailer = require('nodemailer');
const mailer = require('../mailer/mailer');
var stripe = require('stripe')('sk_test_t33bUz9G1cD2X6UexENeMvpd');

module.exports = function(app, db) {

  app.get('/api/images/:imageName', (req, res) => {
    let imageName = req.params.imageName;
    let exists = fs.existsSync(path.join(__dirname, '/img/' + imageName));
    if (imageName && exists) {
      res.sendFile(path.join(__dirname, '/img/' + imageName));
    } else if (!exists) {
      res.status(404).send(JSON.stringify('Image does not exist'));
    } else {
      res.status(400).send(JSON.stringify('Invalid param string'));
    }
  });
}