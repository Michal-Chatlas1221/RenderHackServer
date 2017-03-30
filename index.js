'use_strict';

const app = require('express')();
const http = require('http').Server(app);
const channel = require('./channel');

channel.init(http);

app.get('/', function(req, res) {
  res.send(`
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js"></script>
    <script>
        var socket = io.connect('http://localhost:3000/');
    </script>
    `);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});