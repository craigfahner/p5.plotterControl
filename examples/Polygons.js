// This example demonstrates how to draw regular polygons using the GPlotter class in p5.js.
// The `drawPolygon` function generates polygons with a specified number of sides, radius, and optional fill.
// You can draw different polygons by pressing keys corresponding to the number of sides:
// - Press '3' to draw a triangle.
// - Press '4' to draw a square.
// - Press '5' to draw a pentagon.
// - Press '6' to draw a hexagon.
// - Press '8' to draw a filled octagon.
//
// This example showcases the use of the following GPlotter functions:
// - plotter.beginShape(): Begins a custom shape definition.
// - plotter.vertex(x, y): Adds a vertex to the current shape.
// - plotter.endShape(CLOSE, fill): Closes and optionally fills the shape.
//
// Explore the code by modifying the number of sides, the polygon size, or adding more shapes!

let plotter;

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
}

function draw() {
    background(225);
    plotter.display(); // Display drawn shapes
}

// Function to draw a regular polygon
function drawPolygon(x, y, radius, sides, fill = false) {
    let angle = TWO_PI / sides;
    plotter.beginShape(); // Start the custom shape

    for (let i = 0; i < sides; i++) {
        let px = x + radius * cos(i * angle);
        let py = y + radius * sin(i * angle);
        plotter.vertex(px, py); // Add each vertex of the polygon
    }

    plotter.endShape(CLOSE, fill); // Close the shape and optionally fill it
}

// Draw different polygons when a key is pressed
function keyPressed() {
    if (key === '3') {
        // Draw a triangle centered in the canvas
        drawPolygon(width / 2, height / 2, 100, 3, false);
    } else if (key === '4') {
        // Draw a square centered in the canvas
        drawPolygon(width / 2, height / 2, 100, 4, false);
    } else if (key === '5') {
        // Draw a pentagon centered in the canvas
        drawPolygon(width / 2, height / 2, 100, 5, false);
    } else if (key === '6') {
        // Draw a hexagon centered in the canvas
        drawPolygon(width / 2, height / 2, 100, 6, false);
    } else if (key === '8') {
        // Draw an octagon centered in the canvas with fill
        drawPolygon(width / 2, height / 2, 100, 8, true);
    }
}