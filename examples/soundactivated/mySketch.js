let plotter;

// sound related vars
let mic, micLevel;
let sampleCount = 0;
let audioSum = 0;

// vars related to drawing sound graphs
let xStep = 3; //how horizontally far each point is plotted from the last point
let yStep = 30; //how vertically far each row is from the other rows
let maxWaveHeight = 100; //max height of each audio row. Make this value less than the yStep if you don't want the waves to intersect each other
let numSamples = 3; //how many audio samples are taken to average the audio signal. Take more samples for a slower, more real-time plot
let xMargin = 50; //how close the plot gets to the sides of the page
let yStart = 120; //how far down the first row starts

let lastX;
let lastY;
let yCurrRow;

let graphing = false;

//UI elements
let startButton, stopButton;

function setup() {
  //plotter = new GPlotter(594, 841, 500); //A1 size
  plotter = new GPlotter(210, 297, 500, false); // creates a GPlotter object that is A4 sized (210mm x 297mm), with an on-screen width of 500px
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
  // initialize the audio input
  mic = new p5.AudioIn();
  mic.start();
  micLevel = 0;
  // set initial values for sound graphs
  lastX = xMargin;
  lastY = yStart;
  yCurrRow = yStart;

  // UI for starting and stopping the graphing behavior
  let startButton = createButton("start graphing");
  startButton.position(10, height + 10);
  startButton.mousePressed(startGraph);

  let stopButton = createButton("stop graphing");
  stopButton.position(120, height + 10);
  stopButton.mousePressed(stopGraph);
}

function draw() {
  background(225);
  stroke(0);
  if (graphing) {
    micLevel = mic.getLevel();
    sampleCount += 1;
    audioSum += micLevel;
    if (sampleCount == numSamples) {
      if (lastX == xMargin) {
        plotter.startFreeDraw(lastX, lastY);
      }
      averageMicLevel = audioSum / numSamples;
      let newX = lastX + xStep;
      let mapVal = Math.floor(
        map(averageMicLevel, 0, 0.1, 0, maxWaveHeight, true),
      );
      if(mapVal<10){
        mapVal = 0;
      }
      let newY = yCurrRow - mapVal;
      console.log(lastX, lastY, newX, newY);
      plotter.freeDrawTo(newX, newY);
      sampleCount = 0; //reset the count
      audioSum = 0; //reset for the next set of samples to average
      lastX = newX;
      lastY = newY;

      //if we're at the end of a row, go to the next row
      if (newX + xStep + xMargin >= width) {
        plotter.endFreeDraw();
        lastX = xMargin; //restart at the beginning
        yCurrRow += yStep;
        // if we're at the bottom of the page, go backto the top
        if (yCurrRow >= height) {
          yCurrRow = yStart;
        }
        lastY = yCurrRow;
      }
    }
  }

  // note – don't put any plotted shapes directly in draw (unless nested in discrete logic/timing events)!
  // Plotter functions called elsewhere will display on the canvas thanks to the display() method below:
  plotter.display();
}

function startGraph() {
  graphing = true;
}

function stopGraph() {
  graphing = false;
}

// these mouse events are being passed into the plotter object to enable the "Demo Mode" – feel free to put your own mouse events alongside these handlers:
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (plotter.demoMode) {
      plotter.handleDemoMousePressed(mouseX, mouseY);
    }
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
