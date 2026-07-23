// To use the library, create an instance of the GPlotter class in setup - plotter = new GPlotter(...
// The constructor takes the following arguments: plotter page width (in mm), plotter page height (in mm), on-screen pixel width
// Make sure that the first two arguments – plotter page width and height – conform to the actual plotter hardware you have:
//
// A4: 210mm x 297mm
// A3: 297mm x 420mm
// A2: 420mm x 594mm
// A1: 594mm x 841mm
// A0: 841mm x 1189mm
//
// Important: Don't call plotter shape functions unconditionally in draw().
// Since draw() runs every frame, an unguarded call fires dozens of times per second.
// It's fine to call them from within draw() as long as the call is gated by discrete, one-shot logic
// (a timer, a flag, an event check) that lets it through exactly once — not on every frame.
// Otherwise, you may want to call plotter shape functions on discrete p5.js event functions like mousePressed, keyPressed, etc.
// See the included examples for more details.
//
// Available Shapes:
// - Circle:        plotter.circle(x, y, diameter, fill);
// - Line:          plotter.line(x1, y1, x2, y2, angle);
// - Rectangle:     plotter.rectangle(x, y, width, height, fill, angle);
// - Arc:           plotter.arc(x, y, width, height, startAngle, stopAngle, angle);
// - Ellipse:       plotter.ellipse(x, y, width, height, fill, angle);
// - Point:         plotter.point(x, y);
// - Custom Shape:  plotter.beginShape(); plotter.vertex(x, y); plotter.curveVertex(x, y); plotter.endShape(CLOSE, fill);
// - Text:          plotter.drawString(text, x, y, scale);
//
// the "Demo Mode" included in the UI when you launch index.html will demonstrate most of the above shape functions in real time.
//
// Remember to call plotter.display() in the draw() function to visualize your drawing on-screen.
//
// ---- PLOTTING ----
//
// Zero your plotter before launching index.html by moving the pen carriage to the top right corner
// Ensure that your plotter is connected via USB
// After launching index.html in Chrome, click "Connect" to select your plotter's serial port and initiate the connection
// You may set up margins by adjusting the values in the UI, as well as changing the feed rate, Z-depth (how far the pen moves downwards) and fill gap (the spacing between fill lines - a larger gap means sparser fill).
// Shapes you draw always appear on the on-screen canvas. Once "Plotting Enabled" is checked, they will also be sent to the plotter as G-code.
//
// by Craig Fahner, Nora Liu and Alissa Kushner 2023-2026

let noiseX, noiseY;
let noiseSpeed = 0.01;
let xPos;
let yPos;

let plotter;

function setup() {
  //plotter = new GPlotter(594, 841, 500); //A1 size
  plotter = new GPlotter(210, 297, 500); // creates a GPlotter object that is A4 sized (210mm x 297mm), with an on-screen width of 500px
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
  noiseX = random(1000);
  noiseY = random(1000);
}

function draw() {
  background(225);
  stroke(0);

  if (keyIsDown(74)) {
    console.log("keydown");
    xPos = noise(noiseX) * (width / 2) + width / 4;
    yPos = noise(noiseY) * (height / 2) + height / 4;

    plotter.freeDrawTo(xPos, yPos);


    noiseX += noiseSpeed;
    noiseY += noiseSpeed;
  }

  // note – don't put any plotted shapes directly in draw (unless nested in discrete logic/timing events)!
  // Plotter functions called elsewhere will display on the canvas thanks to the display() method below:
  plotter.display();
}

function keyPressed() {
  console.log(keyCode);
  if (key == "j") {
    xPos = noise(noiseX) * (width / 2) + width / 4;
    yPos = noise(noiseY) * (height / 2) + height / 4;
    plotter.startFreeDraw(xPos,yPos);
  }
}

function keyReleased() {
  if(key == "j"){
    plotter.endFreeDraw();
  }
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
