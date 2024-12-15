// This example demonstrates how to interactively draw expanding and rotating squares 
// using the GPlotter class. The sketch is designed for plotter devices 
// but can also be visualized on-screen for testing and experimentation.
//
// How to Use:
// - **Click on the Canvas**: Starts drawing a square immediately, followed by additional 
//   squares every 2 seconds, each increasing in size and rotation.
// - **Click Again**: Stops the drawing process.
//
// This example is useful for understanding how to:
// - Automate repetitive drawing tasks with timed intervals.
// - Create dynamic geometric patterns with size and rotation transformations.

let plotter;
let rotation = 5;
let size = 15;
let drawingSquare = false;
let drawInterval;

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
}

function draw() {
    background(225);
    plotter.display(); // Display drawn shapes
}

// Function to draw a square with increasing size and rotation
function drawSquare() {
    plotter.rectangle(width / 2, height / 2, size, size, false, rotation);
    size += 5;
    rotation += 5;
}

// Toggle drawing on mouse press
function mousePressed() {
    if (mouseX < width && mouseY < height) {
        if (!drawingSquare) {
            drawingSquare = true;
            drawSquare(); // Draw the first square immediately
            drawInterval = setInterval(drawSquare, 2000); // Draw subsequent squares every 2 seconds
        } else {
            drawingSquare = false;
            clearInterval(drawInterval); // Stop drawing when toggled off
        }
    }
}
