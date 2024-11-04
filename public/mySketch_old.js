const socket = io();  //use this to initialize the socket that we will use to talk to the server

let ready = true;
let gQueue = [];

let freeLineStarted = false;

let pageWidth = 594; // paper width in mm
let pageHeight = 841; // paper height in mm
let pixelToMMRatio; // variable for pixel to mm conversion
let screenWidth = 500; // width of on-screen display of drawing
let feedRate = 3000; // Feedrate parameter
let cuttingDepth = 6.25; // Z parameter for cutting depth

// Modes for drawing different shapes
let drawCircleMode = false;
let drawRectangleMode = false;
let drawArcMode = false;
let drawLineMode = false;
let freeDrawMode = false;

// Variables to store start position for shapes
let circleStartX, circleStartY;
let rectStartX, rectStartY;
let arcStartX, arcStartY;
let lineStartX, lineStartY;

// Variables to store dimensions while dragging
let circleDiameter;
let rectWidth, rectHeight;
let arcWidth, arcHeight;
let lineEndX, lineEndY;

let isDragging = false; // Variable to track if mouse is being dragged
let drawnShapes = []; // Array to store drawn shapes
let currentMode = ""; // Variable to store current mode

let gCodeInstance;

function setup() {
    let ratio = pageWidth / pageHeight;
    let canvasHeight = screenWidth / ratio;
    createCanvas(screenWidth, canvasHeight);
    pixelToMMRatio = pageWidth / width;
    noFill();
    background(225);
    textSize(16);
    frameRate(20);

    //gCodeInstance = new GCode();
}

function draw() {
    background(225);
    // Draw current mode text
    fill(0);
    text(`Current mode: ${currentMode}`, 10, 20);
    noFill();

    // Draw all previously drawn shapes
    drawnShapes.forEach(shape => {
        if (shape.type === 'circle') {
            ellipse(shape.x, shape.y, shape.diameter, shape.diameter);
        } else if (shape.type === 'rectangle') {
            rect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'arc') {
            arc(shape.x, shape.y, shape.width, shape.height, shape.start, shape.stop);
        } else if (shape.type === 'line') {
            line(shape.x1, shape.y1, shape.x2, shape.y2);
        }
    });

    // Draw the current shape being dragged
    if (isDragging) {
        if (drawCircleMode) {
            circleDiameter = dist(circleStartX, circleStartY, mouseX, mouseY) * 2;
            ellipse(circleStartX, circleStartY, circleDiameter, circleDiameter);
        } else if (drawRectangleMode) {
            rectWidth = mouseX - rectStartX;
            rectHeight = mouseY - rectStartY;
            rect(rectStartX, rectStartY, rectWidth, rectHeight);
        } else if (drawArcMode) {
            arcWidth = mouseX - arcStartX;
            arcHeight = mouseY - arcStartY;
            let startAngle = mouseY < arcStartY ? PI : 0;
            let stopAngle = mouseY < arcStartY ? TWO_PI : PI;
            arc(arcStartX, arcStartY, arcWidth, arcHeight, startAngle, stopAngle);
        } else if (drawLineMode) {
            lineEndX = mouseX;
            lineEndY = mouseY;
            line(lineStartX, lineStartY, lineEndX, lineEndY);
        } else if (freeDrawMode) {
            if (freeLineStarted) {
                line(pmouseX, pmouseY, mouseX, mouseY);
                drawnShapes.push({ type: 'line', x1: pmouseX, y1: pmouseY, x2: mouseX, y2: mouseY });
                gLine(pmouseX, pmouseY, mouseX, mouseY);
            }
        }
    }
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {


        if (drawCircleMode) {
            circleStartX = mouseX;
            circleStartY = mouseY;
        } else if (drawRectangleMode) {
            rectStartX = mouseX;
            rectStartY = mouseY;
        } else if (drawArcMode) {
            arcStartX = mouseX;
            arcStartY = mouseY;
        } else if (drawLineMode) {
            lineStartX = mouseX;
            lineStartY = mouseY;
        } else if (freeDrawMode) {
            freeLineStarted = true;
        }
        isDragging = true;
    }
}

