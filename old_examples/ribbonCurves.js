// This example demonstrates how to generate flowing lines using Perlin noise and sine waves
// using the GPlotter library, making it compatible with plotter devices.
// Each line is made up of multiple points connected by smooth curves, with slight randomness
// introduced for a natural flow effect.
//
// How to Use:
// 1. **Setup**: Run the code in a p5.js environment with the GPlotter library connected.
// 2. **Output**: The generated lines will be displayed on the canvas, and G-code is produced
//    for plotter-compatible output.
// 3. **Adjust Parameters**: Modify `numLines`, `numPoints`, and `maxOffset` for different results.
//
// This example is great for creating generative art that captures organic, flowing patterns
// and can be easily plotted using a drawing machine.

let numLines = 200;       // Number of flowing lines
let numPoints = 100;      // Number of points per line
let maxOffset = 100;      // Maximum horizontal offset for randomness

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
    noLoop();
}

function draw() {
  background(225); // Dark background for contrast

  for (let i = 0; i < numLines; i++) {
    let yOffset = map(i, 0, numLines - 1, 50, height - 50); // Evenly distribute lines vertically
    plotter.beginShape();
    
    for (let j = 0; j < numPoints; j++) {
      let x = map(j, 0, numPoints - 1, 50, width - 50);
      let y = yOffset + sin(j * 0.1 + i * 0.05) * maxOffset * noise(i * 0.05, j * 0.05);
      plotter.curveVertex(x, y);
    }
    
    plotter.endShape();
  }

  plotter.display(); // Display drawn shapes
}