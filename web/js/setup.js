window.ctx = (function getCtx() {
  var Ctor =
    (typeof AudioContext !== 'undefined' && AudioContext) ||
    (typeof webkitAudioContext !== 'undefined' && webkitAudioContext);

  return Ctor && new Ctor();
}());

window.outNode = window.ctx.createGain();
window.outNode.connect(window.ctx.destination);

window.socket = io.connect('http://178.62.43.178:3000');
