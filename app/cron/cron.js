'use strict';

var childProcess = require ('child_process');

module.exports = {
  setReminder: function (item) {
    /*
      setTimeout, when timed out, spawn process with user info
      to send mail and save them from getting intercoursed
    */
    var emailDue = new Date (item.deadline), timeToLapse = null;

    emailDue.setMinutes (emailDue.getMinutes () - 1);
    timeToLapse = emailDue.getTime () - (new Date ()).getTime ();   //this could cause problems if the server time differs from client time

    if (emailDue < (new Date ())) { return; }
    setTimeout (function () {
      //spawn process to fire email reminder
      childProcess
        .fork ('./app/cron/sendMail')
        .send (item);
    }, timeToLapse);
  }
};
