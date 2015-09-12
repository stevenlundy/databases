var Sequelize = require("sequelize");
var sequelize = new Sequelize("chatter", "root", "");
/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = sequelize.define('User', {
  username: Sequelize.STRING(20)
});

var Message = sequelize.define('Message', {
  text: Sequelize.STRING
});

var Room = sequelize.define('Room', {
  roomname: Sequelize.STRING(25)
});

// Room relationship
Room.hasMany(Message);
Message.belongsTo(Room);

// Message relationship
User.hasMany(Message);
Message.belongsTo(User);

// Friend relationship
User.belongsToMany(User, { as: 'Friender', through: 'friends', foreignKey: 'id' });
User.belongsToMany(User, { as: 'Friendee', through: 'friends', foreignKey: 'id' });

User.sync().then(function(){
  Room.sync().then(function(){
    Message.sync().then(function(){
      module.exports.User = User;
      module.exports.Room = Room;
      module.exports.Message = Message;
    });
  });
});