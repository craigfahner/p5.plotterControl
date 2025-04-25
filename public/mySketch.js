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
//
// Remember to call `plotter.display()` in the `draw()` function to visualize the shapes.
//
// Explore the "examples" folder for more comprehensive usage!

let plotter;

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
}

function draw() {
    background(225);
    plotter.display(); // Display drawn shapes
}
