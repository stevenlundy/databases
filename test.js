var model = require('./server/models');

model.messages.post({username: 'Steven', roomname: 'Hack Reactor', text: 'hello there!'}, function() {
  model.messages.get(function(messages) {
    console.log(messages);
  });
});
