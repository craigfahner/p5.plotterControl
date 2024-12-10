let plotter;


function setup() {
    plotter = new GPlotter(594, 841, 594, false); // page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
    frameRate(30);
}

function draw() {
    background(225);
    plotter.display(); // display drawn shapes
}

function keyPressed() {
    if (key === 'z') {
        plotter.socket.emit("gCodeOutput", 'G92 X0Y0Z0\n');
    } else if (key === 'x') {
        plotter.socket.emit("gCodeOutput", 'G01 Z0\nG28\n');
    } else if (key === 'c') {
        let randomDiameter = random(10, width / 2);
        let randomX = Math.floor(random(randomDiameter / 2, width - (randomDiameter / 2)));
        let randomY = Math.floor(random(randomDiameter / 2, height - (randomDiameter / 2)));
        plotter.circle(randomX, randomY, randomDiameter, false);
    } else if (key === 'l') {
        let randomX1 = random(width);
        let randomY1 = random(height);
        let randomX2 = random(width);
        let randomY2 = random(height)
        plotter.line(randomX1, randomY1, randomX2, randomY2, 30);
    } else if (key === 'r') {
        let randomW = random(10, width / 2);
        let randomH = random(10, height / 2);
        let randomX = random(width - randomW);
        let randomY = random(height - randomH);
        plotter.rectangle(randomX, randomY, randomW, randomH, false, 30);
    } else if (key === 'a') {
        let randomWidth = random(10, width / 2);
        let randomHeight = random(10, height / 2);
        let randomX = Math.floor(random(randomWidth / 2, width - (randomWidth / 2)));
        let randomY = Math.floor(random(randomHeight / 2, height - (randomHeight / 2)));
        let randomStart = random(2 * PI);
        let randomStop = random(2 * PI);
        plotter.arc(randomX, randomY, randomWidth, randomHeight, randomStart, randomStop, 30);
    } else if (key === 'e') {
        let randomWidth = random(10, width / 2);
        let randomHeight = random(10, height / 2);
        let randomX = Math.floor(random(randomWidth / 2, width - (randomWidth / 2)));
        let randomY = Math.floor(random(randomHeight / 2, height - (randomHeight / 2)));
        plotter.ellipse(randomX, randomY, randomWidth, randomHeight, false, 30);
    } else if (key === 'p') {
        let randomX = random(width);
        let randomY = random(height);
        plotter.point(randomX, randomY);
    } else if (key === 's') { // Press 's' to draw a spiral
        let angleStep = 0.2;
        let radius = 1;
        let centerX = 200; // Spiral center X
        let centerY = 200; // Spiral center Y

        plotter.beginShape(); // Start the custom shape
        for (let angle = 0; angle <= TWO_PI * 6; angle += angleStep) {
            let x = centerX + radius * cos(angle);
            let y = centerY + radius * sin(angle);
            plotter.vertex(x, y); // Add vertices to the shape
            radius += 0.5; // Increase radius to create spiral effect
        }
        plotter.endShape(CLOSE, true); // Close the shape and enable filling
    } else if (key === 'g') {
        generateSchotterGCode();
    }
}

function generateSchotterGCode() {
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

