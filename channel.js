'use_strict';

const io = require('socket.io');
const events = require('./events');

const sequence = () => {
  let counter = 1;

  return () => counter++;
};

module.exports = {

  history: [],
  nextId: sequence(),
  nextUserId: sequence(),
  userIds: new Map([]),

  init(http) {
    var channel = io.listen(http);
    channel.on(events.CONNECTION, socket => {

      socket.emit(events.HISTORY, {history: this.history});
      socket.userId = this.nextUserId();
      socket.emit(events.CONNECTION_ACK, {id: socket.userId});
      socket.broadcast.emit(events.CONNECTION_BROADCAST, {id: socket.userId});

      socket.on(events.USER_NAME, msg => {
        this.userIds.set(socket.userId, msg.name);
        channel.sockets.emit(events.USER_NAME_BROADCAST, {id: socket.userId, username: msg.name})
      });

      socket.on(events.USER_QUERY, () => {
        socket.emit(events.USER_RESULT, Array.from(this.userIds).map(([id, username]) => ({id, username})));
      });

      socket.on(events.DISCONNECT, () => {
        socket.broadcast.emit(events.DISCONNECT_BROADCAST, {id: socket.userId});
        this.userIds.delete(socket.id);
      });

      socket.on(events.MESSAGE_CREATE, msg => {
        const wrappedMessage = Object.assign({}, msg, {timestamp: Date.now(), id: this.nextId(), userId: socket.userId});
        this.history.push(wrappedMessage);
        channel.sockets.emit(events.MESSAGE_CREATE_BROADCAST, wrappedMessage); //Broadcasting message to everyone including sender to inform about message id
      });

      socket.on(events.MESSAGE_DELETE, msg => {
        this.history = this.history.filter(e => e.id !== msg.id || e.userId !== socket.userId);
        channel.sockets.emit(events.MESSAGE_DELETE_BROADCAST, { id: msg.id });
      });

      socket.on(events.MESSAGE_UPDATE, msg => {
        this.history = this.history.map(e => e.id === msg.id && e.userId === socket.userId ? Object.assign({}, e, {msg: msg.newValue}) : e);
        socket.broadcast.emit(events.MESSAGE_UPDATE_BROADCAST, this.history.find(e => e.id === msg.id));
      })

      socket.on(events.NOTE, msg => {
        channel.sockets.emit(events.NOTE_BROADCAST, msg);
      })
    });
  }

};