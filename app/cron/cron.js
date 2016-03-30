module.exports = {
  setReminder: function (item) {
    /*
      setTimeout, when timed out, spawn process with user info
      to send mail and save them from getting intercoursed
    */
    setTimeout (function () {
      //console.log (item, 'after a fucking timeout');
    }, 2000);
  }
};
