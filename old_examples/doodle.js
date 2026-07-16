// This generative art doodle creates organic, flowing shapes using curveVertex().
// The code generates a series of smooth, closed curves by plotting random points around a central location.
// Each time you run the sketch, it produces unique patterns resembling abstract doodles or organic forms.
//
// How it works:
// - The `generateRandomPoints()` function creates an array of random points around a central location within a specified radius.
// - The `plotCurvedShape()` function uses curveVertex() to draw a smooth curve through the generated points, closing the shape for a complete loop.
// - Multiple shapes are drawn by calling `generateCurvedPatterns()` to produce a series of doodles.
//
// - Run the sketch to generate a new set of doodles each time.
// - Experiment by changing the number of shapes, the number of points, or the radius to create different effects.

let plotter;

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // page width, height in mm, display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
    noFill();
    background(225);
    generateCurvedPatterns();
}

function draw() {
    plotter.display(); // Display drawn shapes
}

function generateCurvedPatterns() {
    let numShapes = 10;
    for (let i = 0; i < numShapes; i++) {
        let points = generateRandomPoints(width / 2, height / 2, 100, 8);
        plotCurvedShape(points);
    }
}

function generateRandomPoints(centerX, centerY, radius, numPoints) {
    let points = [];
    for (let i = 0; i < numPoints; i++) {
        let angle = random(TWO_PI);
        let r = random(radius * 0.5, radius);
        let x = centerX + r * cos(angle);
        let y = centerY + r * sin(angle);
        points.push({ x: x, y: y });
    }
    return points;
}

function plotCurvedShape(points) {
    plotter.beginShape();
    for (let i = 0; i < points.length; i++) {
        plotter.curveVertex(points[i].x, points[i].y);
    }
    // Close the curve by repeating the first two points at the end
    plotter.curveVertex(points[0].x, points[0].y);
    plotter.curveVertex(points[1].x, points[1].y);
    plotter.endShape(CLOSE, false);
}
