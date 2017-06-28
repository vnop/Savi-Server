'use strict'

const fs = require('fs');
const path = require('path');
const expect = require('expect.js');
const helpers = require('../helpers');

describe ('Helper Functions', () => {

  after((done) => {
    fs.unlinkSync(path.join(__dirname, '../img/' + 'test-img0.jpg'));
    fs.unlinkSync(path.join(__dirname, '../img/' + 'test-img2.jpg'));
    fs.unlinkSync(path.join(__dirname, '../img/' + 'test-img3.png'));
    fs.unlinkSync(path.join(__dirname, '../img/' + 'test-img4.gif'));
    done();
  })

  it('saveImage should correctly save a valid image', (done) => {
    var imageSave = helpers.saveImage('http://i.imgur.com/zxPr3e8.jpg', 'test-img0');
    imageSave.then((imageName) => {
      expect(imageName).to.equal('test-img0.jpg', 'Should have the correct image name');
      let exists = fs.existsSync(path.join(__dirname, '../img/' + imageName));
      expect(exists).to.equal(true, 'Saved image should exist');
      done();
    });
  });

  it('saveImage should error on an invalid image URL', (done) => {
    var imageSave = helpers.saveImage('badurl', 'test-img1');
    imageSave.then((imageName) => {
      expect(imageName).to.not.exist;
      done();
    }, (error) => {
      expect(error).to.exist;
      done();
    });
  });

  it('saveImage should correctly save JPG files as such', (done) => {
    var imageSave = helpers.saveImage('http://i.imgur.com/zxPr3e8.jpg', 'test-img2');
    imageSave.then((imageName) => {
      expect(imageName).to.equal('test-img2.jpg', 'Should have the correct image name');
      let exists = fs.existsSync(path.join(__dirname, '../img/' + imageName));
      expect(exists).to.equal(true, 'Saved image should exist');
      done();
    });
  });

  it('saveImage should correctly save PNG files as such', (done) => {
    var imageSave = helpers.saveImage('http://i.imgur.com/JLTfOBL.png', 'test-img3');
    imageSave.then((imageName) => {
      expect(imageName).to.equal('test-img3.png', 'Should have the correct image name');
      let exists = fs.existsSync(path.join(__dirname, '../img/' + imageName));
      expect(exists).to.equal(true, 'Saved image should exist');
      done();
    });
  });

  it('saveImage should correctly save GIF files as such', (done) => {
    var imageSave = helpers.saveImage('http://i.imgur.com/9LEsBZn.gif', 'test-img4');
    imageSave.then((imageName) => {
      expect(imageName).to.equal('test-img4.gif', 'Should have the correct image name');
      let exists = fs.existsSync(path.join(__dirname, '../img/' + imageName));
      expect(exists).to.equal(true, 'Saved image should exist');
      done();
    });
  });
});