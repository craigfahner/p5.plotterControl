// This example demonstrates how to use the GPlotter class to draw a series of 
// rectangles in draw() with increasing sizes and rotations centered on the canvas. 
//
// Each rectangle is drawn sequentially, increasing in width, height, and rotation
// to create a visually appealing pattern. The drawing is performed only once to
// prevent continuous looping, making it suitable for static designs for a plotter.
//
// Instructions:
// - Ensure the plotter is connected and enabled to output G-code.
// - Run the sketch to see the rectangles displayed on the screen or sent to the plotter.
//
// This example is useful for understanding how to create geometric patterns with 
// incremental transformations and can be adapted for more complex designs.


let plotter;
let rotation = 5;
let size = 15;
let drawingFinished = false;

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // Page dimensions in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
}

function draw() {
    background(225);

    if (!drawingFinished) {
        for (let i = 0; i < 20; i++) {
            let rectSizeW = size + (i * 15);
            let rectSizeH = size + (i * 15);
            let rectRotation = rotation + (i * 5);

            plotter.rectangle(width / 2, height / 2, rectSizeW, rectSizeH, false, rectRotation);
        }
        drawingFinished = true;
    }

    plotter.display(); // Display drawn shapes
}
