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

let mailOptions = function(targetEmail, userName, tourName, date) {
    return {
        from: '"Savi Travel 👻" <savitravel.mail@gmail.com>', // sender address
        to: targetEmail,
        subject: mailTemplate.newBooking.subject, // Subject line
        text: 'Howdy!', // plain text body
        html: mailTemplate.newBooking.content(userName, tourName, date) // html body    
    }
}

module.exports = {
    mailOptions: mailOptions,
    transporter: transporter
}