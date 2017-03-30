function setupHostGame() {
  socket.on('WIN', function (msg) {
    alert('winning player is: ' + msg.username);
  });
}

function startNewHostGame() {
  var answer = document.getElementById('hostPrompt').value;
  socket.emit('ANSWER', { answer: answer });
}

setupHostGame();