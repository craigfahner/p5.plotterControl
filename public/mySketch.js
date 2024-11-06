let plotter;


function setup() {
    plotter = new GPlotter(594, 841, 500); // page w in mm, page h in mm, screen display width
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
        plotter.circle(randomX, randomY, randomDiameter);
    } else if (key === 'l') {
        let randomX1 = random(width);
        let randomY1 = random(height);
        let randomX2 = random(width);
        let randomY2 = random(height)
        plotter.line(randomX1, randomY1, randomX2, randomY2);
    } else if (key === 'r') {
        let randomW = random(10, width / 2);
        let randomH = random(10, height / 2);
        let randomX = random(width - randomW);
        let randomY = random(height - randomH);
        plotter.rectangle(randomX, randomY, randomW, randomH);
    } else if (key === 'a') {
        let randomWidth = random(10, width / 2);
        let randomHeight = random(10, height / 2);
        let randomX = Math.floor(random(randomWidth / 2, width - (randomWidth / 2)));
        let randomY = Math.floor(random(randomHeight / 2, height - (randomHeight / 2)));
        let randomStart = random(2 * PI);
        let randomStop = random(2 * PI);
        plotter.arc(randomX, randomY, randomWidth, randomHeight, randomStart, randomStop);
    }
}