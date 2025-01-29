// This example demonstrates how to generate a series of expanding and rotating ellipses using the GPlotter library.
// The shapes start with a small size and progressively get larger while rotating by a fixed angle with each step.
// The `drawExpandingShapes` function takes the center coordinates as input and draws ellipses that expand outward.
// Each ellipse increases in width and height, while the rotation angle increases incrementally to create a spiral-like effect.
// This is particularly useful for generative art designs that require dynamic shapes and patterns.

let plotter;
let numShapes = 50;       // Number of expanding shapes
let maxSize = 300;        // Maximum size of the shapes
let angleStep = 10;       // Rotation increment for each shape
let sizeStep = 5;         // Incremental size step for each shape

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // Page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
    let centerX = width / 2;
    let centerY = height / 2;
    drawExpandingShapes(centerX, centerY);
}

function draw() {
    background(225);
    plotter.display(); // Display drawn shapes
}

function drawExpandingShapes(centerX, centerY) {
    let currentWidth = 20;  // Initial width of the ellipse
    let currentHeight = 10; // Initial height of the ellipse
    let rotation = 0;       // Initial rotation angle

    for (let i = 0; i < numShapes; i++) {
        plotter.ellipse(centerX, centerY, currentWidth, currentHeight, false, rotation);
        
        // Increase the size and rotation for the next ellipse
        currentWidth += sizeStep;
        currentHeight += sizeStep / 2;
        rotation += angleStep;
    }
}
