const socket = io();

// Get the status display element
const status = document.getElementById('status');

// Make sure elements are found
if (!status) console.error('status is null');

// -----------------------------
// 1. When the page loads, ask for webcams (optional, just info)
// -----------------------------
socket.emit('get-webcams');

// Server sends available webcams (info only, no selection needed anymore)
socket.on('webcam-list', (cameras) => {
  console.log('Received webcams:', cameras);

  if (cameras.length === 0) {
    status.textContent = 'No webcams found.';
    return;
  }
});

// -----------------------------
// 2. When the server tells us which webcam it auto-selected
// -----------------------------
socket.on('webcam-selected', (deviceName) => {
  console.log('Webcam selected by server:', deviceName);
  status.textContent = `Webcam selected: ${deviceName}`;
});

// -----------------------------
// 3. Manual capture function you can call anytime
// -----------------------------
window.captureAndSaveImage = function () {
  console.log('Requesting image capture...');
  status.textContent = 'Capturing image...';
  socket.emit('capture-image');
};

// -----------------------------
// 4. Server responds to capture success or error
// -----------------------------
socket.on('capture-success', (fileName) => {
  console.log('Image capture success:', fileName);
  status.innerHTML = `Image captured successfully! (<b>${fileName}</b>)`;
});

socket.on('capture-error', (message) => {
  console.error('Image capture error:', message);
  status.textContent = `Error capturing image: ${message}`;
});
