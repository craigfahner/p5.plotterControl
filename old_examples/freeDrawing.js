// This example allows you to draw freely on the canvas by clicking and dragging the mouse.
// Each drawn path is converted into G-code commands, enabling you to send the paths to a plotter for reproduction.
// This example is ideal for learning how to interactively create paths and convert them to plotter-ready G-code.

let plotter;
let isDrawing = false;
let path = []; // To store the current drawing path

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // Page width in mm, page height in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
    background(225);
}

function draw() {
    background(225);
    plotter.display(); // Display all drawn shapes

    // Display the current path while drawing
    stroke(0);
    noFill();
    beginShape();
    for (let point of path) {
        vertex(point.x, point.y);
    }
    endShape();
}

// Start drawing when the mouse is pressed
function mousePressed() {
    if (mouseButton === LEFT) {
        isDrawing = true;
        path = []; // Clear the current path
        path.push({ x: mouseX, y: mouseY });
    }
}

// Continue drawing as the mouse is dragged
function mouseDragged() {
    if (isDrawing) {
        path.push({ x: mouseX, y: mouseY });
    }
}

// Finish drawing when the mouse is released
function mouseReleased() {
    if (isDrawing) {
        isDrawing = false;

        // Draw the path with the plotter and generate G-code
        for (let i = 1; i < path.length; i++) {
            let p1 = path[i - 1];
            let p2 = path[i];
            plotter.line(p1.x, p1.y, p2.x, p2.y, 0);
        }

        // Output the generated G-code to the console
        console.log("Generated G-code for the drawn path:");
        plotter.display(); // Ensure the G-code is output/displayed
    }
}
