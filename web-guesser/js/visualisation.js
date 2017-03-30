var analyser;

function startVis(audioNode) {
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512; // see - there is that 'fft' thing. 
    audioNode.connect(analyser);
}

function render(analyser, canvas) {
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    var canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, 2000, 2000);
    canvasCtx.strokeStyle = '#000';
    canvasCtx.strokeWidth = '2px';
    canvasCtx.beginPath();
    for (var i = 0; i < dataArray.length; i++) {
        if (i) {
            canvasCtx.lineTo(i, +dataArray[i]);
        } else {
            canvasCtx.moveTo(i, +dataArray[i]);
        }
    }
    canvasCtx.stroke();
    requestAnimationFrame(function() {
        render(analyser, canvas);
    });
}

startVis(window.outNode);

setTimeout(function() {
    render(analyser, document.getElementById('visualisation'));
}, 100);