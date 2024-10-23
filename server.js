const fs = require('fs');
const pty = require('node-pty');
const path = '/dev';

// List of patterns for TTY devices
const ttyPatterns = [/tty/, /cu/];


const express = require("express");                      // use the 'express' library to start the app server
const app = express();                                   // make a new app 
const server = require('http').Server(app);              // and create an http server for the app
const io = require('socket.io')(server);                 // then create a socket using that server that clients can connect to
const port = 3000;                                       // specify the port where communication will happen

fs.readdir(path, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory:', err);
  }

  const ttyDevices = files.filter(file => ttyPatterns.some(pattern => pattern.test(file)));
  
  console.log('Available TTY Devices:', ttyDevices);
});

// const tioProcess = spawn('tio', ['-e','/dev/cu.usbmodem201912341'], {
//   stdio: ['pipe', 'pipe', 'pipe'] // Ensures stdin, stdout, and stderr are open for interaction
// }); // Adjust the serial port accordingly

const tioProcess = pty.spawn('tio', ['/dev/cu.usbmodem201912341'], {
  name: 'xterm-color', // Or use 'vt100' or other terminal emulation types
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

tioProcess.on('data', (data) => {
  console.log(`Received data from tio: ${data}`);
});

server.listen(port, () => {                              //set up server to listen on specified port
  console.log('server is listening on port ' + port);    // print to the server console to log that the server is running
});

app.use(express.static("public"));                       // make all the files in 'public' available

io.on('connection', (socket) => {  
  console.log('user connected');                      // when a client has connected...
  socket.on('gCodeOutput', (data) => {    
      // Write the command to tio's stdin
      tioProcess.write(data);
  });
});

// Close the tio process when the server shuts down
process.on('exit', () => {
  tioProcess.kill(); // Kill the tio process
});

function sendMultiLineCommand(command) {
  // Check if command is a valid string
  if (command && typeof command === 'string') {
      const lines = command.split('\n');

      // Write each line to tioProcess.stdin
      lines.forEach(line => {
          if (line.trim()) { // Ensure we don't send empty lines
              console.log(`Sending line to tio: ${line}`);
              tioProcess.write(`${line.trim()}\n`); // Send the line to tio
          }
      });
  } else {
      console.error('Invalid command input:', command);
  }
}