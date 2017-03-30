'use_strict';

const app = require('express')();
const http = require('http').Server(app);
const channel = require('./channel');

channel.init(http);

app.use(express.static('web'));
app.use(express.static('web-guesser'))

app.get('/', function(req, res) {
  res.send(`
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js"></script>
    <script>
        var socket = io.connect('http://178.62.43.178:3000');
    </script>
    `);
});

app.get('/host', function (req, res) {
  res.sendFile('web/index.htm')
});

app.get('/client', function (req, res) {
  res.sendFile('web-guesser/index.htm')
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});