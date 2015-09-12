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
    post: function (data, callback) {
      // Get userid from usertable
      // Get roomid from roomtable
      var queryString = "SELECT id AS userId FROM users WHERE name = ?; SELECT id AS roomId FROM rooms WHERE name = ?";
      var queryArgs = [data.username, data.roomname];
      db.connect();
      db.query(queryString, queryArgs, function(err, results){
        db.end();
        if(err){
          console.log(err);
        } else {
          var userId;
          var roomId;
          for (var i = 0; i < results.length; i++) {
            userId = userId || results[i].userId;
            roomId = roomId || results[i].roomId;
          }

          var queryString = "";
          var queryArgs = [];

          if (userId === undefined) {
            queryString += "INSERT INTO users (name) VALUES (?);";
            queryArgs.push(data.username);
          }

          if (roomId === undefined) {
            queryString += "INSERT INTO rooms (name) VALUES (?);";
            queryArgs.push(data.roomname);
          }

          queryString += "INSERT INTO messages (user, room, message) VALUES (
            (SELECT id FROM users WHERE name = ?), (SELECT id FROM rooms WHERE name = ?), ?)";
          queryArgs.push(data.username, data.roomname, data.text);

          db.connect();
          db.query(queryString, queryArgs, function(err, results) {
            db.end();
            if(err) {
              console.log(err);
            } else if (callback) {
              callback();
            }
          });
        }

      });
    } 
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