function mouseReleased() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {

        isDragging = false;
        if (drawCircleMode) {
            let d = circleDiameter;
            drawnShapes.push({ type: 'circle', x: circleStartX, y: circleStartY, diameter: d });
            gCircle(circleStartX, circleStartY, d);
        } else if (drawRectangleMode) {
            let w = rectWidth;
            let h = rectHeight;
            drawnShapes.push({ type: 'rectangle', x: rectStartX, y: rectStartY, width: w, height: h });
            gRectangle(rectStartX, rectStartY, w, h);
        } else if (drawArcMode) {
            let w = arcWidth;
            let h = arcHeight;
            let startAngle = mouseY < arcStartY ? PI : 0;
            let stopAngle = mouseY < arcStartY ? TWO_PI : PI;
            drawnShapes.push({ type: 'arc', x: arcStartX, y: arcStartY, width: w, height: h, start: startAngle, stop: stopAngle });
            gArc(arcStartX, arcStartY, w, h, startAngle, stopAngle);
        } else if (drawLineMode) {
            let x1 = lineStartX;
            let y1 = lineStartY;
            let x2 = lineEndX;
            let y2 = lineEndY;
            drawnShapes.push({ type: 'line', x1: x1, y1: y1, x2: x2, y2: y2 });
            gLine(x1, y1, x2, y2);
        } else if (freeDrawMode) {
            freeLineStarted = false;
        }
    }
}

function keyPressed() {
    if (key === 'l' || key === 'L') {
        setDrawingMode('Line');
    } else if (key === 'r' || key === 'R') {
        setDrawingMode('Rectangle');
    } else if (key === 'a' || key === 'A') {
        setDrawingMode('Arc');
    } else if (key === 'c' || key === 'C') {
        setDrawingMode('Circle');
    } else if (key === 'q' || key === 'Q') {
        quitDrawingMode();
    } else if (key === 'z') {
        socket.emit("gCodeOutput", 'G92 X0Y0Z0\n');
    } else if (key === 'x') {
        socket.emit("gCodeOutput", 'G01 Z0\nG28\n');
    } else if (key === 'f') {
        setDrawingMode('Free');
    }

}

function setDrawingMode(mode) {
    drawCircleMode = mode === 'Circle';
    drawRectangleMode = mode === 'Rectangle';
    drawArcMode = mode === 'Arc';
    drawLineMode = mode === 'Line';
    freeDrawMode = mode === 'Free';
    currentMode = mode;
}

function quitDrawingMode() {
    drawCircleMode = false;
    drawRectangleMode = false;
    drawArcMode = false;
    drawLineMode = false;
    currentMode = "none";
}

function gCircle(x, y, d) {
    circle(x, y, d);
    let mmX = pageWidth - x * pixelToMMRatio;
    let mmY = y * pixelToMMRatio;
    let mmD = d * pixelToMMRatio;
    circleToGCode(mmX, mmY, mmD);
}

