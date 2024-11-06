// blob detection start
let blobCanvas; // Separate canvases
let img, processedImg;        // Image for blob detection
let blobsProcessed = false;   // Flag to avoid reprocessing
let myVida;                   // VIDA instance for blob detection
// blob detection end

let plotter;

// perlin experiment stuff - can be cleared
let perlinMode = false; // turn on to try
let intervalId;
let noiseX;
let noiseY;
let noiseD;
let noiseSpeed = 0.01;

function setup() {
    plotter = new GPlotter(594, 841, 500,false); // page w in mm, page h in mm, screen display width
    createCanvas(plotter.screenWidth, plotter.canvasHeight);
    frameRate(30);

    noiseX = random(1000);
    noiseY = random(1000);
    noiseD = random(1000);

    // blob detection stuff below
    // Create off-screen graphics for blob detection and G-code shape drawing
    blobCanvas = createGraphics(450, 700);

    // VIDA setup for blob detection
    myVida = new Vida();
    myVida.progressiveBackgroundFlag = false;  // No progressive background
    myVida.handleBlobsFlag = true;             // Enable blob detection
    myVida.imageFilterThreshold = 0.2;         // Adjust sensitivity
    myVida.normMinBlobArea = 0.001;            // Smallest allowable blob size
    myVida.normMaxBlobArea = 1;             // Largest allowable blob size
    myVida.approximateBlobPolygonsFlag = true; // Enable polygon approximation

    // Image upload input
    createFileInput(handleFile);

    // plotter.beginShape();
    // plotter.vertex(100,100);
    // plotter.vertex(100,150);
    // plotter.vertex(300,300);
    // plotter.vertex(300,200);
    // plotter.endShape(CLOSE);
}

function handleFile(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, () => {
            // Resize image while maintaining aspect ratio
            let imgRatio = img.width / img.height;
            if (imgRatio > blobCanvas.width / blobCanvas.height) {
                displayWidth = blobCanvas.width;
                displayHeight = blobCanvas.width / imgRatio;
            } else {
                displayHeight = blobCanvas.height;
                displayWidth = blobCanvas.height * imgRatio;
            }
            processedImg = createImage(displayWidth, displayHeight);
            processedImg.copy(img, 0, 0, img.width, img.height, 0, 0, displayWidth, displayHeight);

            // Clear previous blob detection results
            blobCanvas.clear();

            // Apply grayscale and threshold filters for blob detection
            processedImg.filter(GRAY);
            processedImg.filter(THRESHOLD);

            // Run blob detection and render results
            blobsProcessed = false; // Reset flag to allow reprocessing
            runBlobDetectionOnce();
        });
    } else {
        console.log("Not an image file!");
    }
}

function runBlobDetectionOnce() {
    if (!blobsProcessed && processedImg) {
        myVida.update(processedImg);

        // Get detected blobs
        let blobs = myVida.getBlobs();
        for (let i = 0; i < blobs.length; i++) {
            let blob = blobs[i];
            let x = blob.normRectX * displayWidth;
            let y = blob.normRectY * displayHeight;
            let w = blob.normRectW * displayWidth;
            let h = blob.normRectH * displayHeight;

            // Draw bounding box on `blobCanvas`
            blobCanvas.stroke(0, 255, 0);
            blobCanvas.noFill();
            blobCanvas.rect(x, y, w, h);

            // Draw center of mass
            blobCanvas.fill(255, 0, 0);
            blobCanvas.ellipse(blob.normMassCenterX * displayWidth, blob.normMassCenterY * displayHeight, 5, 5);

            // Generate G-code for the blob's bounding box
            plotter.rectangle(x, y, w, h);
            plotter.circle(blob.normMassCenterX * displayWidth, blob.normMassCenterY * displayHeight, 5, 5);

            // Generate G-code for polygon if available
            if (blob.approximatedPolygon && blob.approximatedPolygon.length > 0) {
                blobCanvas.stroke(0, 0, 255);  // Blue for polygons
                blobCanvas.noFill();
                blobCanvas.beginShape();

                // Start G-code shape for polygon
                plotter.beginShape();

                for (let j = 0; j < blob.approximatedPolygon.length; j++) {
                    let polyX = blob.approximatedPolygon[j].normX * displayWidth;
                    let polyY = blob.approximatedPolygon[j].normY * displayHeight;

                    // Draw vertex on the blobCanvas
                    blobCanvas.vertex(polyX, polyY);

                    // Add vertex to the G-code
                    plotter.vertex(polyX, polyY);
                }

                // End G-code shape for polygon
                plotter.endShape(CLOSE);

                blobCanvas.endShape(CLOSE);  // Close the polygon shape on canvas
            }
        }
        blobsProcessed = true; // Ensure blobs are only processed once
    }
}

function draw() {
    background(225);
    //Comment out if do not want image under
    if (processedImg) {
        image(processedImg, 0, 0, displayWidth, displayHeight);
    } else if (img) {
        image(img, 0, 0, displayWidth, displayHeight);
    }

    // Overlay the blob detection shapes on top of the processed image
    //image(blobCanvas, 10, 10);
    stroke(0,255,0);
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

// perlin experiment stuff down below here

function drawPerlin() {
    console.log("This runs once every second");
    let x = map(noise(noiseX), 0, 1, 50, width - 50);
    let y = map(noise(noiseY), 0, 1, 50, height - 50);
    let d = map(noise(noiseD), 0, 1, 0, 50);
    plotter.circle(x, y, d);
    noiseX += noiseSpeed;
    noiseY += noiseSpeed;
    noiseD += noiseSpeed;
}

function mousePressed() {
    if (perlinMode) {
        if (!intervalId) {
            intervalId = setInterval(drawPerlin, 1000);
        } else {
            clearInterval(intervalId);
        }
    }
}
