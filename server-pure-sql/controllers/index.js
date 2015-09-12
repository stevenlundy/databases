var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function(messages) {
        res.status(200).send({results: messages});
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req.body, function(){
        res.status(201).send('Message posted!');
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(users) {
        res.status(200).send(users);
      });
    },
    post: function (req, res) {
      models.users.post(req.body, function(){
        res.status(201).send('User created!');
      });
    }
  },

  rooms: {
    // Ditto as above
    get: function (req, res) {
      models.rooms.get(function(rooms) {
        res.status(200).send(rooms);
      });
    },
    post: function (req, res) {
      models.rooms.post(req.body, function(){
        res.status(201).send('Room created!');
      });
    }
  }
};

