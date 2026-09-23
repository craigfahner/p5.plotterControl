// Relay server for the doodle demo.
//
//   phones (/draw)  --doodle:submit-->  server  --doodle:new-->  plotter page (/plotter)
//
// The server doesn't need to queue anything: GPlotter already queues plotter
// commands in the plotter page and sends them to the plotter one at a time.
// This just serves the two web pages and passes doodles along.
//
// Run:   npm install
//        npm start
// Then:  open http://localhost:3000/plotter in Chrome on this computer (Web Serial
//        only works on localhost or https), and point the QR code at your ngrok
//        URL (`ngrok http 3000`), which opens the drawing page.

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

let port = 3000;

// Limits on incoming doodles, so one huge doodle can't tie up the plotter.
let maxStrokes = 50;
let maxPoints = 800;

let app = express();
let server = http.createServer(app);
let io = new socketIO.Server(server);

// Serve everything in the public folder (the drawing page and the plotter page).
app.use(express.static(path.join(__dirname, 'public')));

// Serve gplotter.js from the main project folder, so the demo always uses the
// current version of the library.
app.get('/lib/gplotter.js', function (request, response) {
  response.sendFile(path.join(__dirname, '..', 'gplotter.js'));
});

// Send visitors to the drawing page, so the QR code can use the plain URL.
app.get('/', function (request, response) {
  response.redirect('/draw/');
});

// Returns true if value is a number between 0 and 1.
function isValidCoordinate(value) {
  if (typeof value != 'number') {
    return false;
  }
  if (value >= 0 && value <= 1) {
    return true;
  } else {
    return false;
  }
}

// Checks a doodle sent from a phone and returns a cleaned-up copy containing
// only valid points, or null if there's nothing left to plot.
// A doodle looks like: { strokes: [ [ { x: 0.1, y: 0.2 }, ... ], ... ] }
function cleanDoodle(doodle) {
  if (doodle == null || Array.isArray(doodle.strokes) == false) {
    return null;
  }

  let cleanStrokes = [];
  let totalPoints = 0;

  for (let i = 0; i < doodle.strokes.length && i < maxStrokes; i++) {
    let points = doodle.strokes[i];
    if (Array.isArray(points) == false) {
      continue;
    }

    let cleanPoints = [];
    for (let j = 0; j < points.length && totalPoints < maxPoints; j++) {
      let pt = points[j];
      if (pt != null && isValidCoordinate(pt.x) && isValidCoordinate(pt.y)) {
        cleanPoints.push({ x: pt.x, y: pt.y });
        totalPoints = totalPoints + 1;
      }
    }

    // A stroke needs at least two points to make a line.
    if (cleanPoints.length >= 2) {
      cleanStrokes.push(cleanPoints);
    }
  }

  if (cleanStrokes.length == 0) {
    return null;
  }
  return { strokes: cleanStrokes };
}

let nextDoodleId = 1;

io.on('connection', function (socket) {

  // The plotter page sends this when it connects, so we know where to send doodles.
  socket.on('plotter:join', function () {
    socket.join('plotter');
    socket.data.isPlotter = true;
    console.log('Plotter page connected');
  });

  // A phone sent a doodle. `reply` is a function that sends an answer back to
  // that phone, which uses it to change the text on its Submit button.
  socket.on('doodle:submit', function (doodle, reply) {
    let cleaned = cleanDoodle(doodle);
    if (cleaned == null) {
      reply({ ok: false, reason: 'empty' });
      return;
    }

    let plotterPages = io.sockets.adapter.rooms.get('plotter');
    if (plotterPages == undefined || plotterPages.size == 0) {
      console.log('Got a doodle, but no plotter page is connected');
      reply({ ok: false, reason: 'no-plotter' });
      return;
    }

    let id = nextDoodleId;
    nextDoodleId = nextDoodleId + 1;

    io.to('plotter').emit('doodle:new', { id: id, strokes: cleaned.strokes });
    console.log('Doodle ' + id + ' sent to the plotter (' + cleaned.strokes.length + ' strokes)');
    reply({ ok: true, id: id });
  });

  socket.on('disconnect', function () {
    if (socket.data.isPlotter) {
      console.log('Plotter page disconnected');
    }
  });
});

server.listen(port, function () {
  console.log('Doodle demo running:');
  console.log('  plotter page: http://localhost:' + port + '/plotter/');
  console.log('  drawing page: http://localhost:' + port + '/draw/  (share this via ngrok)');
});
