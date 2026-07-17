// infinischotter
// a time-based version of Georg Nees' "Schotter"
// draws one shape at a time once every 2 seconds using a millis() based timer
// when the drawing is done, it generates a new schotter rendering overtop of the old one forever
// craig fahner july 2026

let plotter;

// schotter variables
let maxCols = 12;
let margins = 200;
let maxRows = 20;
let currentCol = 0;
let currentRow = 0;
let finishedDrawing = false;
let squareSize = 25;

// UI variables
let startButton;
let stopButton;

// timing variables
let prevMillis = 0;
let timerOn = false;
let interval = 2000;

function setup() {
  //plotter = new GPlotter(594, 841, 500); //A1 size
  plotter = new GPlotter(210, 297, 500, true); // creates a GPlotter object that is A4 sized (210mm x 297mm), with an on-screen width of 500px
  createCanvas(plotter.screenWidth, plotter.canvasHeight);

  // UI for starting and stopping the timer
  let startButton = createButton("start sequence");
  startButton.position(10, height + 10);
  startButton.mousePressed(startTimer);

  let stopButton = createButton("stop sequence");
  stopButton.position(120, height + 10);
  stopButton.mousePressed(stopTimer);
}

function draw() {
  background(225);
  stroke(0);
 

  // here is an example of a permissible draw()-embedded plotting function
  // the draw loop continuously checks the millis() based "stopwatch" to see if the interval has passed
  // if it has, we draw the shape and reset the timer, so that, on the next frame, we are again waiting
  // so, the drawSchotterShape function only is called for a single frame - a "one-shot"
  if(timerOn){
    if(millis()>prevMillis+interval){ //
      drawSchotterShape(); // draw the shape
      prevMillis = millis(); // reset the timer, so that on the next frame, we are waiting again
    }
  }

   plotter.display();
}

function startTimer(){
  prevMillis = millis();
  timerOn = true;
}

function stopTimer(){
  timerOn = false;
}

function drawSchotterShape() {
  let x = margins / 2 + currentCol * squareSize;
  let y = margins / 2 + currentRow * squareSize;

  let rotateIntensity = map(currentRow, 0, maxRows, 0, 90);
  let randomRotate = random(-rotateIntensity, rotateIntensity);

  let translateIntensity = map(currentRow, 0, maxRows, 0, squareSize);
  let randomTranslateX = random(-translateIntensity, translateIntensity);
  let randomTranslateY = random(-translateIntensity, translateIntensity);

  let centerX = x + randomTranslateX;
  let centerY = y + randomTranslateY;

  plotter.rectangle(
    centerX,
    centerY,
    squareSize,
    squareSize,
    false,
    randomRotate,
  );

  currentRow++;
  if (currentRow >= maxRows) {
    currentRow = 0;
    currentCol++;
    if (currentCol > maxCols) {
      currentCol = 0;
      currentRow = 0;
    }
  }
}

// these mouse events are being passed into the plotter object to enable the "Demo Mode" – feel free to put your own mouse events alongside these handlers:
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (plotter.demoMode) {
      plotter.handleDemoMousePressed(mouseX, mouseY);
    }
    let randomDiameter = random(10, width / 2);
    let randomX = Math.floor(random(width));
    let randomY = Math.floor(random(height));
  }
}

function mouseDragged() {
  if (plotter.demoMode) {
    plotter.handleDemoMouseDragged(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (plotter.demoMode) {
    plotter.handleDemoMouseReleased(mouseX, mouseY);
  }
}
