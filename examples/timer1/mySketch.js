let plotter;

function setup() {
  //plotter = new GPlotter(594, 841, 500); //A1 size
  plotter = new GPlotter(210, 297, 500, false); // creates a GPlotter object that is A4 sized (210mm x 297mm), with an on-screen width of 500px
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
  setInterval(randomCircles, 1000); // run randomCircles function every second
}

function draw() {
  background(225);
  stroke(0);
  // note – don't put any plotted shapes directly in draw (unless nested in discrete logic/timing events)!
  // Plotter functions called elsewhere will display on the canvas thanks to the display() method below:
  plotter.display();
}

function randomCircles() {
    let randomDiameter = random(5, 40);
    let randomX = Math.floor(
      random(width),
    );
    let randomY = Math.floor(
      random(height),
    );
    plotter.circle(randomX, randomY, randomDiameter, false);
}

// these mouse events are being passed into the plotter object to enable the "Demo Mode" – feel free to put your own mouse events alongside these handlers:
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (plotter.demoMode) {
      plotter.handleDemoMousePressed(mouseX, mouseY);
      
    }
        let randomDiameter = random(10, width / 2);
    let randomX = Math.floor(
      random(width),
    );
    let randomY = Math.floor(
      random(height),
    );
    plotter.circle(randomX, randomY, randomDiameter, false);
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
