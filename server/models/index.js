var db = require('../db');

module.exports = {
  messages: {
    // a function which produces all the messages
    get: function (callback) {
      db.Message.findAll({
        order: 'createdAt ASC',
        include: [ 
          {model: db.User, as: 'User', attributes: ['username'], required: true},
          {model: db.Room, as: 'Room', attributes: ['roomname'], required: true}
        ]
      }).then(function(messages) {
        callback(messages.map(function(message) {
          return {
            username: message.User.username,
            userId: message.UserId,
            roomname: message.Room.roomname,
            createdAt: message.createdAt,
            text: message.text,
            objectId: message.id
          };
        }));
      });
    }, 
    // a function which can be used to insert a message into the database
    post: function (data, callback) {
      db.Message.sync().then(function(){
        db.User.findOrCreate({where: {username: data.username}}).spread(function(user, created) {
          db.Room.findOrCreate({where: {roomname: data.roomname}}).spread(function(room) {
            var userId = user.get('id');
            var roomId = room.get('id');
            var newMessage = db.Message.build({
              text: data.text,
              UserId: userId,
              RoomId: roomId
            });
            newMessage.save().then(callback);
          });
        });
      });
    } 
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.User.findAll().then(function(users) {
        callback(users);
      });
    },
    post: function (data, callback) {
      db.User.findOrCreate({where: {username: data.username}}).spread(function(user, created) {
        user.updateAttributes({fontFamily: data.fontFamily, fontColor: data.fontColor}).then(callback);
      });
    }
  },

  rooms: {
    // Ditto as above.
    get: function (callback) {
      db.Room.findAll().then(function(rooms) {
        callback(rooms);
      });
    },
    post: function (data, callback) {
      var newRoom = db.Room.build({roomname: data.roomname});
      newRoom.save().then(callback);
    }
  }
};

