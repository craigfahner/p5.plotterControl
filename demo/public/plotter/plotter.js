// open http://localhost:3000/plotter/ in Chrome, on the computer the plotter is plugged into. connect and enable plotting BEFORE sharing the QR
// code - doodles that arrive while plotting is off only appear on screen (in grey).
//
// each doodle that arrives is scaled into the next empty cell of a grid (set by
// columns and rows below), centered on an A4 page. each stroke is drawn with beginShape() and endShape(),
// so the pen goes down once per stroke instead of once per line segment.
//
// keys:  n = new page (clears the screen and starts the grid again from the top left)

// grid layout:
// how many doodles fit on one page
// for example, 6 columns x 8 rows fits 48 doodles.
let columns = 6;
let rows = 8;

// Page size and spacing, in mm.
let pageWidth = 210;
let pageHeight = 297;
let pageMargin = 15;  // the smallest gap allowed between the grid and the page edge
let cellPadding = 4;  // the gap between a doodle and the edge of its cell

let cellSize;  // the width (and height) of one square cell
let gridLeft;  // where the grid starts, measured from the left edge of the page
let gridTop;   // where the grid starts, measured from the top edge of the page

let plotter;
let socket;
let nextCell = 0;       // which cell the next doodle goes in (0 is the top left)
let droppedCount = 0;   // doodles that arrived after the grid was full

function setup() {
  plotter = new GPlotter(pageWidth, pageHeight, 500); // A4 page, 500px wide on screen
  createCanvas(plotter.screenWidth, plotter.canvasHeight);

  // calculate max grid size within the margins
  let cellWidth = (pageWidth - 2 * pageMargin) / columns;
  let cellHeight = (pageHeight - 2 * pageMargin) / rows;
  cellSize = min(cellWidth, cellHeight);

  // center the grid
  gridLeft = (pageWidth - columns * cellSize) / 2;
  gridTop = (pageHeight - rows * cellSize) / 2;

  // connect to server
  socket = io();
  socket.on('connect', joinAsPlotter);
  socket.on('doodle:new', plotDoodle);
}

// tells the server that this page is the plotter, so it sends doodles here.
function joinAsPlotter() {
  socket.emit('plotter:join');
}

function draw() {
  background(225);
  //drawGridGuides(); // shows the cells where doodles will go as p5 shapes (not plotted)
  stroke(0);
  plotter.display();
}

// GPlotter's shape functions work in pixels, so this converts mm on the page to
// pixels on the canvas.
function mmToPixels(mm) {
  return mm / plotter.pixelToMMRatio;
}

// called by socket.io each time the server sends a new doodle.
function plotDoodle(doodle) {
  let totalCells = columns * rows;
  if (nextCell >= totalCells) {
    droppedCount = droppedCount + 1;
    console.log('The grid is full, so doodle ' + doodle.id + ' was not plotted. Press "n" for a new page.'); // if we have no more room, send a message to console
    return;
  }

  // Work out which column and row the next cell is in, filling each row
  // from left to right, then moving down to the next row.
  let column = nextCell % columns; // modulo to the rescue!
  let row = floor(nextCell / columns); // how many full rows come before this cell

  // The square the doodle will fill, in pixels: its top left corner and its size.
  let boxX = mmToPixels(gridLeft + column * cellSize + cellPadding);
  let boxY = mmToPixels(gridTop + row * cellSize + cellPadding);
  let boxSize = mmToPixels(cellSize - 2 * cellPadding);

  for (let i = 0; i < doodle.strokes.length; i++) {
    let points = doodle.strokes[i];

    plotter.beginShape();
    for (let j = 0; j < points.length; j++) {
      let pt = points[j]; // not called "point", because p5 already has a point() function
      // Points arrive as fractions of the phone's drawing box (0 to 1),
      // so scale them to fit inside this cell!
      let x = boxX + pt.x * boxSize;
      let y = boxY + pt.y * boxSize;
      plotter.vertex(x, y);
    }
    plotter.endShape();
  }

  nextCell = nextCell + 1;
  console.log('Doodle ' + doodle.id + ' placed in cell ' + nextCell + ' of ' + totalCells);
}

// Optional: draw faint cell outlines and a doodle counter
// these use regular p5 functions, not plotter functions, so they are never plotted
function drawGridGuides() {
  push();
  noFill();
  stroke(200);
  strokeWeight(1);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      let x = mmToPixels(gridLeft + column * cellSize);
      let y = mmToPixels(gridTop + row * cellSize);
      rect(x, y, mmToPixels(cellSize), mmToPixels(cellSize));
    }
  }

  noStroke();
  fill(120);
  textSize(12);
  let status = nextCell + ' / ' + columns * rows + ' doodles';
  if (droppedCount > 0) {
    status = status + '  (' + droppedCount + ' dropped, grid full - press "n")';
  }
  text(status, 10, height - 10);
  pop();
}

function keyPressed() {
  if (key == 'n') {
    // This only clears the screen and the grid position.
    // Swap the paper before any new doodles arrive!
    plotter.drawnShapes = [];
    nextCell = 0;
    droppedCount = 0;
  }
}
