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

        // Create Enable Checkbox to enable plotting
        this.enabledCheckbox = createCheckbox("Plotting Enabled", false);
        this.enabledCheckbox.position(screenWidth + 10, 10);
        this.enabledCheckbox.elt.querySelector('input').id = 'enabled';
        this.enabledCheckbox.changed(() => this.toggleEnabled());

         // Add properties for ports and connection status
         this.availablePorts = [];
         this.serverUnavailable = false;
         this.connectedPort = null;
 
         // Initialize dropdown before any possible calls to updatePortsDropdown
         this.portDropdown = createSelect();
         this.portDropdown.position(screenWidth + 15, 40);
         this.updatePortsDropdown([]); // Initialize with a default message
 
         // Create a connect button
         this.connectButton = createButton("Connect");
         this.connectButton.position(screenWidth + 185, 38);
         this.connectButton.mousePressed(() => this.toggleConnection());
         
         // Add a label to show connection status
         this.connectionStatusLabel = createP("Not connected");
         this.connectionStatusLabel.position(screenWidth + 280, 23);

          // Add text input for feed rate
        createP("Feed Rate:").position(screenWidth + 15, 55);
        this.feedRateInput = createInput(this.feedRate.toString(), "number");
        this.feedRateInput.position(screenWidth + 90, 70);
        this.feedRateInput.size(80);
        this.feedRateInput.input(() => this.updateFeedRate());

        // Add text input for cutting depth
        createP("Z Depth:").position(screenWidth + 15, 85);
        this.cuttingDepthInput = createInput(this.cuttingDepth.toString(), "number");
        this.cuttingDepthInput.position(screenWidth + 90, 100);
        this.cuttingDepthInput.size(80);
        this.cuttingDepthInput.input(() => this.updateCuttingDepth());

        // Add text input for fill gap
        createP("Fill Gap:").position(screenWidth + 15, 115);
        this.fillGapInput = createInput(this.fillGap.toString(), "number");
        this.fillGapInput.position(screenWidth + 90, 130);
        this.fillGapInput.size(80);
        this.fillGapInput.input(() => this.updateFillGap());

         // Create Set New Zero button
         this.setZeroButton = createButton('Set New Zero');
         this.setZeroButton.position(screenWidth + 15, 165);
         this.setZeroButton.mousePressed(() => this.setNewZero());
 
         // Create Return to Zero button
         this.returnZeroButton = createButton('Return to Zero');
         this.returnZeroButton.position(screenWidth + 125, 165); // Adjust position as needed
         this.returnZeroButton.mousePressed(() => this.returnToZero());

        // Handle connection errors
        try {
            this.socket = io();
            this.socketConnected = true;
            this.serverUnavailable = false;
        } catch (error) {
            console.log(error);
            this.socketConnected = false;
            this.enabled = false;
            this.serverUnavailable = true;
            this.updatePortsDropdown([]);
        }

        if (this.socketConnected) {
            this.socket.on('plotter', (data) => this.onMessage(data));
            this.socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                this.serverUnavailable = true;
                this.updatePortsDropdown([]);
            });

            this.socket.on('portList', (data) => {
                console.log(data);
                this.updatePortsDropdown(data);

            });

            this.socket.on('portConnected', (data) =>{
                this.connectedPort = data;
                this.connectionStatusLabel.html("Connected to " + data);
                this.connectButton.html("Disconnect"); // Update button text
            });

            this.socket.on('connect_timeout', () => {
                console.error('Connection timed out');
                this.serverUnavailable = true;
                this.updatePortsDropdown([]);
            });

            this.socket.on('disconnect', (reason) => {
                console.warn(`Disconnected from server. Reason: ${reason}`);
                this.connectionStatusLabel.html("Not connected");
                this.connectButton.html("Connect");
                this.connectedPort = null;
            });

            // Fetch available ports from the server
            //this.socket.emit('getPorts');
        }
    }

    updatePortsDropdown(ports) {
        this.portDropdown.elt.innerHTML = ''; // Clear previous options
        if (!this.socketConnected) {
            this.portDropdown.option('No server connection'); // Fallback message if not connected
        } else if (ports.length === 0) {
            this.portDropdown.option('No ports available'); // Empty state when no ports are detected
        } else {
            this.portDropdown.option('Select Port'); // Default option when ports are available
            ports.forEach((port) => {
                this.portDropdown.option(port);
            });
        }
    }

    toggleEnabled() {
        let checkbox = select('#enabled');
        if (checkbox.checked() === true) {
            if (this.socketConnected === true && this.connectedPort) {
                this.enabled = true;
                const gcode = "G92 X0 Y0 Z0 ;";
                this.queue.push(gcode);
                this.socket.emit("gCodeOutput", gcode + '\n');
            } else {
                checkbox.checked(false);
                console.log('cannot enable plotter functions');
            }
        } else {
            this.enabled = false;
        }
    }

    toggleConnection() {
        if (this.connectedPort) {
            // If already connected, disconnect
            this.disconnectFromPort();
        } else {
            // Otherwise, attempt to connect
            this.connectToPort();
        }
    }

    connectToPort() {
        const selectedPort = this.portDropdown.value();
        if (!this.socketConnected || this.serverUnavailable) {
            this.connectionStatusLabel.html("No server connection");
            return;
        }
        if (selectedPort === "Select Port" || selectedPort === "No ports available") {
            this.connectionStatusLabel.html("Please select a valid port");
            return;
        }

        // Emit the selected port to the server
        this.socket.emit('portSelect', selectedPort, (response) => {
            if (response.success) {
                this.connectedPort = selectedPort;
                this.connectionStatusLabel.html("Connected to " + selectedPort);
                this.connectButton.html("Disconnect"); // Update button text
            } else {
                this.connectionStatusLabel.html("Failed to connect: " + response.error);
            }
        });
    }

    disconnectFromPort() {
        if (!this.connectedPort) return;

        // Emit a custom 'disconnectPort' event to the server
        this.socket.emit('disconnectPort', (response) => {
        if (response.success) {
            this.connectionStatusLabel.html("Disconnected");
            this.connectButton.html("Connect"); // Update button text
            this.connectedPort = null;
        } else {
            this.connectionStatusLabel.html("Failed to disconnect: " + response.error);
        }
    });
    }

    fetchPorts() {
        if (this.socketConnected) {
            this.socket.emit('getPorts');
        }
    }

    onMessage(data) {
        console.log(data);
    }

    updateFeedRate() {
        const newFeedRate = parseInt(this.feedRateInput.value());
        if (!isNaN(newFeedRate) && newFeedRate > 0) {
            this.feedRate = newFeedRate;
            //console.log("Updated Feed Rate:", this.feedRate); // Log the updated feed rate
        } else {
            this.feedRateInput.value(this.feedRate.toString()); // Reset invalid input
        }
    }

    updateCuttingDepth() {
        const newCuttingDepth = parseFloat(this.cuttingDepthInput.value());
        if (!isNaN(newCuttingDepth) && newCuttingDepth > 0) {
            this.cuttingDepth = newCuttingDepth;
            //console.log("Updated Z Depth:", this.cuttingDepth); // Log the updated Z depth
        } else {
            this.cuttingDepthInput.value(this.cuttingDepth.toString()); // Reset invalid input
        }
    }

    updateFillGap() {
        const newFillGap = parseFloat(this.fillGapInput.value());
        if (!isNaN(newFillGap) && newFillGap > 0) {
            this.fillGap = newFillGap;
            console.log("Updated Fill Gap:", this.fillGap); // Log the updated fill gap
        } else {
            this.fillGapInput.value(this.fillGap.toString()); // Reset invalid input
        }
    }    

    setNewZero() {
        const gcode = "G92 X0 Y0 Z0 ;";
        console.log(gcode);
        
        if (this.enabled) {
            this.queue.push(gcode);
            this.socket.emit("gCodeOutput", gcode + '\n');
        }
    }

    returnToZero() {
        const gcode = "G00 X0 Y0 Z0 ;";
        console.log(gcode);
        
        if (this.enabled) {
            this.queue.push(gcode);
            this.socket.emit("gCodeOutput", gcode + '\n');
        }
    }

    display() {
        noFill();
        this.drawnShapes.forEach(shape => {
            if (shape.type === 'circle') {
                ellipse(shape.x, shape.y, shape.diameter, shape.diameter);
                if (shape.fill) {
                    let radius = shape.diameter / 2;
                    for (let yy = shape.y - radius; yy <= shape.y + radius; yy += shape.fillGap) {
                        let innerValue = radius * radius - ((yy - shape.y) * (yy - shape.y));
                        if (innerValue >= 0) { // Valid horizontal line within the circle
                            let x1 = shape.x - Math.sqrt(innerValue);
                            let x2 = shape.x + Math.sqrt(innerValue);
                            line(x1, yy, x2, yy); // Draw fill line
                        }
                    }
                }
            } else if (shape.type === 'rectangle') {
                push();
    
                // Translate to the center of the rectangle
                translate(shape.x, shape.y);

                // Apply negative rotation to match G-code rotation
                rotate(radians(-(shape.rotation || 0)));

                // Draw the rectangle outline
                rectMode(CENTER);
                rect(0, 0, shape.width, shape.height);

                // Draw the fill lines if 'fill' is enabled
                if (shape.fill) {
                    let fillGap = shape.fillGap || 5; // Default fill gap if not specified
                    let halfWidth = shape.width / 2;
                    let halfHeight = shape.height / 2;

                    for (let yy = -halfHeight; yy <= halfHeight; yy += fillGap) {
                        let x1 = -halfWidth; // Left edge relative to the center
                        let x2 = halfWidth;  // Right edge relative to the center
                        line(x1, yy, x2, yy); // Draw a horizontal fill line
                    }
                }

                pop(); // Restore the previous drawing state
            } else if (shape.type === 'arc') {
                push(); // Save the current drawing state

                // Translate to the center of the arc
                translate(shape.x, shape.y);

                // Apply negative rotation to match G-code rotation
                rotate(radians(-(shape.angle || 0)));

                // Draw the arc relative to the center
                noFill();
                arc(0, 0, shape.width, shape.height, shape.start, shape.stop);

                pop(); // Restore the previous drawing state
            } else if (shape.type === 'line') {
                push(); // Save the current drawing state

                // Calculate the center of the line
                let centerX = (shape.x1 + shape.x2) / 2;
                let centerY = (shape.y1 + shape.y2) / 2;

                // Translate to the center and apply the NEGATIVE rotation to match G-code
                translate(centerX, centerY);
                rotate(radians(-(shape.angle || 0))); // Apply negative rotation

                // Draw the line relative to the center
                let halfX = (shape.x2 - shape.x1) / 2;
                let halfY = (shape.y2 - shape.y1) / 2;
                line(-halfX, -halfY, halfX, halfY);

                pop(); // Restore the previous drawing state
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

                for (let yy = minY; yy <= maxY; yy += shape.fillGap) {
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
                push(); // Save the current drawing state

                // Translate to the center of the ellipse
                translate(shape.x, shape.y);

                // Apply negative rotation to match G-code rotation
                rotate(radians(-(shape.angle || 0)));

                noFill();
                ellipse(0, 0, shape.width, shape.height);

                // Simulate the fill if enabled
                if (shape.fill) {
                    let r_w = shape.width / 2; // Horizontal radius
                    let r_h = shape.height / 2; // Vertical radius

                    for (let yy = -r_h; yy <= r_h; yy += shape.fillGap) {
                        let xOffset = r_w * Math.sqrt(1 - Math.pow(yy / r_h, 2));
                        if (!isNaN(xOffset)) { // Ensure valid offset calculation
                            let x1 = -xOffset;
                            let x2 = xOffset;
                            line(x1, yy, x2, yy); // Draw the fill line relative to the center
                        }
                    }
                }

                pop(); // Restore the previous drawing state
            } else if (shape.type === 'point') {
                point(shape.x, shape.y);
            }
        });
    }

    circle(x, y, d, fill=true) {
        this.drawnShapes.push({ type: 'circle', x: x, y: y, diameter: d, fill: fill, fillGap: this.fillGap });
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

        // Lift the tool after completing the circle outline
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);

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
        console.log(gcode.join("\n"));
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    line(x1, y1, x2, y2, angle = 0) {
        this.drawnShapes.push({ type: 'line', x1: x1, y1: y1, x2: x2, y2: y2, angle: angle });
    
        // Convert pixels to millimeters
        let mmX1 = this.pageWidth - x1 * this.pixelToMMRatio;
        let mmY1 = y1 * this.pixelToMMRatio;
        let mmX2 = this.pageWidth - x2 * this.pixelToMMRatio;
        let mmY2 = y2 * this.pixelToMMRatio;
    
        // Apply rotation transformation
        let centerX = (mmX1 + mmX2) / 2;
        let centerY = (mmY1 + mmY2) / 2;
    
        let rotatedStart = this.rotatePoint(mmX1, mmY1, centerX, centerY, angle);
        let rotatedEnd = this.rotatePoint(mmX2, mmY2, centerX, centerY, angle);
    
        this.lineToGCode(rotatedStart.x, rotatedStart.y, rotatedEnd.x, rotatedEnd.y);
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
        
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }
    
    // Helper function to rotate a point around a center by a given angle
    rotatePoint(x, y, centerX, centerY, angle) {
        let radians = angle * (Math.PI / 180); // Convert degrees to radians
        let cosA = Math.cos(radians);
        let sinA = Math.sin(radians);
    
        let dx = x - centerX;
        let dy = y - centerY;
    
        return {
            x: centerX + (dx * cosA - dy * sinA),
            y: centerY + (dx * sinA + dy * cosA)
        };
    }    

    rectangle(x, y, w, h, fill = true, rotation = 0) {
        this.drawnShapes.push({ type: 'rectangle', x: x, y: y, width: w, height: h, fill: fill, rotation: rotation });
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.rectangleToGCode(mmX, mmY, mmW, mmH, fill, rotation);
    }    

    rectangleToGCode(x, y, w, h, fill, rotation = 0) {
        let gcode = ["G90 ; Absolute positioning"];
    
        // Convert rotation to radians
        let rad = radians(rotation);
    
        // Calculate rectangle corner points with rotation around the center
        let halfW = w / 2;
        let halfH = h / 2;
    
        // Define the four corners relative to the center (x, y)
        let corners = [
            { dx: -halfW, dy: -halfH }, // Top-left
            { dx: halfW, dy: -halfH },  // Top-right
            { dx: halfW, dy: halfH },   // Bottom-right
            { dx: -halfW, dy: halfH }   // Bottom-left
        ];
    
        // Apply rotation to each corner
        let rotatedCorners = corners.map(corner => {
            return {
                x: x + corner.dx * cos(rad) - corner.dy * sin(rad),
                y: y + corner.dx * sin(rad) + corner.dy * cos(rad)
            };
        });
    
        // Move to the starting point (top-left corner)
        gcode.push(`G00 X${rotatedCorners[0].x.toFixed(3)} Y${rotatedCorners[0].y.toFixed(3)} F${this.feedRate} ; Move to rect start`);
        gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
    
        // Draw edges connecting the corners
        for (let i = 1; i < rotatedCorners.length; i++) {
            gcode.push(`G01 X${rotatedCorners[i].x.toFixed(3)} Y${rotatedCorners[i].y.toFixed(3)} F${this.feedRate} ; Draw edge`);
        }
        // Close the rectangle by returning to the starting point
        gcode.push(`G01 X${rotatedCorners[0].x.toFixed(3)} Y${rotatedCorners[0].y.toFixed(3)} F${this.feedRate} ; Close rectangle`);
    
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
    
        // Generate fill lines if 'fill' is true
        if (fill) {
            let fillStep = this.fillGap;
            for (let yy = -halfH; yy <= halfH; yy += fillStep) {
                let startX = -halfW;
                let endX = halfW;
    
                // Rotate fill line endpoints
                let startXRot = x + startX * cos(rad) - yy * sin(rad);
                let startYRot = y + startX * sin(rad) + yy * cos(rad);
                let endXRot = x + endX * cos(rad) - yy * sin(rad);
                let endYRot = y + endX * sin(rad) + yy * cos(rad);
    
                gcode.push(`G00 X${startXRot.toFixed(3)} Y${startYRot.toFixed(3)} ; Move to fill start`);
                gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for filling`);
                gcode.push(`G01 X${endXRot.toFixed(3)} Y${endYRot.toFixed(3)} F${this.feedRate} ; Draw fill line`);
                gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after fill line`);
            }
        }
    
        gcode.push("M30 ; Program end and reset");
    
        // Output G-code to console
        console.log(gcode.join("\n"));
    
        // Send G-code to the plotter if enabled
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign G-code instruction to force "ok" message
        }
    }    

    arc(x, y, w, h, start, stop, angle = 0) {
        this.drawnShapes.push({ type: 'arc', x: x, y: y, width: w, height: h, start: start, stop: stop, angle: angle });
        
        // Apply x mirroring based on the plotter origin
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
    
        this.arcToGCode(mmX, mmY, mmW, mmH, start, stop, angle);
    }     

    normalizeAngle(angle) {
        return ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    }

    arcToGCode(x, y, w, h, start, stop, angle) {
        let r_w = w / 2; // Horizontal radius
        let r_h = h / 2; // Vertical radius
        let segments = 50; // Increased segments for higher precision
        let gcode = ["G90 ; Absolute positioning"];
    
        // Normalize angles to be within 0 to 2 * PI
        start = this.normalizeAngle(start);
        stop = this.normalizeAngle(stop);
    
        // Ensure the stop angle is greater than the start angle
        if (stop < start) stop += 2 * Math.PI;
    
        // Calculate the starting point with rotation
        let startX = x - r_w * Math.cos(start);
        let startY = y + r_h * Math.sin(start);
    
        // Apply rotation transformation to the start point
        let rotatedStart = this.applyRotation(startX, startY, x, y, angle);
        gcode.push(`G00 X${rotatedStart.x.toFixed(3)} Y${rotatedStart.y.toFixed(3)} F${this.feedRate} ; Move to start of arc`);
        gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
    
        let angleIncrement = (stop - start) / segments;
    
        for (let i = 1; i <= segments; i++) {
            let currentAngle = start + i * angleIncrement;
            let xPos = x - r_w * Math.cos(currentAngle);
            let yPos = y + r_h * Math.sin(currentAngle);
    
            // Apply rotation to each segment point
            let rotatedPoint = this.applyRotation(xPos, yPos, x, y, angle);
            gcode.push(`G01 X${rotatedPoint.x.toFixed(3)} Y${rotatedPoint.y.toFixed(3)} F${this.feedRate} ; Draw arc segment`);
        }
    
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`, "M30 ; Program end and reset");
    
        console.log(`Generated G-code for Arc:\n${gcode.join("\n")}`);
    
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign G-code instruction to force "ok" message
        }
    }
         
    
    applyRotation(x, y, centerX, centerY, angle) {
        let radiansAngle = radians(angle);
        let cosA = Math.cos(radiansAngle);
        let sinA = Math.sin(radiansAngle);
        let dx = x - centerX;
        let dy = y - centerY;
    
        return {
            x: centerX + (dx * cosA - dy * sinA),
            y: centerY + (dx * sinA + dy * cosA)
        };
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
        shape.fillGap = this.fillGap; // Assign the current fillGap to the shape
        this.generateGCodeForCustomShape(shape.vertices, close === CLOSE, fill, shape.fillGap);
    }

    generateGCodeForCustomShape(vertices, close, fill = true, fillGap) {
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
            for (let yy = minY; yy <= maxY; yy += fillGap) {
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
        console.log(gcode.join("\n"));
        
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
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

    ellipse(x, y, w, h, fill = true, angle = 0) {
        this.drawnShapes.push({ type: 'ellipse', x: x, y: y, width: w, height: h, fill: fill, fillGap: this.fillGap, angle: angle });
        let mmX = this.pageWidth - x * this.pixelToMMRatio;
        let mmY = y * this.pixelToMMRatio;
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.ellipseToGCode(mmX, mmY, mmW, mmH, fill, angle);
    }    

    ellipseToGCode(x, y, w, h, fill, angle) {
        let r_w = w / 2;
        let r_h = h / 2;
        let segments = 36;
        let gcode = ["G90 ; Absolute positioning"];
    
        // Calculate the starting point with rotation
        let startX = x + r_w;
        let startY = y;
        let rotatedStart = this.applyRotation(startX, startY, x, y, angle);
    
        gcode.push(`G00 X${rotatedStart.x.toFixed(3)} Y${rotatedStart.y.toFixed(3)} F${this.feedRate} ; Move to start of ellipse`);
        gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
    
        let angleIncrement = (2 * Math.PI) / segments;
    
        for (let i = 0; i <= segments; i++) {
            let theta = i * angleIncrement;
            let xPos = x + r_w * Math.cos(theta);
            let yPos = y + r_h * Math.sin(theta);
    
            // Apply rotation to each point along the ellipse
            let rotatedPoint = this.applyRotation(xPos, yPos, x, y, angle);
            gcode.push(`G01 X${rotatedPoint.x.toFixed(3)} Y${rotatedPoint.y.toFixed(3)} F${this.feedRate} ; Draw ellipse segment`);
        }
    
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
    
        // Generate fill lines with rotation
        if (fill) {
            for (let yy = y - r_h; yy <= y + r_h; yy += this.fillGap) {
                let xOffset = r_w * Math.sqrt(1 - Math.pow((yy - y) / r_h, 2));
                if (!isNaN(xOffset)) {
                    let x1 = x - xOffset;
                    let x2 = x + xOffset;
    
                    // Apply rotation to fill lines
                    let rotatedStartFill = this.applyRotation(x1, yy, x, y, angle);
                    let rotatedEndFill = this.applyRotation(x2, yy, x, y, angle);
    
                    gcode.push(`G00 X${rotatedStartFill.x.toFixed(3)} Y${rotatedStartFill.y.toFixed(3)} ; Move to fill start`);
                    gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for filling`);
                    gcode.push(`G01 X${rotatedEndFill.x.toFixed(3)} Y${rotatedEndFill.y.toFixed(3)} F${this.feedRate} ; Fill line`);
                    gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after fill line`);
                }
            }
        }
    
        gcode.push("M30 ; Program end and reset");
        console.log(gcode.join("\n"));
    
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign G-code instruction to force "ok" message
        }
    }
    
    applyRotation(x, y, centerX, centerY, angle) {
        let radiansAngle = radians(angle);
        let cosA = Math.cos(radiansAngle);
        let sinA = Math.sin(radiansAngle);
        let dx = x - centerX;
        let dy = y - centerY;
    
        return {
            x: centerX + (dx * cosA - dy * sinA),
            y: centerY + (dx * sinA + dy * cosA)
        };
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
        
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
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