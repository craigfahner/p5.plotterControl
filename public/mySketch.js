// Introduction:
// This code initializes a GPlotter instance to create a canvas for drawing shapes 
// and generating G-code for a physical plotter device if connected.
//
// For detailed examples demonstrating how to draw different shapes (circle, line, rectangle, arc, etc.),
// check out the "examples" folder in the project directory.
//
// Available Shapes:
// - Circle:        plotter.circle(x, y, diameter, fill);
// - Line:          plotter.line(x1, y1, x2, y2, angle);
// - Rectangle:     plotter.rectangle(x, y, width, height, fill, angle);
// - Arc:           plotter.arc(x, y, width, height, startAngle, stopAngle, angle);
// - Ellipse:       plotter.ellipse(x, y, width, height, fill, angle);
// - Point:         plotter.point(x, y);
// - Custom Shape:  plotter.beginShape(); plotter.vertex(x, y); plotter.curveVertex(x, y); plotter.endShape(CLOSE, fill);
// - Text:          let commands = plotter.pathCommandsForText(hershey.futural, "Hello Plotter!", offsetX, offsetY, scale);
//                  plotter.drawHersheyText(commands);
//
// Remember to call `plotter.display()` in the `draw()` function to visualize the shapes.
//
// Explore the "examples" folder for more comprehensive usage!

let plotter;
let hershey;

function preload() {
  hershey = loadJSON("hersheytext.json");
}

function setup() {
  plotter = new GPlotter(594, 841, 500, false); 
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
}

function draw() {
    background(225);
    plotter.display(); // Display drawn shapes
}
