'use_strict';

const io = require('socket.io');
const events = require('./events');

module.exports = {

  init(http) {
    var channel = io.listen(http);
    channel.on(events.CONNECTION, socket => {

     socket.on(events.MESSAGE_CREATE, msg => {
        channel.sockets.emit(events.MESSAGE_CREATE_BROADCAST, msg); //Broadcasting message to everyone including sender to inform about message id
      });

      socket.on(events.NOTE, msg => {
        channel.sockets.emit(events.NOTE_BROADCAST, msg);
      })

      socket.on('ANSWER', msg => {
        this.proper = msg.answer;
      })

      socket.on('GUESS', msg => {
        if (msg.guess === this.proper) {
          console.log(msg, this.proper);
          channel.sockets.emit('WIN', msg);
        }
      })
    });
  }

};