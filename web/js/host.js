function setupHostGame() {
  socket.on('WIN', function (msg) {
    var notes = window.currentNotes || {};
    Object.keys(notes).forEach(function (note) {
      notes[note].stop();
    });
    alert('winning player is: ' + msg.username);
  });
}

function startNewHostGame() {
  var answer = document.getElementById('hostPrompt').value;
  socket.emit('ANSWER', { answer: answer });
}

setupHostGame();