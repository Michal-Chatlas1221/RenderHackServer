var ctx = (function getCtx() {
  var Ctor =
    (typeof AudioContext !== 'undefined' && AudioContext) ||
    (typeof webkitAudioContext !== 'undefined' && webkitAudioContext);

  return Ctor && new Ctor();
}());

var currentNotes = {};

function noteToFrequency (note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function noteOn(noteNumber, velocity) {
  if (currentNotes[noteNumber]) {
    return;
  }
  var gainNode = ctx.createGain(),
      oscNode = ctx.createOscillator();
  oscNode.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscNode.frequency.value = noteToFrequency(noteNumber);
  oscNode.start(0);
  currentNotes[noteNumber] = oscNode;
}

function noteOff(noteNumber) {
  var osc = currentNotes[noteNumber];
  if (osc) {
    osc.stop();
  }
  delete currentNotes[noteNumber];
}

function midiMessageReceived(ev) {
  var arr = Array.prototype.slice.call(ev.data);
  console.log(ev);
  console.log(arr.map(function (num) { return (+num).toString(16); }).join());
  window.lastEvent = ev;
  
  switch(arr[0]) {
    case 0x90: return noteOn(arr[1], arr[2]);
    case 0x80: return noteOff(arr[1]);
  }
  
}

function onMIDIStarted(midi) {
  var inputs = midi.inputs.values(),
    firstInput,
    midiIn;
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input = input.value;
    if (!firstInput)
      firstInput = input;
    var str = input.name.toString();
    var preferred = !midiIn && ((str.indexOf("MPK") != -1) || (str.indexOf("Keyboard") != -1) || (str.indexOf("keyboard") != -1) || (str.indexOf("KEYBOARD") != -1));

    // if we're rebuilding the list, but we already had this port open, reselect it.
    if (midiIn && midiIn == input)
      preferred = true;

    //selectMIDI.appendChild(new Option(input.name, input.id, preferred, preferred));
    if (preferred) {
      midiIn = input;
      midiIn.onmidimessage = midiMessageReceived;
    }
  }
  if (!midiIn) {
    midiIn = firstInput;
    if (midiIn) {
      midiIn.onmidimessage = midiMessageReceived;
    }
  }
}

function onMIDISystemError( err ) {
  document.getElementById("synthbox").className = "error";
  console.log( "MIDI not initialized - error encountered:" + err.code );
}

function startMidi() {
  //init: start up MIDI
  window.addEventListener('load', function() {
    if (navigator.requestMIDIAccess)
      navigator.requestMIDIAccess().then( onMIDIStarted, onMIDISystemError );
  });
}