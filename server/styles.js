var router = require('express').Router();
var db = require('./db');

router.route('/userstyle.css').get(function(req, res) {
  db.User.findAll().then(function(users) {
    var stylesheet = "";

    users.forEach(function(user) {
      stylesheet += "\n\
      .user" + user.id + "{   \n\
        font-family: " + user.fontFamily + "; \n\
        color: " + user.fontColor + "; \n\
      }\n";
    });

    res.set('Content-Type', 'text/css');
    res.send(stylesheet);
  });
});
module.exports = router;