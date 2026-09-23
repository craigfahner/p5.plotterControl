// a square p5 canvas where people draw a doodle and submit it.
//
// a doodle is a list of strokes. 
//
// points are stored as fractions of the drawing box
//
// a doodle sent to the server looks like this:
//   {
//     strokes: [
//       [ { x: 0.1, y: 0.2 }, { x: 0.15, y: 0.25 }, ... ],   // first stroke
//       [ { x: 0.5, y: 0.5 }, { x: 0.55, y: 0.6 }, ... ]     // second stroke
//     ]
//   }
//
// point sampling calibration: 0.02 = points must be at least 2% of the box size apart. higher number here means fewer points. lower resolution, better plotter performance.
let minPointDistance = 0.02;

// the most points one doodle can have
let maxPoints = 800;

let socket;
let strokes = [];
let currentStroke = null; // the stroke being drawn right now, or null if the finger is up
let pointCount = 0;
let submitted = false;

let clearButton;
let submitButton;

function setup() {
  // fill the screen width, leaving room for 16px of page padding and a 1px border
  // on each side, but never bigger than 480px.
  let size = min(windowWidth - 34, 480);
  let canvas = createCanvas(size, size);
  canvas.parent('sketch');

  // connect to the server via socket.io library
  socket = io();

  clearButton = select('#clear');
  submitButton = select('#submit');
  clearButton.mousePressed(clearDoodle);
  submitButton.mousePressed(submitDoodle);
}

function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(1);

  for (let i = 0; i < strokes.length; i++) { // display all strokes...
    let points = strokes[i]; // passes all the points for a given stroke into a new array called points

    beginShape();
    for (let j = 0; j < points.length; j++) { // for each stroke, build a shape with vertices
      let pt = points[j]; 
      vertex(pt.x * width, pt.y * height);
    }
    endShape();
  }
}


function isInsideCanvas() { // checking to see if the touch/click is within the bounds
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    return true;
  } else {
    return false;
  }
}

function startStroke() {
  if (submitted) {
    return;
  }
  if (isInsideCanvas() == false) {
    return;
  }
  if (pointCount >= maxPoints) {
    return;
  }

  let firstPoint = {
    x: mouseX / width,
    y: mouseY / height
  };
  currentStroke = [firstPoint]; 
  strokes.push(currentStroke); // push the current stroke, which we just started, into the strokes array
  pointCount = pointCount + 1; // start counting how many vertices make up the stroke
}

function continueStroke() {
  if (currentStroke == null) {
    return;
  }
  if (pointCount >= maxPoints) { // if there are too many strokes, return
    return;
  }

  // constrain() keeps the point inside the box if the finger slides off the edge.
  let newPoint = {
    x: constrain(mouseX / width, 0, 1),
    y: constrain(mouseY / height, 0, 1)
  };

  let lastPoint = currentStroke[currentStroke.length - 1];
  if (dist(newPoint.x, newPoint.y, lastPoint.x, lastPoint.y) < minPointDistance) { // is the new vertex too close to the previous one? if so, return
    return;
  }

  currentStroke.push(newPoint); // add the new vertex
  pointCount = pointCount + 1;
}

function endStroke() {
  // always keep the point where the finger lifted, so minPointDistance
  // never cuts off the end of a stroke.
  if (currentStroke != null) {
    let endPoint = {
      x: constrain(mouseX / width, 0, 1),
      y: constrain(mouseY / height, 0, 1)
    };
    let lastPoint = currentStroke[currentStroke.length - 1];
    if (endPoint.x != lastPoint.x || endPoint.y != lastPoint.y) {
      currentStroke.push(endPoint);
      pointCount = pointCount + 1;
    }
  }

  // throw away "taps", only keep real lines with a beginning and end point
  if (currentStroke != null && currentStroke.length < 2) {
    strokes.pop();
    pointCount = pointCount - 1;
  }
  currentStroke = null;
}

function mousePressed() {
  startStroke();
}

function mouseDragged() {
  continueStroke();
}

function mouseReleased() {
  endStroke();
}

// on phones, returning false from a touch function stops the page from scrolling
// or zooming while someone draws. touches outside the canvas return true, so the
// buttons still work.
function touchStarted() {
  startStroke();
  if (isInsideCanvas()) {
    return false;
  } else {
    return true;
  }
}

function touchMoved() {
  continueStroke();
  if (currentStroke != null) {
    return false;
  } else {
    return true;
  }
}

function touchEnded() {
  endStroke();
}

// button stuff below:

function clearDoodle() {
  strokes = [];
  currentStroke = null;
  pointCount = 0;
  submitted = false;
  submitButton.html('Submit');
  submitButton.removeAttribute('disabled');
}

function submitDoodle() {
  if (submitted) {
    return;
  }
  if (strokes.length == 0) {
    return;
  }

  submitted = true;
  submitButton.html('Sending…');
  submitButton.attribute('disabled', '');

  let doodle = {
    strokes: strokes
  };
  // the server calls handleServerReply() once it has received the doodle.
  socket.emit('doodle:submit', doodle, handleServerReply);
}

function handleServerReply(reply) {
  if (reply.ok) {
    submitButton.html('Plotting…');
    return;
  }

  // something went wrong. Let them try again without clearing the drawing
  submitted = false;
  submitButton.removeAttribute('disabled');
  if (reply.reason == 'no-plotter') {
    submitButton.html('Plotter offline, retry');
  } else {
    submitButton.html('Retry');
  }
}
