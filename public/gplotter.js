class GPlotter {
    constructor(pageWidth, pageHeight, screenWidth, enabled) {
        this.queue = []; // array to store gcode instructions
        this.feedRate = 3000;
        this.cuttingDepth = 6.25;
        this.drawnShapes = []; // array to store shapes drawn to canvas
        this.enabled = enabled; // option to not send gcode values via socket
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
        this.screenWidth = screenWidth;
        this.canvasHeight = screenWidth / (pageWidth / pageHeight);
        this.pixelToMMRatio = pageWidth / screenWidth;
        this.socketConnected = false;
        this.fillGap = 5;

        // Handle connection errors
        try{
            this.socket = io();
            this.socketConnected = true;
        } catch (error) {
            console.log(error);
            this.socketConnected = false;
            this.enabled = false;
        }
        if(this.socketConnected){
            this.socket.on('plotter', (data) => this.onMessage(data));
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
        this.enabledCheckbox = createCheckbox("Plotting Enabled", false);   
        this.enabledCheckbox.position(screenWidth+10,10);
        this.enabledCheckbox.elt.querySelector('input').id = 'enabled';
        this.enabledCheckbox.changed(this.toggleEnabled);
        

        this.feedRateSlider = createSlider(0,100);
        this.feedRateSlider.position(screenWidth+10,30);
    }

    toggleEnabled(){
        let checkbox = select('#enabled'); 
        if(checkbox.checked() == true){
            if(this.socketConnected == true){
                this.enabled = true;
            } else {
                checkbox.checked(false);
                console.log('socket not connected, cannot enable plotter functions!')
            } 
        } else {
            this.enabled = false;
        }
    }

    display() {
        noFill();
        this.drawnShapes.forEach(shape => {
            if (shape.type === 'circle') {
                ellipse(shape.x, shape.y, shape.diameter, shape.diameter);
                if (shape.fill) {
                    let radius = shape.diameter / 2;
                    let fillGap = 5; // Match the `this.fillGap` used in G-code
                    for (let yy = shape.y - radius; yy <= shape.y + radius; yy += fillGap) {
                        let innerValue = radius * radius - ((yy - shape.y) * (yy - shape.y));
                        if (innerValue >= 0) { // Valid horizontal line within the circle
                            let x1 = shape.x - Math.sqrt(innerValue);
                            let x2 = shape.x + Math.sqrt(innerValue);
                            line(x1, yy, x2, yy); // Draw fill line
                        }
                    }
                }
            } else if (shape.type === 'rectangle') {
                rect(shape.x, shape.y, shape.width, shape.height);
                if (shape.fill) {
                    let fillGap = 5; // Match the this.fillGap used in G-code
                    for (let yy = shape.y; yy <= shape.y + shape.height; yy += fillGap) {
                        let x1 = shape.x; // Left edge
                        let x2 = shape.x + shape.width; // Right edge
                        line(x1, yy, x2, yy); // Draw a horizontal fill line
                    }
                }
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
                // Simulate the fill
            if (shape.fill && shape.isClosed) {
                let minY = Math.min(...shape.vertices.map(v => v.y));
                let maxY = Math.max(...shape.vertices.map(v => v.y));
                let fillGap = 5; // Same as the G-code gap

                for (let yy = minY; yy <= maxY; yy += fillGap) {
                    let intersections = [];

                    // Find intersection points of the horizontal line (yy) with shape edges
                    for (let i = 0; i < shape.vertices.length; i++) {
                        let v1 = shape.vertices[i];
                        let v2 = shape.vertices[(i + 1) % shape.vertices.length]; // Wrap to first vertex

                        if (v1.isCurve && i > 0 && i < shape.vertices.length - 2) {
                            // Curve segment intersections
                            let p0 = shape.vertices[i - 1];
                            let p1 = v1;
                            let p2 = v2;
                            let p3 = shape.vertices[i + 2];
                            let numSegments = 10;

                            for (let j = 0; j < numSegments; j++) {
                                let t1 = j / numSegments;
                                let t2 = (j + 1) / numSegments;

                                let x1 = this.catmullRom(t1, p0.x, p1.x, p2.x, p3.x);
                                let y1 = this.catmullRom(t1, p0.y, p1.y, p2.y, p3.y);

                                let x2 = this.catmullRom(t2, p0.x, p1.x, p2.x, p3.x);
                                let y2 = this.catmullRom(t2, p0.y, p1.y, p2.y, p3.y);

                                if ((y1 <= yy && y2 > yy) || (y2 <= yy && y1 > yy)) {
                                    let t = (yy - y1) / (y2 - y1);
                                    let intersectX = x1 + t * (x2 - x1);
                                    intersections.push(intersectX);
                                }
                            }
                        } else {
                            // Straight segment intersections
                            let y1 = v1.y;
                            let y2 = v2.y;
                            let x1 = v1.x;
                            let x2 = v2.x;

                            if ((y1 <= yy && y2 > yy) || (y2 <= yy && y1 > yy)) {
                                let t = (yy - y1) / (y2 - y1);
                                let intersectX = x1 + t * (x2 - x1);
                                intersections.push(intersectX);
                            }
                        }
                    }

                    // Sort intersections from left to right
                    intersections.sort((a, b) => a - b);

                    // Draw fill lines between pairs of intersections
                    for (let i = 0; i < intersections.length; i += 2) {
                        if (i + 1 < intersections.length) {
                            let xStart = intersections[i];
                            let xEnd = intersections[i + 1];
                            line(xStart, yy, xEnd, yy); // Draw the fill line
                        }
                    }
                }
            }
            } else if (shape.type === 'ellipse') {
                ellipse(shape.x, shape.y, shape.width, shape.height);
                // Simulate the fill if enabled
            if (shape.fill) {
                let r_w = shape.width / 2; // Horizontal radius
                let r_h = shape.height / 2; // Vertical radius
                let fillGap = 5; // Match the G-code fill gap

                // Generate fill lines
                for (let yy = shape.y - r_h; yy <= shape.y + r_h; yy += fillGap) {
                    let xOffset = r_w * Math.sqrt(1 - Math.pow((yy - shape.y) / r_h, 2));
                    if (!isNaN(xOffset)) { // Ensure valid offset calculation
                        let x1 = shape.x - xOffset;
                        let x2 = shape.x + xOffset;
                        line(x1, yy, x2, yy); // Draw the fill line
                    }
                }
            }
            } else if (shape.type === 'point') {
                point(shape.x, shape.y);
            }
        });
    }

    circle(x, y, d, fill=true) {
        this.drawnShapes.push({ type: 'circle', x: x, y: y, diameter: d, fill:fill });
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmD = d * this.pixelToMMRatio;
        this.circleToGCode(mmX, mmY, mmD, fill);
    }

    circleToGCode(x, y, d, fill) {
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
        if (fill) {
            for (let yy = y - radius; yy <= y + radius; yy += this.fillGap) { // Using fill gap
                let innerValue = radius * radius - ((yy - y) * (yy - y));
                if (innerValue >= 0) { // Only proceed if the value inside the square root is non-negative
                    let x1 = x - Math.sqrt(innerValue);
                    let x2 = x + Math.sqrt(innerValue);
                    gcode.push(`G00 X${x1.toFixed(3)} Y${yy.toFixed(3)} ; Move to fill start`);
                    gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for filling`);
                    gcode.push(`G01 X${x2.toFixed(3)} Y${yy.toFixed(3)} F${this.feedRate} ; Fill line`);
                    gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after fill line`);
                }
            }
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

    rectangle(x, y, w, h, fill = true) {
        this.drawnShapes.push({ type: 'rectangle', x: x, y: y, width: w, height: h, fill:fill });
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.rectangleToGCode(mmX, mmY, mmW, mmH, fill);
    }

    rectangleToGCode(x, y, w, h, fill) {
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

        if (fill) {
            for (let yy = y; yy <= y + h; yy += this.fillGap) { // Using fill gap
                gcode.push(`G00 X${(x - w).toFixed(3)} Y${yy.toFixed(3)} ; Move to fill start`);
                gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for filling`);
                gcode.push(`G01 X${x.toFixed(3)} Y${yy.toFixed(3)} F${this.feedRate} ; Fill line`);
                gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after fill line`);
            }
        }

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

    endShape(close = false, fill = true) {
        let shape = this.drawnShapes[this.drawnShapes.length - 1];
        shape.type = 'customShape';
        shape.isClosed = close === CLOSE; // Set whether the shape should be closed based on `CLOSE`
        shape.fill = fill;
        this.generateGCodeForCustomShape(shape.vertices, close === CLOSE, fill);

    }

    generateGCodeForCustomShape(vertices, close, fill = true) {
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
            // Generate the G-code for filling the shape if requested
        if (fill && close) {
            // Calculate the bounding box of the shape
            let minY = Math.min(...vertices.map(v => v.y)) * this.pixelToMMRatio;
            let maxY = Math.max(...vertices.map(v => v.y)) * this.pixelToMMRatio;

            // Traverse from minY to maxY at fillGap intervals
            for (let yy = minY; yy <= maxY; yy += this.fillGap) {
                let intersections = [];

                // Find intersection points of the horizontal line (yy) with the shape's edges
                for (let i = 0; i < vertices.length; i++) {
                    let v1 = vertices[i];
                    let v2 = vertices[(i + 1) % vertices.length]; // Wrap to the first vertex for closure

                    if (v1.isCurve && i > 1 && i < vertices.length - 2) {
                        // Handle curve segments with Catmull-Rom spline
                        let p0 = vertices[i - 1];
                        let p1 = vertices[i];
                        let p2 = vertices[i + 1];
                        let p3 = vertices[i + 2];
                        let numSegments = 10;

                        for (let j = 0; j < numSegments; j++) {
                            let t1 = j / numSegments;
                            let t2 = (j + 1) / numSegments;

                            let x1 = catmullRom(t1, p0.x, p1.x, p2.x, p3.x);
                            let y1 = catmullRom(t1, p0.y, p1.y, p2.y, p3.y);

                            let x2 = catmullRom(t2, p0.x, p1.x, p2.x, p3.x);
                            let y2 = catmullRom(t2, p0.y, p1.y, p2.y, p3.y);

                            if ((y1 <= yy && y2 > yy) || (y2 <= yy && y1 > yy)) {
                                let t = (yy - y1) / (y2 - y1);
                                let intersectX = x1 + t * (x2 - x1);
                                intersections.push(this.pageWidth - intersectX * this.pixelToMMRatio);
                            }
                        }
                    } else {
                        // Handle straight line segments
                        let y1 = v1.y * this.pixelToMMRatio;
                        let y2 = v2.y * this.pixelToMMRatio;
                        let x1 = this.pageWidth - v1.x * this.pixelToMMRatio;
                        let x2 = this.pageWidth - v2.x * this.pixelToMMRatio;

                        if ((y1 <= yy && y2 > yy) || (y2 <= yy && y1 > yy)) {
                            // Calculate the intersection point using linear interpolation
                            let t = (yy - y1) / (y2 - y1);
                            let intersectX = x1 + t * (x2 - x1);
                            intersections.push(intersectX);
                        }
                    }
                }

                // Sort intersections from left to right
                intersections.sort((a, b) => a - b);

                // Draw fill lines between pairs of intersection points
                for (let i = 0; i < intersections.length; i += 2) {
                    if (i + 1 < intersections.length) {
                        let xStart = intersections[i];
                        let xEnd = intersections[i + 1];
                        gcode.push(`G00 X${xStart.toFixed(3)} Y${yy.toFixed(3)} ; Move to fill start`);
                        gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for filling`);
                        gcode.push(`G01 X${xEnd.toFixed(3)} Y${yy.toFixed(3)} F${this.feedRate} ; Fill line`);
                        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after fill line`);
                    }
                }
            }
        }

            gcode.push("M30 ; Program end and reset");
        } else {
            console.log("Not enough vertices to generate a shape");
        }
        //console.log(gcode.join("\n"));
        console.log(`Generating shape: Close=${close}, Fill=${fill}`);
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

    ellipse(x, y, w, h, fill = true) {
        this.drawnShapes.push({ type: 'ellipse', x: x, y:y, width: w, height: h, fill: fill});
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.ixelToMMRatio;
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.ellipseToGCode(mmX, mmY, mmW, mmH, fill);
    }

    ellipseToGCode(x, y, w, h, fill) {
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
        // Generate fill lines
        if (fill) {
            for (let yy = y - r_h; yy <= y + r_h; yy += this.fillGap) { // Using a hatch spacing of 5mm
                let xOffset = r_w * Math.sqrt(1 - Math.pow((yy - y) / r_h, 2));
                if (!isNaN(xOffset)) { // Ensure that the value is valid
                    let x1 = x - xOffset;
                    let x2 = x + xOffset;
                    gcode.push(`G00 X${x1.toFixed(3)} Y${yy.toFixed(3)} ; Move to fill start`);
                    gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for filling`);
                    gcode.push(`G01 X${x2.toFixed(3)} Y${yy.toFixed(3)} F${this.feedRate} ; Fill line`);
                    gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after fill line`);
                }
            }
        }
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`, "M30 ; Program end and reset");
        this.queue = this.queue.concat(gcode);
        if (this.enabled) {
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    point(x, y) {
        this.drawnShapes.push({ type: 'point', x: x, y: y });
        point(x, y);
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
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