function circleToGCode(x, y, d) {
    let radius = d / 2;
    let segments = 36;
    let gcode = [
        "G90 ; Absolute positioning",
        `G00 X${(x + radius).toFixed(3)} Y${y.toFixed(3)} F${feedRate} ; Move to start of circle`,
        `G01 Z${cuttingDepth} F${feedRate} ; Lower tool for cutting`
    ];
    for (let i = 1; i <= segments; i++) {
        let angle = (i * 2 * Math.PI) / segments;
        let xPos = x + radius * Math.cos(angle);
        let yPos = y + radius * Math.sin(angle);
        gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${feedRate} ; Draw circle segment`);
    }
    gcode.push(`G00 Z0 F${feedRate} ; Lift tool after cutting`, "M30 ; Program end and reset");
    gQueue = gQueue.concat(gcode);
    socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
}

function gLine(x1, y1, x2, y2) {
    line(x1, y1, x2, y2);
    let mmX1 = pageWidth - x1 * pixelToMMRatio;
    let mmY1 = y1 * pixelToMMRatio;
    let mmX2 = pageWidth - x2 * pixelToMMRatio;
    let mmY2 = y2 * pixelToMMRatio;
    lineToGCode(mmX1, mmY1, mmX2, mmY2);
}

function lineToGCode(x1, y1, x2, y2) {
    //if(x1 != x2 && y1 != y2){
    let gcode = [
        "G90 ; Absolute positioning",
        `G00 X${x1.toFixed(3)} Y${y1.toFixed(3)} F${feedRate} ; Move to start of line`,
        `G01 Z${cuttingDepth} F${feedRate} ; Lower tool for cutting`,
        `G01 X${x2.toFixed(3)} Y${y2.toFixed(3)} F${feedRate} ; Draw line to endpoint`,
        `G00 Z0 F${feedRate} ; Lift tool after cutting`,
        "M30 ; Program end and reset"
    ];
    console.log(gcode.join("\n"));
    gQueue = gQueue.concat(gcode);
    socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
    //}
}

function gRectangle(x, y, w, h) {
    rect(x, y, w, h);
    let mmX = pageWidth - x * pixelToMMRatio;
    let mmY = y * pixelToMMRatio;
    let mmW = w * pixelToMMRatio;
    let mmH = h * pixelToMMRatio;
    rectangleToGCode(mmX, mmY, mmW, mmH);
}

function rectangleToGCode(x, y, w, h) {
    let gcode = [
        "G90 ; Absolute positioning",
        `G00 X${x.toFixed(3)} Y${y.toFixed(3)} F${feedRate} ; Move to rect start`,
        `G01 Z${cuttingDepth} F${feedRate} ; Lower tool for cutting`,
        `G01 X${x.toFixed(3)} Y${(y + h).toFixed(3)} F${feedRate} ; Draw left edge`,
        `G01 X${(x - w).toFixed(3)} Y${(y + h).toFixed(3)} F${feedRate} ; Draw top edge`,
        `G01 X${(x - w).toFixed(3)} Y${y.toFixed(3)} F${feedRate} ; Draw right edge`,
        `G01 X${x.toFixed(3)} Y${y.toFixed(3)} F${feedRate} ; Draw bottom edge`,
        `G00 Z0 F${feedRate} ; Lift tool after cutting`,
        "M30 ; Program end and reset"
    ];
    console.log(gcode.join("\n"));
    gQueue = gQueue.concat(gcode);
    socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
}

function gArc(x, y, w, h, start, stop) {
    arc(x, y, w, h, start, stop);
    let mmX = pageWidth - x * pixelToMMRatio;
    let mmY = y * pixelToMMRatio;
    let mmW = w * pixelToMMRatio;
    let mmH = h * pixelToMMRatio;
    arcToGCode(mmX, mmY, mmW, mmH, start, stop);
}

function arcToGCode(x, y, w, h, start, stop) {
    let r_w = w / 2;
    let r_h = h / 2;
    let segments = 36;
    let gcode = ["G90 ; Absolute positioning"];
    let isUpward = (start === PI && stop === TWO_PI);
    let startAngle = isUpward ? PI : 0;
    let stopAngle = isUpward ? TWO_PI : PI;
    let startX = x + r_w * Math.cos(startAngle);
    let startY = y + r_h * Math.sin(startAngle);
    gcode.push(`G00 X${startX.toFixed(3)} Y${startY.toFixed(3)} F${feedRate} ; Move to start of arc`);
    gcode.push(`G01 Z${cuttingDepth} F${feedRate} ; Lower tool for cutting`);
    let angleIncrement = (stopAngle - startAngle) / segments;
    for (let i = 0; i <= segments; i++) {
        let angle = startAngle + i * angleIncrement;
        if (angle > stopAngle) break;
        let xPos = x + r_w * Math.cos(angle);
        let yPos = isUpward ? y - Math.abs(r_h * Math.sin(angle)) : y + Math.abs(r_h * Math.sin(angle));
        gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${feedRate} ; Draw arc segment`);
    }
    gcode.push(`G00 Z0 F${feedRate} ; Lift tool after cutting`, "M30 ; Program end and reset");
    //console.log(gcode.join("\n"));
    //socket.emit("gCodeOutput", gcode.join("\n"));
    gQueue = gQueue.concat(gcode);
    socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
}

// function outputGCode(gCode){

// }

socket.on('plotter', (message) => {
    console.log(message);

    if (message.trim().includes('k')) { // sometimes the message comes broken like on\k, so this catches those errors
        console.log('message ok received');
        if (gQueue.length > 0) {
            console.log('sending ' + gQueue[0]);
            socket.emit("gCodeOutput", gQueue[0] + '\n');
            gQueue.splice(0, 1);
            console.log(gQueue);
        }
    }
});