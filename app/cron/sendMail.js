process.once ('message', function (clientDetails) {
  var nodemailer = require('nodemailer'),
    config = require ('../../config/config'),
    fs = require ('fs'),

    emailTemplate = fs.readFileSync ('./app/cron/emailTemplate.txt').toString (),
    smtpUrl = config.smtpUrl.replace ('<EMAIL>', config.wishupEmailId).replace ('<PASSWORD>', config.wishupEmailPassword),
    transporter = nodemailer.createTransport(smtpUrl), // create reusable transporter object using the default SMTP transport

    mailOptions = {
      from: '"Fred Foo" <foo@blurdybloop.com>', // sender address
      to: clientDetails.recipient, // list of receivers
      subject: 'To-Do Reminder', // Subject line
      html: emailTemplate
              .replace ('<DESCRIPTION>', clientDetails.description)
              .replace ('<LOCATION>', clientDetails.location || '')
              .replace ('<DEADLINE>', clientDetails.deadline)
              .replace ('<ITEM_ID>', clientDetails.id)  //html body via template
    };  // setup e-mail data with unicode symbols

    // send mail with defined transport object
    transporter.sendMail (mailOptions, function(error, info) {
      if (error) {
        return (console.log(error));
      }
      console.log ('Item reminder sent: ' + info.response);
    });
});
