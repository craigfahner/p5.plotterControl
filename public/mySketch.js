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

function keyPressed() { // draw different shapes with random parameters with keys
    if (key === 'c') {
        let randomDiameter = random(10, width / 2);
        let randomX = Math.floor(random(randomDiameter / 2, width - (randomDiameter / 2)));
        let randomY = Math.floor(random(randomDiameter / 2, height - (randomDiameter / 2)));
        plotter.circle(randomX, randomY, randomDiameter, false);
        let randomX1 = random(width);
        let randomY1 = random(height);
        let randomX2 = random(width);
        let randomY2 = random(height)
        plotter.line(randomX1, randomY1, randomX2, randomY2, 0);
    } else if (key === 'l') {
        let randomX1 = random(width);
        let randomY1 = random(height);
        let randomX2 = random(width);
        let randomY2 = random(height)
        plotter.line(randomX1, randomY1, randomX2, randomY2, 0);
        plotter.line(randomX1, randomY1, randomX2, randomY2, 0);
        plotter.line(randomX1, randomY1, randomX2, randomY2, 0);
    } else if (key === 'r') {
        let randomW = random(10, width / 2);
        let randomH = random(10, height / 2);
        let randomX = random(width - randomW);
        let randomY = random(height - randomH);
        plotter.rectangle(randomX, randomY, randomW, randomH, false, 30); // apply a 30 degree angle to the rectangles
        let randomX1 = random(width);
        let randomY1 = random(height);
        let randomX2 = random(width);
        let randomY2 = random(height)
        plotter.line(randomX1, randomY1, randomX2, randomY2, 0);
    } else if (key === 'a') {
        let randomWidth = random(10, width / 2);
        let randomHeight = random(10, height / 2);
        let randomX = Math.floor(random(randomWidth / 2, width - (randomWidth / 2)));
        let randomY = Math.floor(random(randomHeight / 2, height - (randomHeight / 2)));
        let randomStart = random(2 * PI);
        let randomStop = random(2 * PI);
        plotter.arc(randomX, randomY, randomWidth, randomHeight, randomStart, randomStop, 0);
        let randomX1 = random(width);
        let randomY1 = random(height);
        let randomX2 = random(width);
        let randomY2 = random(height)
        plotter.line(randomX1, randomY1, randomX2, randomY2, 0);
    }
}