'use strict';

function replaceAll (str, mapObj) {
  var re = new RegExp(Object.keys (mapObj).join ("|"), "gi");

  return (str.replace (re, function (matched){
    return (mapObj[matched.toLowerCase()]);
  }));
}

process.once ('message', function (clientDetails) {
  var nodemailer = require('nodemailer'),
    config = require ('../../config/config'),
    fs = require ('fs'),

    emailTemplate = fs.readFileSync ('./app/cron/emailTemplate.txt').toString (),
    smtpUrl = replaceAll (config.smtpUrl, {'<EMAIL>': config.wishupEmailId, '<PASSWORD>': config.wishupEmailPassword}),
    transporter = nodemailer.createTransport(smtpUrl), // create reusable transporter object using the default SMTP transport

    mailOptions = {
      from: '"Raghav" <raghav@raghavdua.com>', // sender address
      to: clientDetails.recipient, // list of receivers
      subject: 'To-Do Reminder', // Subject line
      html: replaceAll (emailTemplate, {
        '<DESCRIPTION>': clientDetails.description,
        '<LOCATION>': clientDetails.location || '',
        '<DEADLINE>': clientDetails.deadline,
        '<ITEM_ID>': clientDetails.id
      })
    };  // setup e-mail data with unicode symbols

    // send mail with defined transport object
    transporter.sendMail (mailOptions, function(error, info) {
      if (error) {
        return (console.log(error));
      }
      console.log ('Item reminder sent: ' + info.response);
    });
});
