const { SerialPort } = require('serialport');

const express = require("express");                      // use the 'express' library to start the app server
const app = express();                                   // make a new app 
const server = require('http').Server(app);              // and create an http server for the app
const io = require('socket.io')(server);                 // then create a socket using that server that clients can connect to
const port = 3000;   
const portList = [];
let serialPort;
                                   

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


server.listen(port, () => {                              //set up server to listen on specified port
  console.log('server is listening on port ' + port);    // print to the server console to log that the server is running
});

app.use(express.static("public"));                       // make all the files in 'public' available

io.on('connection', (socket) => {  
  console.log(portList);
  socket.emit("portList", portList);
  console.log('user connected');                      // when a client has connected...
  socket.on('gCodeOutput', (data) => {    
      // Write the command to tio's stdin
      serialPort.write(data);
  });
  socket.on('portSelect', (data) => {
    serialPort = new SerialPort({
      path: data, 
      baudRate: 115200 // Set to match your device's baud rate
    });
    socket.emit("portConnected", data);
    serialPort.write('G92 X0Y0Z0\n'); // this is the "start" command?
    serialPort.on('data', function (data) {
      console.log('Data:', data.toString());
      io.emit('plotter',data.toString());
    });
  });
  // socket.on('disconnectPort', () => {
  //   serialPort.write('G01 Z0\nG28\n'); //rtz
  //   serialPort.close(function (err) {
  //     console.log('port closed', err);
  //   });
  // });
  socket.on('disconnectPort', (callback) => {
    if (serialPort && serialPort.isOpen) {
      serialPort.close((err) => {
        if (err) {
          console.error('Error closing port:', err.message);
          if (callback) callback({ success: false, error: err.message });
        } else {
          console.log('Port successfully disconnected');
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
    if(serialPort){
      serialPort.write('G01 Z0\nG28\n'); //rtz

    serialPort.close(function (err) {
      console.log('port closed', err);
    });
    }
  });
});
