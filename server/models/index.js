var db = require('../db');

module.exports = {
  messages: {
    // a function which produces all the messages
    get: function (callback) {
      var queryString = "SELECT u.name AS username, m.message AS text, r.name AS roomname, m.id AS objectId, m.timestamp AS createdAt \
                        FROM messages m JOIN users u ON (m.user=u.id) JOIN rooms r ON (m.room=r.id)";
      var queryArgs = [];

      db.query(queryString, queryArgs, function(err, results){
        if(err){
          console.log(err);
        } else {
          callback(results);
        }
      });
    }, 
    // a function which can be used to insert a message into the database
    post: function (data, callback) {
      var queryString = "SELECT id AS userId FROM users WHERE name = ?; SELECT id AS roomId FROM rooms WHERE name = ?";
      var queryArgs = [data.username, data.roomname];
      db.query(queryString, queryArgs, function(err, results){
        if(err){
          console.log(err);
        } else {
          var userId = results[0][0] ? results[0][0].userId : undefined;
          var roomId = results[1][0] ? results[1][0].roomId : undefined;

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

          queryString += "INSERT INTO messages (user, room, message) VALUES ( \
            (SELECT u.id FROM users u WHERE u.name = ?), (SELECT r.id FROM rooms r WHERE r.name = ?), ?)";
          queryArgs.push(data.username, data.roomname, data.text);

          db.query(queryString, queryArgs, function(err, results) {
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
    get: function (callback) {
      var queryString = "SELECT name AS username FROM users";
      var queryArgs = [];

      db.query(queryString, queryArgs, function(err, results){
        if(err){
          console.log(err);
        } else {
          callback(results);
        }
      });
    },
    post: function (data, callback) {
      var queryString = "INSERT INTO users (name) VALUES (?)";
      var queryArgs = [data.username];
      db.query(queryString, queryArgs, function(err, results){
        if(err){
          console.log(err);
        } else if (callback){
          callback();
        }
      })
    }
  }
};

