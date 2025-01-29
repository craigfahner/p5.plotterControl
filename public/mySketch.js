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

function keyPressed(){
    //plotter.circle(width/2,height/2,50);
     if(keyCode === ENTER){
         drawMarbling();
     }
}

function drawMarbling(){
// Layer 1
// Splat 1
// Layer 1
// Splat 1
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 2
plotter.beginShape();
plotter.vertex(26.33, 434.88);
plotter.vertex(26.42, 436.83);
plotter.vertex(26.36, 438.77);
plotter.vertex(26.13, 440.68);
plotter.vertex(25.76, 442.58);
plotter.vertex(25.22, 444.46);
plotter.vertex(24.54, 446.34);
plotter.vertex(23.70, 448.21);
plotter.vertex(22.71, 450.08);
plotter.vertex(21.58, 451.96);
plotter.vertex(20.30, 453.85);
plotter.vertex(18.89, 455.75);
plotter.vertex(17.35, 457.68);
plotter.vertex(15.68, 459.64);
plotter.vertex(13.90, 461.63);
plotter.vertex(12.01, 463.67);
plotter.vertex(10.02, 465.76);
plotter.vertex(7.94, 467.90);
plotter.vertex(5.79, 470.11);
plotter.vertex(3.58, 472.38);
plotter.vertex(1.31, 474.72);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(2.10, 396.65);
plotter.vertex(4.61, 399.20);
plotter.vertex(6.99, 401.71);
plotter.vertex(9.26, 404.18);
plotter.vertex(11.39, 406.61);
plotter.vertex(13.40, 409.00);
plotter.vertex(15.27, 411.35);
plotter.vertex(17.00, 413.67);
plotter.vertex(18.60, 415.94);
plotter.vertex(20.05, 418.18);
plotter.vertex(21.36, 420.39);
plotter.vertex(22.53, 422.55);
plotter.vertex(23.54, 424.69);
plotter.vertex(24.41, 426.79);
plotter.vertex(25.12, 428.85);
plotter.vertex(25.68, 430.89);
plotter.vertex(26.08, 432.90);
plotter.vertex(26.33, 434.88);
plotter.endShape();

// Splat 3
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 4
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(0.84, 840.56);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 5
plotter.beginShape();
plotter.vertex(243.53, 623.09);
plotter.vertex(243.95, 625.96);
plotter.vertex(244.28, 628.81);
plotter.vertex(244.53, 631.61);
plotter.vertex(244.68, 634.39);
plotter.vertex(244.75, 637.13);
plotter.vertex(244.72, 639.84);
plotter.vertex(244.60, 642.53);
plotter.vertex(244.38, 645.19);
plotter.vertex(244.08, 647.82);
plotter.vertex(243.67, 650.43);
plotter.vertex(243.18, 653.02);
plotter.vertex(242.59, 655.60);
plotter.vertex(241.91, 658.16);
plotter.vertex(241.14, 660.70);
plotter.vertex(240.28, 663.23);
plotter.vertex(239.34, 665.75);
plotter.vertex(238.32, 668.26);
plotter.vertex(237.22, 670.76);
plotter.vertex(236.04, 673.25);
plotter.vertex(234.79, 675.73);
plotter.vertex(233.47, 678.19);
plotter.vertex(232.08, 680.65);
plotter.vertex(230.62, 683.08);
plotter.vertex(229.11, 685.51);
plotter.vertex(227.53, 687.91);
plotter.vertex(225.91, 690.29);
plotter.vertex(224.23, 692.65);
plotter.vertex(222.50, 694.98);
plotter.vertex(220.73, 697.28);
plotter.vertex(218.91, 699.55);
plotter.vertex(217.05, 701.78);
plotter.vertex(215.15, 703.96);
plotter.vertex(213.21, 706.11);
plotter.vertex(211.24, 708.20);
plotter.vertex(209.23, 710.24);
plotter.vertex(207.19, 712.22);
plotter.vertex(205.11, 714.14);
plotter.vertex(203.01, 716.00);
plotter.vertex(200.87, 717.79);
plotter.vertex(198.70, 719.51);
plotter.vertex(196.51, 721.16);
plotter.vertex(194.28, 722.73);
plotter.vertex(192.03, 724.23);
plotter.vertex(189.74, 725.64);
plotter.vertex(187.43, 726.98);
plotter.vertex(185.09, 728.22);
plotter.vertex(182.73, 729.39);
plotter.vertex(180.33, 730.46);
plotter.vertex(177.91, 731.45);
plotter.vertex(175.47, 732.35);
plotter.vertex(173.00, 733.17);
plotter.vertex(170.50, 733.89);
plotter.vertex(167.98, 734.52);
plotter.vertex(165.43, 735.06);
plotter.vertex(162.86, 735.51);
plotter.vertex(160.27, 735.88);
plotter.vertex(157.66, 736.15);
plotter.vertex(155.03, 736.33);
plotter.vertex(152.37, 736.42);
plotter.vertex(149.70, 736.43);
plotter.vertex(147.01, 736.34);
plotter.vertex(144.31, 736.17);
plotter.vertex(141.59, 735.91);
plotter.vertex(138.85, 735.57);
plotter.vertex(136.11, 735.14);
plotter.vertex(133.35, 734.63);
plotter.vertex(130.59, 734.03);
plotter.vertex(127.81, 733.35);
plotter.vertex(125.03, 732.59);
plotter.vertex(122.25, 731.75);
plotter.vertex(119.46, 730.84);
plotter.vertex(116.68, 729.84);
plotter.vertex(113.89, 728.76);
plotter.vertex(111.11, 727.61);
plotter.vertex(108.33, 726.39);
plotter.vertex(105.55, 725.09);
plotter.vertex(102.78, 723.71);
plotter.vertex(100.03, 722.27);
plotter.vertex(97.28, 720.76);
plotter.vertex(94.54, 719.18);
plotter.vertex(91.82, 717.53);
plotter.vertex(89.12, 715.81);
plotter.vertex(86.44, 714.03);
plotter.vertex(83.77, 712.19);
plotter.vertex(81.12, 710.28);
plotter.vertex(78.50, 708.31);
plotter.vertex(75.90, 706.28);
plotter.vertex(73.33, 704.20);
plotter.vertex(70.79, 702.06);
plotter.vertex(68.28, 699.86);
plotter.vertex(65.79, 697.61);
plotter.vertex(63.35, 695.31);
plotter.vertex(60.93, 692.95);
plotter.vertex(58.55, 690.55);
plotter.vertex(56.21, 688.10);
plotter.vertex(53.91, 685.61);
plotter.vertex(51.64, 683.07);
plotter.vertex(49.42, 680.48);
plotter.vertex(47.24, 677.86);
plotter.vertex(45.11, 675.19);
plotter.vertex(43.02, 672.49);
plotter.vertex(40.98, 669.75);
plotter.vertex(38.99, 666.98);
plotter.vertex(37.04, 664.18);
plotter.vertex(35.15, 661.34);
plotter.vertex(33.31, 658.48);
plotter.vertex(31.52, 655.58);
plotter.vertex(29.78, 652.67);
plotter.vertex(28.10, 649.73);
plotter.vertex(26.48, 646.76);
plotter.vertex(24.91, 643.78);
plotter.vertex(23.40, 640.78);
plotter.vertex(21.95, 637.76);
plotter.vertex(20.56, 634.73);
plotter.vertex(19.23, 631.69);
plotter.vertex(17.96, 628.64);
plotter.vertex(16.76, 625.58);
plotter.vertex(15.61, 622.51);
plotter.vertex(14.53, 619.44);
plotter.vertex(13.51, 616.36);
plotter.vertex(12.56, 613.29);
plotter.vertex(11.67, 610.22);
plotter.vertex(10.85, 607.15);
plotter.vertex(10.10, 604.09);
plotter.vertex(9.41, 601.03);
plotter.vertex(8.79, 597.99);
plotter.vertex(8.23, 594.95);
plotter.vertex(7.75, 591.94);
plotter.vertex(7.33, 588.93);
plotter.vertex(6.98, 585.95);
plotter.vertex(6.70, 582.98);
plotter.vertex(6.49, 580.04);
plotter.vertex(6.35, 577.12);
plotter.vertex(6.28, 574.23);
plotter.vertex(6.28, 571.36);
plotter.vertex(6.35, 568.53);
plotter.vertex(6.49, 565.72);
plotter.vertex(6.69, 562.96);
plotter.vertex(6.97, 560.22);
plotter.vertex(7.32, 557.53);
plotter.vertex(7.74, 554.87);
plotter.vertex(8.23, 552.25);
plotter.vertex(8.80, 549.68);
plotter.vertex(9.43, 547.15);
plotter.vertex(10.13, 544.67);
plotter.vertex(10.90, 542.24);
plotter.vertex(11.74, 539.86);
plotter.vertex(12.65, 537.52);
plotter.vertex(13.64, 535.25);
plotter.vertex(14.69, 533.02);
plotter.vertex(15.81, 530.85);
plotter.vertex(17.00, 528.74);
plotter.vertex(18.26, 526.69);
plotter.vertex(19.59, 524.70);
plotter.vertex(20.99, 522.76);
plotter.vertex(22.45, 520.89);
plotter.vertex(23.99, 519.09);
plotter.vertex(25.59, 517.34);
plotter.vertex(27.26, 515.66);
plotter.vertex(28.99, 514.05);
plotter.vertex(30.79, 512.50);
plotter.vertex(32.66, 511.02);
plotter.vertex(34.60, 509.61);
plotter.vertex(36.60, 508.27);
plotter.vertex(38.66, 506.99);
plotter.vertex(40.79, 505.78);
plotter.vertex(42.98, 504.64);
plotter.vertex(45.23, 503.57);
plotter.vertex(47.55, 502.57);
plotter.vertex(49.92, 501.63);
plotter.vertex(52.36, 500.76);
plotter.vertex(54.85, 499.96);
plotter.vertex(57.41, 499.23);
plotter.vertex(60.02, 498.56);
plotter.vertex(62.68, 497.95);
plotter.vertex(65.40, 497.41);
plotter.vertex(68.17, 496.94);
plotter.vertex(70.99, 496.52);
plotter.vertex(73.86, 496.17);
plotter.vertex(76.78, 495.87);
plotter.vertex(79.74, 495.63);
plotter.vertex(82.75, 495.45);
plotter.vertex(85.79, 495.32);
plotter.vertex(88.88, 495.24);
plotter.vertex(92.00, 495.22);
plotter.vertex(95.15, 495.24);
plotter.vertex(98.33, 495.32);
plotter.vertex(101.54, 495.43);
plotter.vertex(104.77, 495.59);
plotter.vertex(108.03, 495.79);
plotter.vertex(111.29, 496.04);
plotter.vertex(114.57, 496.32);
plotter.vertex(117.86, 496.64);
plotter.vertex(121.14, 496.99);
plotter.vertex(124.43, 497.38);
plotter.vertex(127.71, 497.81);
plotter.vertex(130.99, 498.26);
plotter.vertex(134.24, 498.76);
plotter.vertex(137.48, 499.28);
plotter.vertex(140.70, 499.84);
plotter.vertex(143.89, 500.44);
plotter.vertex(147.04, 501.07);
plotter.vertex(150.16, 501.73);
plotter.vertex(153.24, 502.44);
plotter.vertex(156.28, 503.19);
plotter.vertex(159.27, 503.98);
plotter.vertex(162.20, 504.81);
plotter.vertex(165.09, 505.70);
plotter.vertex(167.92, 506.64);
plotter.vertex(170.68, 507.63);
plotter.vertex(173.39, 508.68);
plotter.vertex(176.04, 509.79);
plotter.vertex(178.62, 510.97);
plotter.vertex(181.14, 512.21);
plotter.vertex(183.60, 513.53);
plotter.vertex(185.99, 514.92);
plotter.vertex(188.31, 516.40);
plotter.vertex(190.57, 517.95);
plotter.vertex(192.77, 519.59);
plotter.vertex(194.91, 521.31);
plotter.vertex(196.99, 523.13);
plotter.vertex(199.01, 525.03);
plotter.vertex(200.98, 527.03);
plotter.vertex(202.89, 529.11);
plotter.vertex(204.75, 531.29);
plotter.vertex(206.56, 533.56);
plotter.vertex(208.33, 535.92);
plotter.vertex(210.05, 538.37);
plotter.vertex(211.74, 540.90);
plotter.vertex(213.38, 543.52);
plotter.vertex(214.99, 546.21);
plotter.vertex(216.56, 548.98);
plotter.vertex(218.10, 551.82);
plotter.vertex(219.61, 554.73);
plotter.vertex(221.10, 557.70);
plotter.vertex(222.55, 560.72);
plotter.vertex(223.98, 563.78);
plotter.vertex(225.37, 566.89);
plotter.vertex(226.74, 570.04);
plotter.vertex(228.08, 573.21);
plotter.vertex(229.39, 576.40);
plotter.vertex(230.67, 579.60);
plotter.vertex(231.91, 582.82);
plotter.vertex(233.12, 586.03);
plotter.vertex(234.29, 589.25);
plotter.vertex(235.41, 592.45);
plotter.vertex(236.49, 595.64);
plotter.vertex(237.52, 598.80);
plotter.vertex(238.50, 601.95);
plotter.vertex(239.42, 605.07);
plotter.vertex(240.28, 608.16);
plotter.vertex(241.08, 611.21);
plotter.vertex(241.80, 614.23);
plotter.vertex(242.46, 617.22);
plotter.vertex(243.03, 620.17);
plotter.vertex(243.53, 623.09);
plotter.endShape();

// Splat 6
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(592.26, 227.02);
plotter.vertex(569.84, 224.30);
plotter.vertex(549.39, 222.68);
plotter.vertex(531.17, 221.91);
plotter.vertex(515.17, 221.73);
plotter.vertex(501.25, 221.92);
plotter.vertex(489.19, 222.29);
plotter.vertex(478.75, 222.75);
plotter.vertex(469.69, 223.22);
plotter.vertex(461.83, 223.66);
plotter.vertex(454.98, 224.05);
plotter.vertex(448.99, 224.39);
plotter.vertex(443.76, 224.68);
plotter.vertex(439.17, 224.91);
plotter.vertex(435.17, 225.10);
plotter.vertex(431.68, 225.24);
plotter.vertex(428.66, 225.34);
plotter.vertex(426.08, 225.41);
plotter.vertex(423.91, 225.44);
plotter.vertex(422.13, 225.44);
plotter.vertex(420.75, 225.40);
plotter.vertex(419.76, 225.33);
plotter.vertex(419.19, 225.23);
plotter.vertex(419.05, 225.09);
plotter.vertex(419.40, 224.91);
plotter.vertex(420.30, 224.70);
plotter.vertex(421.83, 224.45);
plotter.vertex(424.14, 224.16);
plotter.vertex(427.44, 223.84);
plotter.vertex(432.09, 223.48);
plotter.vertex(438.72, 223.06);
plotter.vertex(448.61, 222.54);
plotter.vertex(464.78, 221.78);
plotter.vertex(496.41, 220.72);
plotter.vertex(581.06, 224.69);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 7
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(521.05, 220.55);
plotter.vertex(480.17, 220.99);
plotter.vertex(457.28, 221.79);
plotter.vertex(442.30, 222.32);
plotter.vertex(431.30, 222.71);
plotter.vertex(422.52, 223.08);
plotter.vertex(415.08, 223.51);
plotter.vertex(408.47, 224.06);
plotter.vertex(402.40, 224.77);
plotter.vertex(396.66, 225.68);
plotter.vertex(391.13, 226.81);
plotter.vertex(385.70, 228.19);
plotter.vertex(380.31, 229.85);
plotter.vertex(374.89, 231.80);
plotter.vertex(369.42, 234.07);
plotter.vertex(363.87, 236.67);
plotter.vertex(358.22, 239.60);
plotter.vertex(352.46, 242.88);
plotter.vertex(346.60, 246.49);
plotter.vertex(340.64, 250.43);
plotter.vertex(334.61, 254.69);
plotter.vertex(328.52, 259.24);
plotter.vertex(322.40, 264.05);
plotter.vertex(316.28, 269.09);
plotter.vertex(310.20, 274.31);
plotter.vertex(304.16, 279.69);
plotter.vertex(298.21, 285.17);
plotter.vertex(292.37, 290.70);
plotter.vertex(286.64, 296.26);
plotter.vertex(281.06, 301.79);
plotter.vertex(275.62, 307.26);
plotter.vertex(270.32, 312.63);
plotter.vertex(265.18, 317.89);
plotter.vertex(260.18, 322.99);
plotter.vertex(255.33, 327.92);
plotter.vertex(250.61, 332.67);
plotter.vertex(246.02, 337.21);
plotter.vertex(241.54, 341.55);
plotter.vertex(237.16, 345.67);
plotter.vertex(232.88, 349.56);
plotter.vertex(228.69, 353.24);
plotter.vertex(224.57, 356.69);
plotter.vertex(220.52, 359.93);
plotter.vertex(216.53, 362.94);
plotter.vertex(212.58, 365.74);
plotter.vertex(208.68, 368.33);
plotter.vertex(204.82, 370.71);
plotter.vertex(200.99, 372.89);
plotter.vertex(197.19, 374.87);
plotter.vertex(193.41, 376.66);
plotter.vertex(189.65, 378.26);
plotter.vertex(185.91, 379.69);
plotter.vertex(182.19, 380.93);
plotter.vertex(178.48, 382.01);
plotter.vertex(174.79, 382.92);
plotter.vertex(171.11, 383.67);
plotter.vertex(167.44, 384.26);
plotter.vertex(163.78, 384.70);
plotter.vertex(160.13, 385.00);
plotter.vertex(156.50, 385.15);
plotter.vertex(152.87, 385.16);
plotter.vertex(149.26, 385.04);
plotter.vertex(145.67, 384.79);
plotter.vertex(142.09, 384.41);
plotter.vertex(138.52, 383.91);
plotter.vertex(134.97, 383.29);
plotter.vertex(131.44, 382.56);
plotter.vertex(127.93, 381.71);
plotter.vertex(124.44, 380.76);
plotter.vertex(120.97, 379.70);
plotter.vertex(117.52, 378.54);
plotter.vertex(114.09, 377.28);
plotter.vertex(110.69, 375.93);
plotter.vertex(107.31, 374.48);
plotter.vertex(103.96, 372.95);
plotter.vertex(100.63, 371.34);
plotter.vertex(97.34, 369.64);
plotter.vertex(94.07, 367.87);
plotter.vertex(90.84, 366.02);
plotter.vertex(87.63, 364.10);
plotter.vertex(84.46, 362.11);
plotter.vertex(81.31, 360.05);
plotter.vertex(78.20, 357.94);
plotter.vertex(75.13, 355.76);
plotter.vertex(72.09, 353.53);
plotter.vertex(69.08, 351.24);
plotter.vertex(66.10, 348.91);
plotter.vertex(63.16, 346.53);
plotter.vertex(60.26, 344.10);
plotter.vertex(57.38, 341.64);
plotter.vertex(54.55, 339.13);
plotter.vertex(51.74, 336.60);
plotter.vertex(48.97, 334.03);
plotter.vertex(46.23, 331.43);
plotter.vertex(43.52, 328.80);
plotter.vertex(40.84, 326.15);
plotter.vertex(38.20, 323.48);
plotter.vertex(35.58, 320.79);
plotter.vertex(32.99, 318.08);
plotter.vertex(30.42, 315.36);
plotter.vertex(27.88, 312.63);
plotter.vertex(25.36, 309.89);
plotter.vertex(22.86, 307.14);
plotter.vertex(20.37, 304.38);
plotter.vertex(17.90, 301.62);
plotter.vertex(15.45, 298.86);
plotter.vertex(13.00, 296.09);
plotter.vertex(10.55, 293.32);
plotter.vertex(8.10, 290.55);
plotter.vertex(5.65, 287.77);
plotter.vertex(3.19, 284.99);
plotter.vertex(0.72, 282.20);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 8
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(329.17, 6.20);
plotter.vertex(324.85, 13.22);
plotter.vertex(320.44, 20.41);
plotter.vertex(315.96, 27.74);
plotter.vertex(311.45, 35.20);
plotter.vertex(306.91, 42.78);
plotter.vertex(302.36, 50.44);
plotter.vertex(297.82, 58.16);
plotter.vertex(293.30, 65.92);
plotter.vertex(288.80, 73.69);
plotter.vertex(284.32, 81.44);
plotter.vertex(279.88, 89.15);
plotter.vertex(275.45, 96.80);
plotter.vertex(271.04, 104.36);
plotter.vertex(266.64, 111.83);
plotter.vertex(262.23, 119.17);
plotter.vertex(257.81, 126.39);
plotter.vertex(253.37, 133.47);
plotter.vertex(248.89, 140.40);
plotter.vertex(244.38, 147.18);
plotter.vertex(239.81, 153.80);
plotter.vertex(235.20, 160.26);
plotter.vertex(230.53, 166.56);
plotter.vertex(225.79, 172.70);
plotter.vertex(221.00, 178.67);
plotter.vertex(216.15, 184.48);
plotter.vertex(211.25, 190.12);
plotter.vertex(206.29, 195.58);
plotter.vertex(201.28, 200.88);
plotter.vertex(196.23, 206.00);
plotter.vertex(191.14, 210.95);
plotter.vertex(186.01, 215.72);
plotter.vertex(180.85, 220.31);
plotter.vertex(175.67, 224.71);
plotter.vertex(170.47, 228.93);
plotter.vertex(165.25, 232.97);
plotter.vertex(160.02, 236.81);
plotter.vertex(154.78, 240.47);
plotter.vertex(149.53, 243.93);
plotter.vertex(144.28, 247.21);
plotter.vertex(139.03, 250.29);
plotter.vertex(133.79, 253.17);
plotter.vertex(128.55, 255.87);
plotter.vertex(123.31, 258.37);
plotter.vertex(118.09, 260.67);
plotter.vertex(112.87, 262.78);
plotter.vertex(107.66, 264.70);
plotter.vertex(102.47, 266.43);
plotter.vertex(97.29, 267.97);
plotter.vertex(92.12, 269.31);
plotter.vertex(86.97, 270.47);
plotter.vertex(81.84, 271.44);
plotter.vertex(76.72, 272.22);
plotter.vertex(71.62, 272.81);
plotter.vertex(66.55, 273.22);
plotter.vertex(61.49, 273.45);
plotter.vertex(56.46, 273.50);
plotter.vertex(51.46, 273.36);
plotter.vertex(46.48, 273.05);
plotter.vertex(41.53, 272.56);
plotter.vertex(36.61, 271.90);
plotter.vertex(31.72, 271.06);
plotter.vertex(26.87, 270.05);
plotter.vertex(22.06, 268.87);
plotter.vertex(17.28, 267.52);
plotter.vertex(12.55, 266.00);
plotter.vertex(7.86, 264.32);
plotter.vertex(3.22, 262.48);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 9
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(586.42, 726.53);
plotter.vertex(568.19, 728.15);
plotter.vertex(549.10, 728.59);
plotter.vertex(529.50, 727.68);
plotter.vertex(509.81, 725.35);
plotter.vertex(490.48, 721.62);
plotter.vertex(471.90, 716.65);
plotter.vertex(454.36, 710.64);
plotter.vertex(438.08, 703.84);
plotter.vertex(423.16, 696.51);
plotter.vertex(409.60, 688.89);
plotter.vertex(397.37, 681.16);
plotter.vertex(386.35, 673.47);
plotter.vertex(376.45, 665.92);
plotter.vertex(367.53, 658.58);
plotter.vertex(359.49, 651.48);
plotter.vertex(352.19, 644.64);
plotter.vertex(345.56, 638.05);
plotter.vertex(339.50, 631.71);
plotter.vertex(333.94, 625.59);
plotter.vertex(328.82, 619.67);
plotter.vertex(324.08, 613.93);
plotter.vertex(319.67, 608.34);
plotter.vertex(315.57, 602.88);
plotter.vertex(311.74, 597.53);
plotter.vertex(308.15, 592.26);
plotter.vertex(304.79, 587.07);
plotter.vertex(301.63, 581.92);
plotter.vertex(298.66, 576.82);
plotter.vertex(295.88, 571.75);
plotter.vertex(293.26, 566.69);
plotter.vertex(290.81, 561.64);
plotter.vertex(288.51, 556.59);
plotter.vertex(286.37, 551.53);
plotter.vertex(284.37, 546.46);
plotter.vertex(282.51, 541.38);
plotter.vertex(280.79, 536.28);
plotter.vertex(279.21, 531.15);
plotter.vertex(277.77, 526.01);
plotter.vertex(276.46, 520.84);
plotter.vertex(275.28, 515.64);
plotter.vertex(274.24, 510.42);
plotter.vertex(273.32, 505.18);
plotter.vertex(272.54, 499.91);
plotter.vertex(271.89, 494.62);
plotter.vertex(271.37, 489.32);
plotter.vertex(270.98, 483.99);
plotter.vertex(270.72, 478.65);
plotter.vertex(270.60, 473.29);
plotter.vertex(270.60, 467.92);
plotter.vertex(270.73, 462.54);
plotter.vertex(271.00, 457.16);
plotter.vertex(271.39, 451.77);
plotter.vertex(271.92, 446.38);
plotter.vertex(272.58, 440.99);
plotter.vertex(273.36, 435.61);
plotter.vertex(274.28, 430.24);
plotter.vertex(275.32, 424.88);
plotter.vertex(276.50, 419.53);
plotter.vertex(277.80, 414.21);
plotter.vertex(279.24, 408.90);
plotter.vertex(280.80, 403.62);
plotter.vertex(282.49, 398.37);
plotter.vertex(284.31, 393.15);
plotter.vertex(286.25, 387.96);
plotter.vertex(288.32, 382.82);
plotter.vertex(290.51, 377.72);
plotter.vertex(292.83, 372.66);
plotter.vertex(295.28, 367.66);
plotter.vertex(297.85, 362.70);
plotter.vertex(300.54, 357.81);
plotter.vertex(303.35, 352.97);
plotter.vertex(306.28, 348.20);
plotter.vertex(309.34, 343.49);
plotter.vertex(312.52, 338.85);
plotter.vertex(315.82, 334.29);
plotter.vertex(319.24, 329.79);
plotter.vertex(322.79, 325.38);
plotter.vertex(326.47, 321.04);
plotter.vertex(330.27, 316.78);
plotter.vertex(334.20, 312.60);
plotter.vertex(338.27, 308.51);
plotter.vertex(342.48, 304.49);
plotter.vertex(346.83, 300.56);
plotter.vertex(351.34, 296.71);
plotter.vertex(356.02, 292.94);
plotter.vertex(360.87, 289.25);
plotter.vertex(365.91, 285.64);
plotter.vertex(371.17, 282.09);
plotter.vertex(376.64, 278.62);
plotter.vertex(382.37, 275.22);
plotter.vertex(388.38, 271.88);
plotter.vertex(394.70, 268.59);
plotter.vertex(401.37, 265.37);
plotter.vertex(408.43, 262.20);
plotter.vertex(415.92, 259.09);
plotter.vertex(423.90, 256.04);
plotter.vertex(432.44, 253.06);
plotter.vertex(441.58, 250.17);
plotter.vertex(451.39, 247.40);
plotter.vertex(461.93, 244.78);
plotter.vertex(473.26, 242.37);
plotter.vertex(485.41, 240.23);
plotter.vertex(498.41, 238.44);
plotter.vertex(512.23, 237.10);
plotter.vertex(526.83, 236.29);
plotter.vertex(542.11, 236.12);
plotter.vertex(557.89, 236.65);
plotter.vertex(574.00, 237.92);
plotter.vertex(590.18, 239.94);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 10
plotter.beginShape();
plotter.vertex(234.41, 0.39);
plotter.vertex(233.59, 3.92);
plotter.vertex(232.69, 7.48);
plotter.vertex(231.71, 11.06);
plotter.vertex(230.66, 14.66);
plotter.vertex(229.53, 18.28);
plotter.vertex(228.33, 21.92);
plotter.vertex(227.06, 25.58);
plotter.vertex(225.72, 29.25);
plotter.vertex(224.31, 32.92);
plotter.vertex(222.84, 36.61);
plotter.vertex(221.30, 40.29);
plotter.vertex(219.71, 43.98);
plotter.vertex(218.06, 47.67);
plotter.vertex(216.35, 51.34);
plotter.vertex(214.58, 55.01);
plotter.vertex(212.77, 58.66);
plotter.vertex(210.90, 62.30);
plotter.vertex(208.98, 65.92);
plotter.vertex(207.01, 69.51);
plotter.vertex(205.00, 73.08);
plotter.vertex(202.94, 76.62);
plotter.vertex(200.83, 80.12);
plotter.vertex(198.68, 83.59);
plotter.vertex(196.49, 87.02);
plotter.vertex(194.26, 90.41);
plotter.vertex(191.99, 93.75);
plotter.vertex(189.68, 97.05);
plotter.vertex(187.33, 100.29);
plotter.vertex(184.94, 103.48);
plotter.vertex(182.52, 106.62);
plotter.vertex(180.06, 109.70);
plotter.vertex(177.57, 112.72);
plotter.vertex(175.04, 115.68);
plotter.vertex(172.48, 118.57);
plotter.vertex(169.89, 121.40);
plotter.vertex(167.27, 124.16);
plotter.vertex(164.62, 126.84);
plotter.vertex(161.94, 129.46);
plotter.vertex(159.23, 132.01);
plotter.vertex(156.50, 134.48);
plotter.vertex(153.74, 136.87);
plotter.vertex(150.95, 139.19);
plotter.vertex(148.15, 141.43);
plotter.vertex(145.32, 143.59);
plotter.vertex(142.47, 145.67);
plotter.vertex(139.60, 147.66);
plotter.vertex(136.71, 149.58);
plotter.vertex(133.81, 151.40);
plotter.vertex(130.88, 153.15);
plotter.vertex(127.95, 154.80);
plotter.vertex(125.00, 156.37);
plotter.vertex(122.04, 157.86);
plotter.vertex(119.07, 159.25);
plotter.vertex(116.09, 160.55);
plotter.vertex(113.11, 161.77);
plotter.vertex(110.12, 162.89);
plotter.vertex(107.12, 163.93);
plotter.vertex(104.12, 164.87);
plotter.vertex(101.12, 165.72);
plotter.vertex(98.12, 166.48);
plotter.vertex(95.12, 167.14);
plotter.vertex(92.13, 167.72);
plotter.vertex(89.14, 168.20);
plotter.vertex(86.15, 168.59);
plotter.vertex(83.17, 168.89);
plotter.vertex(80.21, 169.09);
plotter.vertex(77.25, 169.20);
plotter.vertex(74.31, 169.22);
plotter.vertex(71.38, 169.15);
plotter.vertex(68.47, 168.98);
plotter.vertex(65.57, 168.73);
plotter.vertex(62.69, 168.38);
plotter.vertex(59.83, 167.94);
plotter.vertex(57.00, 167.41);
plotter.vertex(54.19, 166.80);
plotter.vertex(51.40, 166.09);
plotter.vertex(48.64, 165.30);
plotter.vertex(45.91, 164.41);
plotter.vertex(43.21, 163.44);
plotter.vertex(40.54, 162.39);
plotter.vertex(37.91, 161.25);
plotter.vertex(35.31, 160.02);
plotter.vertex(32.74, 158.72);
plotter.vertex(30.22, 157.33);
plotter.vertex(27.73, 155.86);
plotter.vertex(25.28, 154.30);
plotter.vertex(22.88, 152.67);
plotter.vertex(20.52, 150.97);
plotter.vertex(18.20, 149.18);
plotter.vertex(15.93, 147.32);
plotter.vertex(13.71, 145.39);
plotter.vertex(11.54, 143.38);
plotter.vertex(9.42, 141.30);
plotter.vertex(7.35, 139.16);
plotter.vertex(5.33, 136.94);
plotter.vertex(3.37, 134.66);
plotter.vertex(1.47, 132.31);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(234.41, 0.39);
plotter.endShape();

// Splat 11
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(587.65, 225.37);
plotter.vertex(579.25, 224.29);
plotter.vertex(570.79, 223.33);
plotter.vertex(562.30, 222.50);
plotter.vertex(553.82, 221.80);
plotter.vertex(545.39, 221.24);
plotter.vertex(537.03, 220.80);
plotter.vertex(528.77, 220.49);
plotter.vertex(520.64, 220.29);
plotter.vertex(512.68, 220.18);
plotter.vertex(504.89, 220.16);
plotter.vertex(497.31, 220.20);
plotter.vertex(489.94, 220.29);
plotter.vertex(482.80, 220.41);
plotter.vertex(475.89, 220.53);
plotter.vertex(469.23, 220.65);
plotter.vertex(462.81, 220.74);
plotter.vertex(456.63, 220.79);
plotter.vertex(450.70, 220.79);
plotter.vertex(445.00, 220.72);
plotter.vertex(439.54, 220.57);
plotter.vertex(434.31, 220.33);
plotter.vertex(429.31, 219.99);
plotter.vertex(424.52, 219.55);
plotter.vertex(419.94, 219.00);
plotter.vertex(415.56, 218.33);
plotter.vertex(411.37, 217.54);
plotter.vertex(407.38, 216.63);
plotter.vertex(403.56, 215.60);
plotter.vertex(399.92, 214.44);
plotter.vertex(396.45, 213.17);
plotter.vertex(393.15, 211.77);
plotter.vertex(390.00, 210.24);
plotter.vertex(387.00, 208.60);
plotter.vertex(384.15, 206.84);
plotter.vertex(381.45, 204.96);
plotter.vertex(378.89, 202.97);
plotter.vertex(376.46, 200.87);
plotter.vertex(374.17, 198.66);
plotter.vertex(372.01, 196.35);
plotter.vertex(369.98, 193.93);
plotter.vertex(368.08, 191.42);
plotter.vertex(366.30, 188.81);
plotter.vertex(364.65, 186.11);
plotter.vertex(363.11, 183.32);
plotter.vertex(361.70, 180.45);
plotter.vertex(360.40, 177.50);
plotter.vertex(359.22, 174.47);
plotter.vertex(358.16, 171.36);
plotter.vertex(357.21, 168.19);
plotter.vertex(356.38, 164.95);
plotter.vertex(355.67, 161.65);
plotter.vertex(355.06, 158.29);
plotter.vertex(354.57, 154.87);
plotter.vertex(354.19, 151.40);
plotter.vertex(353.93, 147.89);
plotter.vertex(353.77, 144.33);
plotter.vertex(353.73, 140.72);
plotter.vertex(353.79, 137.08);
plotter.vertex(353.97, 133.41);
plotter.vertex(354.26, 129.70);
plotter.vertex(354.65, 125.97);
plotter.vertex(355.16, 122.21);
plotter.vertex(355.77, 118.43);
plotter.vertex(356.49, 114.63);
plotter.vertex(357.32, 110.82);
plotter.vertex(358.25, 106.99);
plotter.vertex(359.29, 103.16);
plotter.vertex(360.44, 99.33);
plotter.vertex(361.69, 95.49);
plotter.vertex(363.05, 91.65);
plotter.vertex(364.51, 87.82);
plotter.vertex(366.08, 84.00);
plotter.vertex(367.75, 80.19);
plotter.vertex(369.51, 76.39);
plotter.vertex(371.39, 72.60);
plotter.vertex(373.36, 68.84);
plotter.vertex(375.43, 65.10);
plotter.vertex(377.59, 61.38);
plotter.vertex(379.86, 57.70);
plotter.vertex(382.22, 54.04);
plotter.vertex(384.68, 50.42);
plotter.vertex(387.23, 46.83);
plotter.vertex(389.88, 43.28);
plotter.vertex(392.61, 39.78);
plotter.vertex(395.44, 36.32);
plotter.vertex(398.35, 32.90);
plotter.vertex(401.36, 29.54);
plotter.vertex(404.45, 26.22);
plotter.vertex(407.62, 22.96);
plotter.vertex(410.88, 19.76);
plotter.vertex(414.22, 16.61);
plotter.vertex(417.64, 13.53);
plotter.vertex(421.14, 10.51);
plotter.vertex(424.71, 7.55);
plotter.vertex(428.36, 4.66);
plotter.vertex(432.08, 1.84);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 12
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(274.52, 839.90);
plotter.vertex(274.49, 835.51);
plotter.vertex(274.55, 831.15);
plotter.vertex(274.73, 826.82);
plotter.vertex(275.00, 822.53);
plotter.vertex(275.39, 818.27);
plotter.vertex(275.87, 814.06);
plotter.vertex(276.46, 809.89);
plotter.vertex(277.15, 805.77);
plotter.vertex(277.94, 801.70);
plotter.vertex(278.83, 797.69);
plotter.vertex(279.82, 793.74);
plotter.vertex(280.90, 789.85);
plotter.vertex(282.09, 786.03);
plotter.vertex(283.37, 782.28);
plotter.vertex(284.75, 778.60);
plotter.vertex(286.23, 775.00);
plotter.vertex(287.80, 771.48);
plotter.vertex(289.46, 768.05);
plotter.vertex(291.22, 764.70);
plotter.vertex(293.07, 761.45);
plotter.vertex(295.01, 758.30);
plotter.vertex(297.04, 755.24);
plotter.vertex(299.17, 752.30);
plotter.vertex(301.38, 749.46);
plotter.vertex(303.69, 746.73);
plotter.vertex(306.08, 744.12);
plotter.vertex(308.57, 741.63);
plotter.vertex(311.15, 739.27);
plotter.vertex(313.83, 737.04);
plotter.vertex(316.59, 734.95);
plotter.vertex(319.45, 732.99);
plotter.vertex(322.41, 731.17);
plotter.vertex(325.47, 729.51);
plotter.vertex(328.63, 727.99);
plotter.vertex(331.90, 726.63);
plotter.vertex(335.27, 725.43);
plotter.vertex(338.76, 724.40);
plotter.vertex(342.37, 723.53);
plotter.vertex(346.10, 722.83);
plotter.vertex(349.96, 722.30);
plotter.vertex(353.95, 721.95);
plotter.vertex(358.09, 721.78);
plotter.vertex(362.39, 721.79);
plotter.vertex(366.84, 721.98);
plotter.vertex(371.47, 722.34);
plotter.vertex(376.28, 722.88);
plotter.vertex(381.29, 723.60);
plotter.vertex(386.49, 724.48);
plotter.vertex(391.92, 725.53);
plotter.vertex(397.57, 726.73);
plotter.vertex(403.46, 728.07);
plotter.vertex(409.59, 729.55);
plotter.vertex(415.99, 731.14);
plotter.vertex(422.64, 732.82);
plotter.vertex(429.56, 734.59);
plotter.vertex(436.75, 736.41);
plotter.vertex(444.21, 738.25);
plotter.vertex(451.92, 740.11);
plotter.vertex(459.87, 741.94);
plotter.vertex(468.05, 743.73);
plotter.vertex(476.44, 745.44);
plotter.vertex(485.01, 747.06);
plotter.vertex(493.72, 748.56);
plotter.vertex(502.54, 749.92);
plotter.vertex(511.42, 751.13);
plotter.vertex(520.33, 752.18);
plotter.vertex(529.22, 753.08);
plotter.vertex(538.05, 753.81);
plotter.vertex(546.77, 754.39);
plotter.vertex(555.35, 754.84);
plotter.vertex(563.74, 755.16);
plotter.vertex(571.93, 755.38);
plotter.vertex(579.87, 755.52);
plotter.vertex(587.56, 755.61);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 13
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(589.68, 711.91);
plotter.vertex(584.57, 712.82);
plotter.vertex(579.44, 713.62);
plotter.vertex(574.28, 714.30);
plotter.vertex(569.10, 714.86);
plotter.vertex(563.90, 715.31);
plotter.vertex(558.68, 715.64);
plotter.vertex(553.45, 715.85);
plotter.vertex(548.20, 715.94);
plotter.vertex(542.94, 715.91);
plotter.vertex(537.67, 715.76);
plotter.vertex(532.40, 715.48);
plotter.vertex(527.12, 715.09);
plotter.vertex(521.84, 714.58);
plotter.vertex(516.56, 713.94);
plotter.vertex(511.29, 713.18);
plotter.vertex(506.02, 712.29);
plotter.vertex(500.76, 711.28);
plotter.vertex(495.51, 710.15);
plotter.vertex(490.27, 708.89);
plotter.vertex(485.05, 707.51);
plotter.vertex(479.85, 706.00);
plotter.vertex(474.68, 704.36);
plotter.vertex(469.52, 702.60);
plotter.vertex(464.40, 700.71);
plotter.vertex(459.30, 698.69);
plotter.vertex(454.24, 696.54);
plotter.vertex(449.21, 694.27);
plotter.vertex(444.22, 691.87);
plotter.vertex(439.27, 689.35);
plotter.vertex(434.37, 686.69);
plotter.vertex(429.52, 683.91);
plotter.vertex(424.72, 680.99);
plotter.vertex(419.98, 677.95);
plotter.vertex(415.30, 674.79);
plotter.vertex(410.67, 671.49);
plotter.vertex(406.12, 668.07);
plotter.vertex(401.64, 664.53);
plotter.vertex(397.23, 660.85);
plotter.vertex(392.89, 657.06);
plotter.vertex(388.64, 653.13);
plotter.vertex(384.48, 649.09);
plotter.vertex(380.41, 644.92);
plotter.vertex(376.43, 640.64);
plotter.vertex(372.55, 636.24);
plotter.vertex(368.77, 631.72);
plotter.vertex(365.11, 627.08);
plotter.vertex(361.55, 622.34);
plotter.vertex(358.11, 617.48);
plotter.vertex(354.78, 612.52);
plotter.vertex(351.59, 607.45);
plotter.vertex(348.52, 602.28);
plotter.vertex(345.58, 597.02);
plotter.vertex(342.78, 591.66);
plotter.vertex(340.12, 586.21);
plotter.vertex(337.60, 580.68);
plotter.vertex(335.23, 575.06);
plotter.vertex(333.01, 569.37);
plotter.vertex(330.95, 563.60);
plotter.vertex(329.04, 557.77);
plotter.vertex(327.29, 551.88);
plotter.vertex(325.69, 545.92);
plotter.vertex(324.27, 539.92);
plotter.vertex(323.01, 533.86);
plotter.vertex(321.91, 527.76);
plotter.vertex(320.98, 521.63);
plotter.vertex(320.23, 515.46);
plotter.vertex(319.64, 509.27);
plotter.vertex(319.23, 503.06);
plotter.vertex(318.99, 496.82);
plotter.vertex(318.92, 490.58);
plotter.vertex(319.03, 484.33);
plotter.vertex(319.30, 478.08);
plotter.vertex(319.76, 471.84);
plotter.vertex(320.38, 465.60);
plotter.vertex(321.18, 459.38);
plotter.vertex(322.15, 453.17);
plotter.vertex(323.29, 446.99);
plotter.vertex(324.61, 440.84);
plotter.vertex(326.09, 434.72);
plotter.vertex(327.75, 428.64);
plotter.vertex(329.58, 422.59);
plotter.vertex(331.57, 416.60);
plotter.vertex(333.73, 410.66);
plotter.vertex(336.06, 404.77);
plotter.vertex(338.56, 398.95);
plotter.vertex(341.22, 393.19);
plotter.vertex(344.04, 387.50);
plotter.vertex(347.03, 381.89);
plotter.vertex(350.17, 376.37);
plotter.vertex(353.48, 370.93);
plotter.vertex(356.94, 365.58);
plotter.vertex(360.55, 360.33);
plotter.vertex(364.31, 355.18);
plotter.vertex(368.23, 350.14);
plotter.vertex(372.28, 345.22);
plotter.vertex(376.48, 340.42);
plotter.vertex(380.81, 335.74);
plotter.vertex(385.27, 331.19);
plotter.vertex(389.86, 326.78);
plotter.vertex(394.57, 322.50);
plotter.vertex(399.40, 318.38);
plotter.vertex(404.34, 314.40);
plotter.vertex(409.38, 310.57);
plotter.vertex(414.52, 306.90);
plotter.vertex(419.76, 303.39);
plotter.vertex(425.07, 300.05);
plotter.vertex(430.47, 296.86);
plotter.vertex(435.93, 293.85);
plotter.vertex(441.46, 291.00);
plotter.vertex(447.04, 288.32);
plotter.vertex(452.68, 285.81);
plotter.vertex(458.36, 283.47);
plotter.vertex(464.08, 281.30);
plotter.vertex(469.82, 279.29);
plotter.vertex(475.60, 277.46);
plotter.vertex(481.39, 275.79);
plotter.vertex(487.19, 274.28);
plotter.vertex(493.00, 272.94);
plotter.vertex(498.82, 271.75);
plotter.vertex(504.63, 270.73);
plotter.vertex(510.44, 269.86);
plotter.vertex(516.23, 269.15);
plotter.vertex(522.02, 268.59);
plotter.vertex(527.78, 268.18);
plotter.vertex(533.52, 267.91);
plotter.vertex(539.24, 267.79);
plotter.vertex(544.93, 267.81);
plotter.vertex(550.59, 267.97);
plotter.vertex(556.21, 268.26);
plotter.vertex(561.80, 268.69);
plotter.vertex(567.35, 269.25);
plotter.vertex(572.86, 269.94);
plotter.vertex(578.33, 270.75);
plotter.vertex(583.76, 271.70);
plotter.vertex(589.13, 272.76);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 14
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(592.64, 578.14);
plotter.vertex(589.13, 581.77);
plotter.vertex(585.33, 585.44);
plotter.vertex(581.21, 589.12);
plotter.vertex(576.72, 592.82);
plotter.vertex(571.83, 596.49);
plotter.vertex(566.51, 600.11);
plotter.vertex(560.73, 603.62);
plotter.vertex(554.46, 606.99);
plotter.vertex(547.66, 610.14);
plotter.vertex(540.35, 613.00);
plotter.vertex(532.51, 615.48);
plotter.vertex(524.18, 617.50);
plotter.vertex(515.40, 618.96);
plotter.vertex(506.26, 619.78);
plotter.vertex(496.85, 619.88);
plotter.vertex(487.30, 619.22);
plotter.vertex(477.75, 617.78);
plotter.vertex(468.34, 615.55);
plotter.vertex(459.21, 612.59);
plotter.vertex(450.49, 608.96);
plotter.vertex(442.28, 604.76);
plotter.vertex(434.64, 600.09);
plotter.vertex(427.63, 595.06);
plotter.vertex(421.25, 589.77);
plotter.vertex(415.50, 584.33);
plotter.vertex(410.35, 578.80);
plotter.vertex(405.77, 573.27);
plotter.vertex(401.71, 567.78);
plotter.vertex(398.12, 562.37);
plotter.vertex(394.97, 557.07);
plotter.vertex(392.19, 551.91);
plotter.vertex(389.76, 546.88);
plotter.vertex(387.62, 542.01);
plotter.vertex(385.75, 537.28);
plotter.vertex(384.11, 532.70);
plotter.vertex(382.68, 528.26);
plotter.vertex(381.42, 523.96);
plotter.vertex(380.33, 519.79);
plotter.vertex(379.38, 515.74);
plotter.vertex(378.55, 511.81);
plotter.vertex(377.84, 507.98);
plotter.vertex(377.23, 504.25);
plotter.vertex(376.71, 500.62);
plotter.vertex(376.27, 497.07);
plotter.vertex(375.91, 493.60);
plotter.vertex(375.62, 490.20);
plotter.vertex(375.39, 486.87);
plotter.vertex(375.22, 483.59);
plotter.vertex(375.10, 480.38);
plotter.vertex(375.04, 477.22);
plotter.vertex(375.03, 474.11);
plotter.vertex(375.07, 471.04);
plotter.vertex(375.15, 468.02);
plotter.vertex(375.28, 465.03);
plotter.vertex(375.45, 462.08);
plotter.vertex(375.66, 459.17);
plotter.vertex(375.92, 456.28);
plotter.vertex(376.22, 453.43);
plotter.vertex(376.55, 450.60);
plotter.vertex(376.93, 447.80);
plotter.vertex(377.35, 445.03);
plotter.vertex(377.80, 442.28);
plotter.vertex(378.30, 439.55);
plotter.vertex(378.83, 436.85);
plotter.vertex(379.41, 434.16);
plotter.vertex(380.02, 431.50);
plotter.vertex(380.68, 428.86);
plotter.vertex(381.37, 426.24);
plotter.vertex(382.11, 423.64);
plotter.vertex(382.88, 421.06);
plotter.vertex(383.70, 418.49);
plotter.vertex(384.55, 415.95);
plotter.vertex(385.45, 413.43);
plotter.vertex(386.38, 410.93);
plotter.vertex(387.36, 408.45);
plotter.vertex(388.38, 405.99);
plotter.vertex(389.44, 403.56);
plotter.vertex(390.54, 401.14);
plotter.vertex(391.68, 398.75);
plotter.vertex(392.86, 396.38);
plotter.vertex(394.08, 394.03);
plotter.vertex(395.34, 391.71);
plotter.vertex(396.65, 389.41);
plotter.vertex(397.99, 387.14);
plotter.vertex(399.37, 384.89);
plotter.vertex(400.80, 382.67);
plotter.vertex(402.26, 380.48);
plotter.vertex(403.77, 378.32);
plotter.vertex(405.31, 376.18);
plotter.vertex(406.90, 374.08);
plotter.vertex(408.52, 372.00);
plotter.vertex(410.18, 369.96);
plotter.vertex(411.88, 367.95);
plotter.vertex(413.62, 365.97);
plotter.vertex(415.40, 364.02);
plotter.vertex(417.21, 362.11);
plotter.vertex(419.06, 360.24);
plotter.vertex(420.95, 358.40);
plotter.vertex(422.87, 356.60);
plotter.vertex(424.83, 354.83);
plotter.vertex(426.82, 353.10);
plotter.vertex(428.85, 351.42);
plotter.vertex(430.91, 349.77);
plotter.vertex(433.00, 348.16);
plotter.vertex(435.12, 346.60);
plotter.vertex(437.28, 345.08);
plotter.vertex(439.46, 343.60);
plotter.vertex(441.67, 342.16);
plotter.vertex(443.92, 340.77);
plotter.vertex(446.19, 339.42);
plotter.vertex(448.49, 338.12);
plotter.vertex(450.81, 336.87);
plotter.vertex(453.16, 335.66);
plotter.vertex(455.54, 334.50);
plotter.vertex(457.94, 333.39);
plotter.vertex(460.36, 332.32);
plotter.vertex(462.80, 331.31);
plotter.vertex(465.26, 330.35);
plotter.vertex(467.74, 329.43);
plotter.vertex(470.25, 328.57);
plotter.vertex(472.77, 327.76);
plotter.vertex(475.30, 327.00);
plotter.vertex(477.85, 326.29);
plotter.vertex(480.42, 325.64);
plotter.vertex(483.00, 325.04);
plotter.vertex(485.59, 324.49);
plotter.vertex(488.19, 323.99);
plotter.vertex(490.80, 323.55);
plotter.vertex(493.43, 323.16);
plotter.vertex(496.06, 322.83);
plotter.vertex(498.69, 322.55);
plotter.vertex(501.33, 322.33);
plotter.vertex(503.98, 322.16);
plotter.vertex(506.63, 322.05);
plotter.vertex(509.28, 321.99);
plotter.vertex(511.93, 321.99);
plotter.vertex(514.58, 322.04);
plotter.vertex(517.23, 322.15);
plotter.vertex(519.88, 322.31);
plotter.vertex(522.53, 322.52);
plotter.vertex(525.16, 322.80);
plotter.vertex(527.80, 323.12);
plotter.vertex(530.42, 323.51);
plotter.vertex(533.04, 323.94);
plotter.vertex(535.65, 324.43);
plotter.vertex(538.24, 324.98);
plotter.vertex(540.83, 325.58);
plotter.vertex(543.40, 326.23);
plotter.vertex(545.96, 326.94);
plotter.vertex(548.50, 327.70);
plotter.vertex(551.02, 328.51);
plotter.vertex(553.53, 329.38);
plotter.vertex(556.02, 330.29);
plotter.vertex(558.49, 331.26);
plotter.vertex(560.94, 332.28);
plotter.vertex(563.36, 333.35);
plotter.vertex(565.77, 334.47);
plotter.vertex(568.15, 335.64);
plotter.vertex(570.50, 336.86);
plotter.vertex(572.83, 338.13);
plotter.vertex(575.13, 339.44);
plotter.vertex(577.40, 340.81);
plotter.vertex(579.65, 342.22);
plotter.vertex(581.86, 343.67);
plotter.vertex(584.05, 345.17);
plotter.vertex(586.20, 346.72);
plotter.vertex(588.32, 348.30);
plotter.vertex(590.40, 349.93);
plotter.vertex(592.45, 351.61);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Splat 15
plotter.beginShape();
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.vertex(593.42, 565.34);
plotter.vertex(591.93, 567.63);
plotter.vertex(590.39, 569.88);
plotter.vertex(588.79, 572.09);
plotter.vertex(587.14, 574.27);
plotter.vertex(585.43, 576.40);
plotter.vertex(583.67, 578.49);
plotter.vertex(581.86, 580.53);
plotter.vertex(580.00, 582.53);
plotter.vertex(578.09, 584.49);
plotter.vertex(576.14, 586.40);
plotter.vertex(574.14, 588.26);
plotter.vertex(572.09, 590.07);
plotter.vertex(570.00, 591.82);
plotter.vertex(567.87, 593.53);
plotter.vertex(565.70, 595.18);
plotter.vertex(563.48, 596.78);
plotter.vertex(561.23, 598.33);
plotter.vertex(558.94, 599.82);
plotter.vertex(556.62, 601.25);
plotter.vertex(554.26, 602.63);
plotter.vertex(551.86, 603.94);
plotter.vertex(549.44, 605.20);
plotter.vertex(546.98, 606.40);
plotter.vertex(544.50, 607.54);
plotter.vertex(541.99, 608.61);
plotter.vertex(539.45, 609.63);
plotter.vertex(536.89, 610.58);
plotter.vertex(534.31, 611.47);
plotter.vertex(531.71, 612.29);
plotter.vertex(529.08, 613.05);
plotter.vertex(526.44, 613.75);
plotter.vertex(523.79, 614.38);
plotter.vertex(521.11, 614.95);
plotter.vertex(518.43, 615.45);
plotter.vertex(515.73, 615.88);
plotter.vertex(513.03, 616.25);
plotter.vertex(510.31, 616.55);
plotter.vertex(507.59, 616.78);
plotter.vertex(504.86, 616.95);
plotter.vertex(502.13, 617.05);
plotter.vertex(499.40, 617.09);
plotter.vertex(496.67, 617.05);
plotter.vertex(493.94, 616.95);
plotter.vertex(491.22, 616.78);
plotter.vertex(488.49, 616.55);
plotter.vertex(485.78, 616.25);
plotter.vertex(483.07, 615.88);
plotter.vertex(480.38, 615.45);
plotter.vertex(477.69, 614.95);
plotter.vertex(475.02, 614.38);
plotter.vertex(472.36, 613.75);
plotter.vertex(469.72, 613.05);
plotter.vertex(467.10, 612.29);
plotter.vertex(464.49, 611.47);
plotter.vertex(461.91, 610.58);
plotter.vertex(459.35, 609.63);
plotter.vertex(456.81, 608.61);
plotter.vertex(454.30, 607.54);
plotter.vertex(451.82, 606.40);
plotter.vertex(449.37, 605.20);
plotter.vertex(446.94, 603.94);
plotter.vertex(444.55, 602.63);
plotter.vertex(442.19, 601.25);
plotter.vertex(439.86, 599.82);
plotter.vertex(437.57, 598.33);
plotter.vertex(435.32, 596.78);
plotter.vertex(433.11, 595.18);
plotter.vertex(430.93, 593.53);
plotter.vertex(428.80, 591.82);
plotter.vertex(426.71, 590.07);
plotter.vertex(424.67, 588.26);
plotter.vertex(422.67, 586.40);
plotter.vertex(420.71, 584.49);
plotter.vertex(418.80, 582.53);
plotter.vertex(416.94, 580.53);
plotter.vertex(415.13, 578.49);
plotter.vertex(413.38, 576.40);
plotter.vertex(411.67, 574.27);
plotter.vertex(410.02, 572.09);
plotter.vertex(408.42, 569.88);
plotter.vertex(406.87, 567.63);
plotter.vertex(405.38, 565.34);
plotter.vertex(403.95, 563.01);
plotter.vertex(402.57, 560.65);
plotter.vertex(401.26, 558.26);
plotter.vertex(400.00, 555.83);
plotter.vertex(398.80, 553.38);
plotter.vertex(397.66, 550.90);
plotter.vertex(396.59, 548.39);
plotter.vertex(395.57, 545.85);
plotter.vertex(394.62, 543.29);
plotter.vertex(393.73, 540.71);
plotter.vertex(392.91, 538.10);
plotter.vertex(392.15, 535.48);
plotter.vertex(391.45, 532.84);
plotter.vertex(390.82, 530.18);
plotter.vertex(390.25, 527.51);
plotter.vertex(389.75, 524.82);
plotter.vertex(389.32, 522.13);
plotter.vertex(388.95, 519.42);
plotter.vertex(388.65, 516.71);
plotter.vertex(388.42, 513.98);
plotter.vertex(388.25, 511.26);
plotter.vertex(388.15, 508.53);
plotter.vertex(388.11, 505.80);
plotter.vertex(388.15, 503.07);
plotter.vertex(388.25, 500.34);
plotter.vertex(388.42, 497.61);
plotter.vertex(388.65, 494.89);
plotter.vertex(388.95, 492.17);
plotter.vertex(389.32, 489.47);
plotter.vertex(389.75, 486.77);
plotter.vertex(390.25, 484.09);
plotter.vertex(390.82, 481.41);
plotter.vertex(391.45, 478.76);
plotter.vertex(392.15, 476.12);
plotter.vertex(392.91, 473.49);
plotter.vertex(393.73, 470.89);
plotter.vertex(394.62, 468.31);
plotter.vertex(395.57, 465.75);
plotter.vertex(396.59, 463.21);
plotter.vertex(397.66, 460.70);
plotter.vertex(398.80, 458.22);
plotter.vertex(400.00, 455.76);
plotter.vertex(401.26, 453.34);
plotter.vertex(402.57, 450.94);
plotter.vertex(403.95, 448.58);
plotter.vertex(405.38, 446.26);
plotter.vertex(406.87, 443.97);
plotter.vertex(408.42, 441.72);
plotter.vertex(410.02, 439.50);
plotter.vertex(411.67, 437.33);
plotter.vertex(413.38, 435.20);
plotter.vertex(415.13, 433.11);
plotter.vertex(416.94, 431.06);
plotter.vertex(418.80, 429.06);
plotter.vertex(420.71, 427.11);
plotter.vertex(422.67, 425.20);
plotter.vertex(424.67, 423.34);
plotter.vertex(426.71, 421.53);
plotter.vertex(428.80, 419.77);
plotter.vertex(430.93, 418.06);
plotter.vertex(433.11, 416.41);
plotter.vertex(435.32, 414.81);
plotter.vertex(437.57, 413.27);
plotter.vertex(439.86, 411.78);
plotter.vertex(442.19, 410.34);
plotter.vertex(444.55, 408.97);
plotter.vertex(446.94, 407.65);
plotter.vertex(449.37, 406.39);
plotter.vertex(451.82, 405.20);
plotter.vertex(454.30, 404.06);
plotter.vertex(456.81, 402.98);
plotter.vertex(459.35, 401.97);
plotter.vertex(461.91, 401.02);
plotter.vertex(464.49, 400.13);
plotter.vertex(467.10, 399.30);
plotter.vertex(469.72, 398.54);
plotter.vertex(472.36, 397.85);
plotter.vertex(475.02, 397.21);
plotter.vertex(477.69, 396.65);
plotter.vertex(480.38, 396.15);
plotter.vertex(483.07, 395.71);
plotter.vertex(485.78, 395.35);
plotter.vertex(488.49, 395.05);
plotter.vertex(491.22, 394.81);
plotter.vertex(493.94, 394.64);
plotter.vertex(496.67, 394.54);
plotter.vertex(499.40, 394.51);
plotter.vertex(502.13, 394.54);
plotter.vertex(504.86, 394.64);
plotter.vertex(507.59, 394.81);
plotter.vertex(510.31, 395.05);
plotter.vertex(513.03, 395.35);
plotter.vertex(515.73, 395.71);
plotter.vertex(518.43, 396.15);
plotter.vertex(521.11, 396.65);
plotter.vertex(523.79, 397.21);
plotter.vertex(526.44, 397.85);
plotter.vertex(529.08, 398.54);
plotter.vertex(531.71, 399.30);
plotter.vertex(534.31, 400.13);
plotter.vertex(536.89, 401.02);
plotter.vertex(539.45, 401.97);
plotter.vertex(541.99, 402.98);
plotter.vertex(544.50, 404.06);
plotter.vertex(546.98, 405.20);
plotter.vertex(549.44, 406.39);
plotter.vertex(551.86, 407.65);
plotter.vertex(554.26, 408.97);
plotter.vertex(556.62, 410.34);
plotter.vertex(558.94, 411.78);
plotter.vertex(561.23, 413.27);
plotter.vertex(563.48, 414.81);
plotter.vertex(565.70, 416.41);
plotter.vertex(567.87, 418.06);
plotter.vertex(570.00, 419.77);
plotter.vertex(572.09, 421.53);
plotter.vertex(574.14, 423.34);
plotter.vertex(576.14, 425.20);
plotter.vertex(578.09, 427.11);
plotter.vertex(580.00, 429.06);
plotter.vertex(581.86, 431.06);
plotter.vertex(583.67, 433.11);
plotter.vertex(585.43, 435.20);
plotter.vertex(587.14, 437.33);
plotter.vertex(588.79, 439.50);
plotter.vertex(590.39, 441.72);
plotter.vertex(591.93, 443.97);
plotter.vertex(593.42, 446.26);
plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

plotter.beginShape();

plotter.endShape();

// Layer 2
// Layer 3



}