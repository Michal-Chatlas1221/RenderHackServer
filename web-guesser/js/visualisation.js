var analyser,
    dataArray;

function startVis(audioNode) {
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256; // see - there is that 'fft' thing. 
  audioNode.connect(analyser);

  var bufferLength = analyser.frequencyBinCount;
  //console.log(bufferLength);
  dataArray = new Uint8Array(bufferLength);
}

function render(analyser, canvas) {
  analyser.getByteFrequencyData(dataArray);
  var canvasCtx = canvas.getContext('2d');
  canvasCtx.clearRect(0, 0, 1000, 1000);
  canvasCtx.strokeStyle = '#000';
  canvasCtx.strokeWidth = '2px';
  canvasCtx.beginPath();
  //console.log(dataArray.join());
  for (var i = 0; i < dataArray.length; i++) {
    canvasCtx.lineTo(i, dataArray[i]);
    //canvasCtx.lineTo(i, i);
  }
  canvasCtx.stroke();
}

startVis(window.outNode);

setInterval(function () {
  render(analyser, document.getElementById('visualisation'));
}, 100);