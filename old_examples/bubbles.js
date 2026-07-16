// This example creates a dynamic bubble-drawing tool that follows your mouse movements.
// When you click and hold the mouse, it generates random bubbles at intervals, giving the
// impression of drawing with bubbles. The bubbles can be drawn real-time by the plotter.
//
// Instructions:
// 1. **Click and hold** anywhere on the canvas to start drawing bubbles.
// 2. **Release the mouse button** to stop drawing.
// 3. The bubbles are displayed using the `plotter.circle` function and will be queued
//    for G-code generation if the plotter is connected.

let plotter;
let bubbleSizeRange = [5, 20];  // Range for bubble sizes (min, max)
let spreadRadius = 20;          // How far bubbles can spread from the mouse point
let bubblesPerDraw = 2;         // Number of bubbles to draw per interval
let drawInterval;               // Interval for drawing bubbles

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // Page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
    background(225);
    noLoop(); // Static sketch; updates when bubbles are drawn
}

function draw() {
    background(225);
    plotter.display(); // Display drawn shapes
}

function mousePressed() {
    drawInterval = setInterval(() => drawBubbles(mouseX, mouseY), 100); // Draw bubbles every 100 ms
}

function mouseReleased() {
    clearInterval(drawInterval); // Stop drawing when the mouse is released
}

function drawBubbles(x, y) {
    for (let i = 0; i < bubblesPerDraw; i++) {
        let offsetX = random(-spreadRadius, spreadRadius);
        let offsetY = random(-spreadRadius, spreadRadius);
        let bubbleSize = random(bubbleSizeRange[0], bubbleSizeRange[1]);

        let bubbleX = x + offsetX;
        let bubbleY = y + offsetY;

        // Draw the bubble with the plotter
        plotter.circle(bubbleX, bubbleY, bubbleSize, false);
    }
    redraw(); // Update the display with the new bubbles
}
