// This example recreates the concept of "Schotter," a generative artwork originally 
// created by Georg Nees. The piece consists of a grid of squares that gradually become 
// more distorted with random rotation and translation as they progress down the rows.
//
// How to Use:
// - **Press 's' Key**: Generates and draws a Schotter-inspired grid pattern using the GPlotter class. 
//   Each square is drawn with increasing randomness in rotation and position.
//
// This is an example of using the plotter class to create generative arts.

let plotter;

function setup() {
    plotter = new GPlotter(594, 841, 594, false); // page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
}

function draw() {
    background(225);
    plotter.display(); // display drawn shapes
}

function keyPressed() {
    if (key === 's') {
        SchotterGCode();
    }
}

function SchotterGCode() {
    let numSquares = 12;
    let borderSize = 130;
    let canvasWidth = 500;  // A1 paper width in mm
    let canvasHeight = 708; // A1 paper height in mm
    let drawSpaceX = canvasWidth - borderSize;
    let drawSpaceY = canvasHeight - borderSize;
    let squareSize = drawSpaceX / numSquares;

    for (let row = 0; row < numSquares * 2; row++) {
        for (let column = 0; column < numSquares; column++) {
            let sqCount = (numSquares * row) + column;

            let x = borderSize / 2 + column * squareSize;
            let y = borderSize / 2 + row * squareSize;

            // Introduce random rotation and translation
            let rotateIntensity = map(sqCount, 0, 287, 0, 90);
            let randomRotate = random(-rotateIntensity, rotateIntensity);

            let translateIntensity = map(sqCount, 0, 287, 0, (sqCount / 10));
            let randomTranslateX = random(-translateIntensity, translateIntensity);
            let randomTranslateY = random(-translateIntensity, translateIntensity);

            // Calculate transformed coordinates for the rectangle corners
            let centerX = x + randomTranslateX;
            let centerY = y + randomTranslateY;

            // Use plotter.rectangle with transformed coordinates
            plotter.rectangle(centerX, centerY, squareSize, squareSize, false, randomRotate);
        }
    }
}
