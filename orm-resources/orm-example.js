/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

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

/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */




// Room.sync().then(function() {

//   var newRoom = Room.build({roomname: "lobby"});
//   newRoom.save().then(function() {
//     Room.findAll({where: {roomname: "lobby"} }).then(function(rooms) {
//       console.log(rooms);
//     });
//   });
// });


// User.sync().then(function() {
//   /* This callback function is called once sync succeeds. */

//   // now instantiate an object and save it:
//   var newUser = User.build({username: "jValjean"});
//   newUser.save().then(function() {

//     /* This callback function is called once saving succeeds. */

//     // Retrieve objects from the database:
//     User.findAll({ where: {username: "jValjean"} }).then(function(users) {
//       // This function is called back with an array of matches.
//       for (var i = 0; i < users.length; i++) {
//         console.log(users[i].username + " exists");
//       }
//     });
//   });
// });
Message.sync({force: true}).then(function(){
  User.findOrCreate({where: {username: 'jValjean'}}).spread(function(user, created) {
    Room.findOrCreate({where: {roomname: 'Paris'}}).spread(function(room) {
      var userId = user.get('id');
      var roomId = room.get('id');
      var newMessage = Message.build({text: 'I broke a window pane.',
                                      UserId: userId,
                                      RoomId: roomId});
      newMessage.save().then(function() {
        Message.findAll({where: {text: 'I broke a window pane.'}}).then(function(messages) {
          console.log(messages[0].get({
            plain: true
          }));
        });
      });
    });
  });
});

// Message.sync().then(function(){
//   var newMessage = Message.build({ text: 'Peter Piper picked a peck of pickled peppers.',
//                                    roomname: 'lobby', 
//                                    user_id: user.id});
//   newMessage.save().then(function(){
//     Message.findAll({where: {text: 'Peter Piper picked a peck of pickled peppers.'}}).then(function(messages){
//       console.log(messages);
//     });
//   });
// });







