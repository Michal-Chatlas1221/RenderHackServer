window.ctx = (function getCtx() {
    var Ctor =
        (typeof AudioContext !== 'undefined' && AudioContext) ||
        (typeof webkitAudioContext !== 'undefined' && webkitAudioContext);

    return Ctor && new Ctor();
}());

window.outNode = window.ctx.createGain();
window.outNode.connect(window.ctx.destination);