var db = require('../db');

module.exports = {
  messages: {
    // a function which produces all the messages
    get: function (callback) {
      db.connect();
      var queryString = "SELECT u.name AS username, m.message AS text, r.name AS roomname, m.id AS objectId, m.timestamp AS createdAt \
                        FROM messages m JOIN users u ON (m.user=u.id) JOIN rooms r ON (m.room=r.id)";
      var queryArgs = [];

      db.query(queryString, queryArgs, function(err, results){
        db.end();
        if(err){
          console.log(err);
        } else {
          callback(results);
        }
      });
    }, 
    // a function which can be used to insert a message into the database
    post: function () {
      db.connect();



      db.end();
    } 
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

