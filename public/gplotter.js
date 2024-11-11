class GPlotter {
    constructor(pageWidth, pageHeight, screenWidth, enabled) {
        this.queue = []; // array to store gcode instructions
        this.feedRate = 3000;
        this.cuttingDepth = 6.25;
        this.drawnShapes = []; // array to store shapes drawn to canvas
        this.enabled = enabled; // option to not send gcode values via 
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
        this.screenWidth = screenWidth;
        this.canvasHeight = screenWidth / (pageWidth / pageHeight);
        this.pixelToMMRatio = pageWidth / screenWidth;
        this.socket = io();
        this.socket.on('plotter', (data) => this.onMessage(data));
        // Handle connection errors
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        this.socket.on('connect_timeout', () => {
            console.error('Connection timed out');
        });

        // Optionally handle disconnect events
        this.socket.on('disconnect', (reason) => {
            console.warn(`Disconnected from server. Reason: ${reason}`);
        });
    }

    display() {
        noFill();
        this.drawnShapes.forEach(shape => {
            if (shape.type === 'circle') {
                ellipse(shape.x, shape.y, shape.diameter, shape.diameter);
            } else if (shape.type === 'rectangle') {
                rect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === 'arc') {
                arc(shape.x, shape.y, shape.width, shape.height, shape.start, shape.stop);
            } else if (shape.type === 'line') {
                line(shape.x1, shape.y1, shape.x2, shape.y2);
            } else if (shape.type === 'customShape') {
                beginShape();
                shape.vertices.forEach((v, index) => {
                    if (v.isCurve) {
                        // Add extra curveVertex at the start and the end for proper closure
                        if (index === 0) {
                            curveVertex(v.x, v.y);
                        }
                        curveVertex(v.x, v.y);
                        if (index === shape.vertices.length - 1) {
                            curveVertex(v.x, v.y);
                        }
                    } else {
                        vertex(v.x, v.y);
                    }
                });
                if (shape.isClosed) {
                    endShape(CLOSE);
                } else {
                    endShape();
                }
            } else if (shape.type === 'ellipse') {
                ellipse(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === 'point') {
                point(shape.x, shape.y);
            }
        });
    }

    circle(x, y, d) {
        this.drawnShapes.push({ type: 'circle', x: x, y: y, diameter: d });
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmD = d * this.pixelToMMRatio;
        this.circleToGCode(mmX, mmY, mmD);
    }

    circleToGCode(x, y, d) {
        let radius = d / 2;
        let segments = 36;
        let gcode = [
            "G90 ; Absolute positioning",
            `G00 X${(x + radius).toFixed(3)} Y${y.toFixed(3)} F${this.feedRate} ; Move to start of circle`,
            `G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`
        ];
        for (let i = 1; i <= segments; i++) {
            let angle = (i * 2 * Math.PI) / segments;
            let xPos = x + radius * Math.cos(angle);
            let yPos = y + radius * Math.sin(angle);
            gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Draw circle segment`);
        }
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`, "M30 ; Program end and reset");
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    line(x1, y1, x2, y2) {
        this.drawnShapes.push({ type: 'line', x1: x1, y1: y1, x2: x2, y2: y2 });
        let mmX1 = this.pageWidth - x1 * this.pixelToMMRatio;
        let mmY1 = y1 * this.pixelToMMRatio;
        let mmX2 = this.pageWidth - x2 * this.pixelToMMRatio;
        let mmY2 = y2 * this.pixelToMMRatio;
        this.lineToGCode(mmX1, mmY1, mmX2, mmY2);
    }

    lineToGCode(x1, y1, x2, y2) {
        let gcode = [
            "G90 ; Absolute positioning",
            `G00 X${x1.toFixed(3)} Y${y1.toFixed(3)} F${this.feedRate} ; Move to start of line`,
            `G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`,
            `G01 X${x2.toFixed(3)} Y${y2.toFixed(3)} F${this.feedRate} ; Draw line to endpoint`,
            `G00 Z0 F${this.feedRate} ; Lift tool after cutting`,
            "M30 ; Program end and reset"
        ];
        console.log(gcode.join("\n"));
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    rectangle(x, y, w, h) {
        this.drawnShapes.push({ type: 'rectangle', x: x, y: y, width: w, height: h });
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.rectangleToGCode(mmX, mmY, mmW, mmH);
    }

    rectangleToGCode(x, y, w, h) {
        let gcode = [
            "G90 ; Absolute positioning",
            `G00 X${x.toFixed(3)} Y${y.toFixed(3)} F${this.feedRate} ; Move to rect start`,
            `G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`,
            `G01 X${x.toFixed(3)} Y${(y + h).toFixed(3)} F${this.feedRate} ; Draw left edge`,
            `G01 X${(x - w).toFixed(3)} Y${(y + h).toFixed(3)} F${this.feedRate} ; Draw top edge`,
            `G01 X${(x - w).toFixed(3)} Y${y.toFixed(3)} F${this.feedRate} ; Draw right edge`,
            `G01 X${x.toFixed(3)} Y${y.toFixed(3)} F${this.feedRate} ; Draw bottom edge`,
            `G00 Z0 F${this.feedRate} ; Lift tool after cutting`,
            "M30 ; Program end and reset"
        ];
        console.log(gcode.join("\n"));
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    arc(x, y, w, h, start, stop) {
        this.drawnShapes.push({ type: 'arc', x: x, y: y, width: w, height: h, start: start, stop: stop });
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.arcToGCode(mmX, mmY, mmW, mmH, start, stop);
    }

    arcToGCode(x, y, w, h, start, stop) {
        let r_w = w / 2;
        let r_h = h / 2;
        let segments = 36;
        let gcode = ["G90 ; Absolute positioning"];
        let isUpward = (start === PI && stop === TWO_PI);
        let startAngle = isUpward ? PI : 0;
        let stopAngle = isUpward ? TWO_PI : PI;
        let startX = x + r_w * Math.cos(startAngle);
        let startY = y + r_h * Math.sin(startAngle);
        gcode.push(`G00 X${startX.toFixed(3)} Y${startY.toFixed(3)} F${this.feedRate} ; Move to start of arc`);
        gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
        let angleIncrement = (stopAngle - startAngle) / segments;
        for (let i = 0; i <= segments; i++) {
            let angle = startAngle + i * angleIncrement;
            if (angle > stopAngle) break;
            let xPos = x + r_w * Math.cos(angle);
            let yPos = isUpward ? y - Math.abs(r_h * Math.sin(angle)) : y + Math.abs(r_h * Math.sin(angle));
            gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Draw arc segment`);
        }
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`, "M30 ; Program end and reset");
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    beginShape() {
        this.drawnShapes.push({ type: 'customShape', vertices: [] });
    }

    vertex(x, y) {
        this.drawnShapes[this.drawnShapes.length - 1].vertices.push({ x: x, y: y, isCurve: false });
    }

    curveVertex(x, y) {
        this.drawnShapes[this.drawnShapes.length - 1].vertices.push({ x: x, y: y, isCurve: true });
    }

    endShape(close = false) {
        let shape = this.drawnShapes[this.drawnShapes.length - 1];
        shape.type = 'customShape';
        shape.isClosed = close === CLOSE; // Set whether the shape should be closed based on `CLOSE`
        this.generateGCodeForCustomShape(shape.vertices, close === CLOSE);
    }

    generateGCodeForCustomShape(vertices, close) {
        let gcode = ["G90 ; Absolute positioning"];
        if (vertices.length > 0) {
            // Move to the start of the shape
            let startX = this.pageWidth - vertices[0].x * this.pixelToMMRatio;
            let startY = vertices[0].y * this.pixelToMMRatio;
            gcode.push(`G00 X${startX.toFixed(3)} Y${startY.toFixed(3)} F${this.feedRate} ; Move to start of shape`);
            gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);

            // Iterate through vertices and generate G-code
            for (let i = 1; i < vertices.length; i++) {
                if (vertices[i].isCurve && i > 1 && i < vertices.length - 2) {
                    // Catmull-Rom spline requires 4 points, skip the first vertex
                    let p0 = vertices[i - 1];
                    let p1 = vertices[i];
                    let p2 = vertices[i + 1];
                    let p3 = vertices[i + 2];

                    let numSegments = 10; // Smoother curve
                    for (let j = 0; j <= numSegments; j++) {
                        let t = j / numSegments;
                        let x = this.catmullRom(t, p0.x, p1.x, p2.x, p3.x);
                        let y = this.catmullRom(t, p0.y, p1.y, p2.y, p3.y);

                        let mmX = this.pageWidth - x * this.pixelToMMRatio;
                        let mmY = y * this.pixelToMMRatio;
                        gcode.push(`G01 X${mmX.toFixed(3)} Y${mmY.toFixed(3)} F${this.feedRate} ; Draw curve segment`);
                    }
                } else {
                    // Draw straight line to next vertex
                    let x = this.pageWidth - vertices[i].x * this.pixelToMMRatio;
                    let y = vertices[i].y * this.pixelToMMRatio;
                    gcode.push(`G01 X${x.toFixed(3)} Y${y.toFixed(3)} F${this.feedRate} ; Draw to vertex`);
                }
            }

            // If closing the shape, connect the last point to the first point
            if (close) {
                gcode.push(`G01 X${startX.toFixed(3)} Y${startY.toFixed(3)} F${this.feedRate} ; Close the shape`);
            }

            gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
            gcode.push("M30 ; Program end and reset");
        } else {
            console.log("Not enough vertices to generate a shape");
        }
        //console.log(gcode.join("\n"));
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    catmullRom(t, p0, p1, p2, p3) {
        // Catmull-Rom spline formula
        return 0.5 * (
            (2 * p1) +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t
        );
    }

    ellipse(x, y, w, h) {
        this.drawnShapes.push({ type: 'ellipse', x: ellipseStartX, y: ellipseStartY, width: w, height: h });
        let mmX = pageWidth - x * pixelToMMRatio;
        let mmY = y * pixelToMMRatio;
        let mmW = w * pixelToMMRatio;
        let mmH = h * pixelToMMRatio;
        this.ellipseToGCode(mmX, mmY, mmW, mmH);
    }

    ellipseToGCode(x, y, w, h) {
        let r_w = w / 2;
        let r_h = h / 2;
        let segments = 36;
        let gcode = ["G90 ; Absolute positioning"];
        let startX = x + r_w;
        let startY = y;
        gcode.push(`G00 X${startX.toFixed(3)} Y${startY.toFixed(3)} F${this.feedRate} ; Move to start of ellipse`);
        gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
        let angleIncrement = (2 * Math.PI) / segments;
        for (let i = 0; i <= segments; i++) {
            let angle = i * angleIncrement;
            let xPos = x + r_w * Math.cos(angle);
            let yPos = y + r_h * Math.sin(angle);
            gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Draw ellipse segment`);
        }
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`, "M30 ; Program end and reset");
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    point(x, y) {
        this.drawnShapes.push({ type: 'point', x: mouseX, y: mouseY });
        point(x, y);
        let mmX = pageWidth - x * pixelToMMRatio;
        let mmY = y * pixelToMMRatio;
        this.pointToGCode(mmX, mmY);
    }

    pointToGCode(x, y) {
        let gcode = [
            "G90 ; Absolute positioning",
            `G00 X${x.toFixed(3)} Y${y.toFixed(3)} F${this.feedRate} ; Move to point`,
            `G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for marking point`,
            `G00 Z0 F${this.feedRate} ; Lift tool after marking`,
            "M30 ; Program end and reset"
        ];
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    onMessage(message) {
        console.log(message);

        if (message.trim().includes('k')) { // sometimes the message comes broken like on\k, so this catches those errors
            console.log('message ok received');
            if (plotter.queue.length > 0) {
                console.log('sending ' + this.queue[0]);
                this.socket.emit("gCodeOutput", this.queue[0] + '\n');
                this.queue.splice(0, 1);
                console.log(this.queue);
            }
        }
    }
}