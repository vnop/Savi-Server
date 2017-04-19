const nodemailer = require('nodemailer');
const mailTemplate = require('./mail_template')
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'savitravel.mail@gmail.com',
        pass: 'savitravelsavitravel'
    }
});

let mailOptions = function(userObject, tourName, date) {
  return {
    from: '"Savi Travel 👻" <savitravel.mail@gmail.com>',
    to: userObject.userEmail,
    subject: mailTemplate[userObject.type].subject, 
    text: 'Howdy!', 
    html: mailTemplate[userObject.type].content(userObject.userName, tourName, date) // html body    
  }
}

let sendMailToAll = function(destinataries, tour, date) {     
  return new Promise(function(resolve, reject) {
    Array.prototype.forEach.call(destinataries, function(destinatary, index, array) {      
      var lastIndex = index; // Testing purposes          
      transporter.sendMail(mailOptions(destinatary, tour, date), (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {                    
          resolve({emailResMessage: 'Email sent successfully!', lastIndex: lastIndex})        
        }
      });
    })    
  }) 
}


module.exports = {
    mailOptions: mailOptions,
    transporter: transporter,
    sendMailToAll: sendMailToAll
}