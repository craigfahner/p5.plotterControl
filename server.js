const { SerialPort } = require('serialport');
const NodeWebcam = require('node-webcam');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const fs = require('fs');

// =======================
// SETUP
// =======================
const port = 3000;
const portList = [];
let serialPort;
let Webcam;

// Setup image storage folder
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// =======================
// CAMERA SETUP
// =======================
NodeWebcam.list((cameras) => {
  const cleanedCameras = cameras.map(cam => cam.replace(/^=>\s*/, '').trim());
  const deviceName = cleanedCameras.find(c => c.includes('Logitech')) || cleanedCameras[0];

  if (!deviceName) {
    console.error('No webcam found');
    return;
  }

  Webcam = NodeWebcam.create({
    width: 1920,
    height: 1080,
    quality: 100,
    saveShots: true,
    output: 'jpeg',
    device: deviceName,
    callbackReturn: 'location',
    verbose: true,
    delay: 0.2
  });

  console.log('Webcam ready:', deviceName);
});

// =======================
// SERVER START
// =======================
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Serve static files
//app.use(express.static('public'));  // this may be causing windows errors
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(imagesDir));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// =======================
// SERIAL PORT LISTING
// =======================
SerialPort.list()
  .then((ports) => {
    console.log('Available Serial Ports:');
    ports.forEach((portInfo) => {
      console.log(`- Port: ${portInfo.path}, Manufacturer: ${portInfo.manufacturer}`);
      portList.push(portInfo.path);
    });
  })
  .catch((err) => {
    console.error('Error listing serial ports:', err.message);
  });

// =======================
// SOCKET.IO HANDLING
// =======================
io.on('connection', (socket) => {
  console.log('User connected');

  socket.emit('portList', portList);

  if (Webcam) {
    socket.emit('webcam-selected', 'Webcam ready');
  }

  socket.on('get-webcams', () => {
    NodeWebcam.list((cameras) => {
      const cleanedCameras = cameras.map(cam => cam.replace(/^=>\s*/, '').trim());
      socket.emit('webcam-list', cleanedCameras);
    });
  });

  socket.on('capture-image', () => {
    if (!Webcam) {
      console.error('Webcam not set yet');
      socket.emit('capture-error', 'Webcam not set yet.');
      return;
    }

    const fileName = `image_${Date.now()}.jpg`;
    const filePath = path.join(imagesDir, fileName);

    Webcam.capture(filePath, (err) => {
      if (err) {
        console.error('Capture error:', err);
        socket.emit('capture-error', err.message);
      } else {
        console.log('Image captured:', fileName);
        socket.emit('capture-success', fileName);
      }
    });
  });

  socket.on('gCodeOutput', (data) => {
    if (serialPort && serialPort.isOpen) {
      serialPort.write(data);
    } else {
      console.error('Serial port not open');
    }
  });

  socket.on('portSelect', (data) => {
    serialPort = new SerialPort({
      path: data,
      baudRate: 115200
    });

    socket.emit('portConnected', data);
    serialPort.write('G92 X0Y0Z0\n');

    serialPort.on('data', (data) => {
      console.log('Plotter data:', data.toString());
      io.emit('plotter', data.toString());
    });
  });

  socket.on('disconnectPort', (callback) => {
    if (serialPort && serialPort.isOpen) {
      serialPort.close((err) => {
        if (err) {
          console.error('Error closing port:', err.message);
          if (callback) callback({ success: false, error: err.message });
        } else {
          console.log('Serial port disconnected');
          if (callback) callback({ success: true });
          serialPort = null;
        }
      });
    } else {
      console.log('No port to disconnect');
      if (callback) callback({ success: false, error: 'No port is currently connected' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${reason}`);
    if (serialPort && serialPort.isOpen) {
      serialPort.write('G01 Z0\nG28\n');
      serialPort.close((err) => {
        if (err) {
          console.error('Serial port close error:', err.message);
        } else {
          console.log('Serial port closed');
        }
      });
    }
  });
});
