const { SerialPort } = require('serialport');

const express = require("express");                      // use the 'express' library to start the app server
const app = express();                                   // make a new app 
const server = require('http').Server(app);              // and create an http server for the app
const io = require('socket.io')(server);                 // then create a socket using that server that clients can connect to
const port = 3000;   
                                   

SerialPort.list()
  .then((ports) => {
    console.log('Available Serial Ports:');
    ports.forEach((portInfo) => {
      console.log(`- Port: ${portInfo.path}, Manufacturer: ${portInfo.manufacturer}`);
    });
  })
  .catch((err) => {
    console.error('Error listing serial ports:', err.message);
  });

const serialPort = new SerialPort({
  path: '/dev/tty.usbmodem201912341', 
  baudRate: 115200 // Set to match your device's baud rate
});

serialPort.on('data', function (data) {
  console.log('Data:', data.toString());
  io.emit('plotter',data.toString());
})


server.listen(port, () => {                              //set up server to listen on specified port
  console.log('server is listening on port ' + port);    // print to the server console to log that the server is running
});

app.use(express.static("public"));                       // make all the files in 'public' available

io.on('connection', (socket) => {  
  console.log('user connected');                      // when a client has connected...
  serialPort.write('G92 X0Y0Z0\n');
  socket.on('gCodeOutput', (data) => {    
      // Write the command to tio's stdin
      serialPort.write(data);
  });
  socket.on('disconnect', (reason) => {  
    serialPort.write('G01 Z0\nG28\n');
  });
});
