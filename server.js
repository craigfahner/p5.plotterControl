const { SerialPort } = require('serialport');
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
const settingsPath = path.join(__dirname, 'settings.json');

// =======================
// SERVER START
// =======================
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Serve static files
//app.use(express.static('public'));  // this may be causing windows errors
app.use('/', express.static(path.join(__dirname, 'public')));

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

  fs.readFile(settingsPath, 'utf8', (err, data) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error reading settings.json:', err.message);
      }
      return;
    }
    try {
      const settings = JSON.parse(data);
      socket.emit('restoreSettings', settings);
    } catch (parseErr) {
      console.error('Error parsing settings.json:', parseErr.message);
    }
  });

  socket.on('saveSettings', (settings) => {
    fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), (err) => {
      if (err) {
        console.error('Error saving settings.json:', err.message);
      } else {
        console.log('Settings saved to settings.json');
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
