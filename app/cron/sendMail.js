process.once ('message', function (clientDetails) {
  var nodemailer = require('nodemailer'),
    config = require ('../../config/config'),
    fs = require ('fs'),

    emailTemplate = fs.readFileSync ('emailTemplate.txt'),
    smtpURL = config.smtpURL.replace ('<EMAIL>', config.wishupEmailId).replace ('<PASSWORD>', config.wishupEmailPassword),
    transporter = nodemailer.createTransport(smtpURL), // create reusable transporter object using the default SMTP transport

    mailOptions = {
      from: '"Fred Foo" <foo@blurdybloop.com>', // sender address
      to: clientDetails.recipient, // list of receivers
      subject: 'To-Do Reminder', // Subject line
      html: emailTemplate
              .replace ('<DESCRIPTION>', clientDetails.toDoItem.description)
              .replace ('<LOCATION>', clientDetails.toDoItem.location || '')
              .replace ('<DATE_TIME>', clientDetails.toDoItem.dateTime)
              .replace ('<ITEM_ID>', clientDetails.todoItem.id)  //html body via template
    };  // setup e-mail data with unicode symbols

    // send mail with defined transport object
    transporter.sendMail (mailOptions, function(error, info) {
      if (error) {
        return (console.log(error));
      }
      console.log ('Item reminder sent: ' + info.response);
    });
});
