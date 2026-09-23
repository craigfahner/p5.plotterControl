// Relay server for the vacant lots demo.
//
//   phones (/prompt)  --prompt:submit-->  server  --prompt:new-->  plotter page (/plotter)
//
// The server doesn't need to queue anything: GPlotter already queues plotter
// commands in the plotter page and sends them to the plotter one at a time.
// This just serves the two web pages, cleans up the text people send, and
// passes it along. The plotter page picks the vacant lot for each prompt.
//
// Run:   npm install
//        npm start
// Then:  open http://localhost:3000/plotter in Chrome on this computer (Web Serial
//        only works on localhost or https), and point the QR code at your ngrok
//        URL (`ngrok http 3000`), which opens the prompt page.

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

let port = 3000;

// The longest prompt allowed, in characters (the phone page uses the same limit).
let maxLength = 140;

let app = express();
let server = http.createServer(app);
let io = new socketIO.Server(server);

// Serve everything in the public folder (the prompt page and the plotter page).
app.use(express.static(path.join(__dirname, 'public')));

// Serve gplotter.js from the main project folder, so the demo always uses the
// current version of the library.
app.get('/lib/gplotter.js', function (request, response) {
  response.sendFile(path.join(__dirname, '..', 'gplotter.js'));
});

// Send visitors to the prompt page, so the QR code can use the plain URL.
app.get('/', function (request, response) {
  response.redirect('/prompt/');
});

// Cleans up a prompt so the plotter's font can draw all of it.
// The font only has the basic keyboard characters, and phones often type
// "curly" quotes and apostrophes, which would otherwise plot as blank spaces.
function cleanText(text) {
  if (typeof text != 'string') {
    return '';
  }

  text = text.replace(/[‘’‛′]/g, "'");  // curly apostrophes -> '
  text = text.replace(/[“”″]/g, '"');   // curly quotes -> "
  text = text.replace(/[–—]/g, '-');    // long dashes -> -
  text = text.replace(/…/g, '...');     // ellipsis character -> ...
  text = text.replace(/\s/g, ' ');      // line breaks and tabs -> spaces
  text = text.replace(/[^ -~]/g, '');   // remove anything else the font can't draw (like emoji)
  text = text.replace(/ +/g, ' ');      // repeated spaces -> one space
  text = text.trim();

  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim();
  }
  return text;
}

let nextPromptId = 1;

io.on('connection', function (socket) {

  // The plotter page sends this when it connects, so we know where to send prompts.
  socket.on('plotter:join', function () {
    socket.join('plotter');
    socket.data.isPlotter = true;
    console.log('Plotter page connected');
  });

  // A phone sent a prompt. `reply` is a function that sends an answer back to
  // that phone, which uses it to change the text on its Submit button.
  socket.on('prompt:submit', function (message, reply) {
    let text = '';
    if (message != null) {
      text = cleanText(message.text);
    }
    if (text == '') {
      reply({ ok: false, reason: 'empty' });
      return;
    }

    let plotterPages = io.sockets.adapter.rooms.get('plotter');
    if (plotterPages == undefined || plotterPages.size == 0) {
      console.log('Got a prompt, but no plotter page is connected');
      reply({ ok: false, reason: 'no-plotter' });
      return;
    }

    let id = nextPromptId;
    nextPromptId = nextPromptId + 1;

    io.to('plotter').emit('prompt:new', { id: id, text: text });
    console.log('Prompt ' + id + ' sent to the plotter: "' + text + '"');
    reply({ ok: true, id: id });
  });

  socket.on('disconnect', function () {
    if (socket.data.isPlotter) {
      console.log('Plotter page disconnected');
    }
  });
});

server.listen(port, function () {
  console.log('Vacant lots demo running:');
  console.log('  plotter page: http://localhost:' + port + '/plotter/');
  console.log('  prompt page:  http://localhost:' + port + '/prompt/  (share this via ngrok)');
});
