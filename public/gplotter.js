// testing reorientation - july 8 12:29

class GPlotter {
    constructor(pageWidth, pageHeight, screenWidth, enabled, margin_left = 0, margin_bottom = 0, margin_right = 0, margin_top = 0) {
        this.queue = []; // array to store gcode instructions
        this.feedRate = 3000;
        this.cuttingDepth = 6.25;
        this.drawnShapes = []; // array to store shapes drawn to canvas
        this.enabled = enabled; // option to not send gcode values via socket
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;

        //AK working through this - not finished
        this.margin_left = margin_right; //this is due to how the pen plotter's coordinate system works - larger y is lower down, and larger x is further left
        this.margin_bottom = margin_bottom;
        this.margin_right = margin_left; //this is due to how the pen plotter's coordinate system works
        this.margin_top = margin_top;
        this.drawingAreaWidth = this.pageWidth - margin_left - margin_right;
        this.drawingAreaHeight = this.pageHeight - margin_top - margin_bottom;
        this.x_min = this.margin_left;
        this.y_min = this.margin_top;
        this.x_max = this.pageWidth - this.margin_right;
        this.y_max = this.pageHeight - this.margin_bottom;

        this.screenWidth = screenWidth;
        this.canvasHeight = screenWidth / (pageWidth / pageHeight);
        this.pixelToMMRatio = pageWidth / screenWidth;
        this.socketConnected = false;
        this.fillGap = 5;
        this.lastEndPoint = null; // Track the endpoint within the class

        // When true, output is remapped to match the classroom's Inkscape workflow:
        // X mirrored, Y negated (see mapX/mapY for the derivation). Off by default
        // to preserve the currently-tested native/raw coordinate behavior.
        this.matchInkscapeOrientation = true;

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

         // Create a Draw Border Button
        this.drawBorderButton = createButton('Draw Border');
        this.drawBorderButton.position(this.screenWidth + 15, 235);
        this.drawBorderButton.mousePressed(() => this.drawBorder());

        // Create a Lift Pen Button
        this.liftPenButton = createButton('Lift Pen');
        this.liftPenButton.position(this.screenWidth + 15, 305);
        this.liftPenButton.mousePressed(() => this.liftPen());

        // Lift and Drop Pen Button
        this.liftDropButton = createButton('Lift and Drop Pen');
        this.liftDropButton.position(this.screenWidth+15, 270); // Adjust position if needed
        this.liftDropButton.mousePressed(() => this.LiftandDropPen());

        // Create Clear Queue button
        this.clearQueueButton = createButton('Clear Queue (Emergency Stop)');
        this.clearQueueButton.position(screenWidth+15, 200);
        this.clearQueueButton.mousePressed(() => {
            this.queue = []; // clear the queue
            this.liftPen();
            this.enabled = false;
            let enabledCheckbox = select("#enabled");
            enabledCheckbox.checked(false);
        });

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

            this.socket.on('portConnected', (data) => {
                this.connectedPort = data;
                this.connectionStatusLabel.html('Connected to ' + data);
                this.connectButton.html('Disconnect'); // Update button text
            });

            this.socket.on('connect_timeout', () => {
                console.error('Connection timed out');
                this.serverUnavailable = true;
                this.updatePortsDropdown([]);
            });

            this.socket.on('disconnect', (reason) => {
                console.warn(`Disconnected from server. Reason: ${reason}`);
                this.connectionStatusLabel.html('Not connected');
                this.connectButton.html('Connect');
                this.connectedPort = null;
            });

            // Fetch available ports from the server
            //this.socket.emit('getPorts');
        }
    }

    // Converts a p5.js pixel X coordinate to a plotter X coordinate in mm.
    // X is never flipped/mirrored - matchInkscapeOrientation only affects Y.
    mapX(xPixel) {
        return xPixel * this.pixelToMMRatio;
    }

    // Converts a p5.js pixel Y coordinate to a plotter Y coordinate in mm.
    // When matchInkscapeOrientation is on, Y is negated: the machine is zeroed at
    // the opposite end of the Y axis for the classroom's Inkscape workflow, which
    // reverses the Y direction relative to the native/raw behavior.
    mapY(yPixel) {
        return this.matchInkscapeOrientation
            ? -(yPixel * this.pixelToMMRatio)
            : yPixel * this.pixelToMMRatio;
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
        let checkbox = select("#enabled");
        if (checkbox.checked() === true) {
            if (this.socketConnected === true && this.connectedPort) {
                this.enabled = true;
                const gcode = "G92 X0 Y0 Z0 ;";
                this.queue.push(gcode);
                this.socket.emit("gCodeOutput", gcode + "\n");
            } else {
                checkbox.checked(false);
                console.log("cannot enable plotter functions");
            }
        } else {
            this.enabled = false;
            checkbox.checked(false);
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
            this.connectionStatusLabel.html('No server connection');
            return;
        }
        if (selectedPort === 'Select Port' || selectedPort === 'No ports available') {
            this.connectionStatusLabel.html('Please select a valid port');
            return;
        }

        // Emit the selected port to the server
        this.socket.emit('portSelect', selectedPort, (response) => {
            if (response.success) {
                this.connectedPort = selectedPort;
                this.connectionStatusLabel.html('Connected to ' + selectedPort);
                this.connectButton.html('Disconnect'); // Update button text
            } else {
                this.connectionStatusLabel.html('Failed to connect: ' + response.error);
            }
        });
    }

    disconnectFromPort() {
        if (!this.connectedPort) return;

        // Emit a custom 'disconnectPort' event to the server
        this.socket.emit('disconnectPort', (response) => {
            if (response.success) {
                this.connectionStatusLabel.html('Disconnected');
                this.connectButton.html('Connect'); // Update button text
                this.connectedPort = null;
            } else {
                this.connectionStatusLabel.html('Failed to disconnect: ' + response.error);
            }
        });
    }

    fetchPorts() {
        if (this.socketConnected) {
            this.socket.emit('getPorts');
        }
    }

    updateFeedRate() {
        const newFeedRate = parseInt(this.feedRateInput.value());
        if (!isNaN(newFeedRate) && newFeedRate > 0) {
            this.feedRate = newFeedRate;
        } else {
            this.feedRateInput.value(this.feedRate.toString()); // Reset invalid input
        }
    }

    updateCuttingDepth() {
        const newCuttingDepth = parseFloat(this.cuttingDepthInput.value());
        if (!isNaN(newCuttingDepth) && newCuttingDepth > 0) {
            this.cuttingDepth = newCuttingDepth;
        } else {
            this.cuttingDepthInput.value(this.cuttingDepth.toString()); // Reset invalid input
        }
    }

    updateFillGap() {
        const newFillGap = parseFloat(this.fillGapInput.value());
        if (!isNaN(newFillGap) && newFillGap > 0) {
            this.fillGap = newFillGap;
            console.log("Updated Fill Gap:", this.fillGap);
        } else {
            this.fillGapInput.value(this.fillGap.toString()); // Reset invalid input
        }
    }

    setNewZero() {
        const gcode = "G92 X0 Y0 Z0 ;";
        console.log(gcode);

        if (this.enabled) {
            this.queue.push(gcode);
            this.socket.emit("gCodeOutput", gcode + "\n");
        }
    }

    returnToZero(shouldLiftPenFirst = true) {
        if (this.enabled) {
            // First lift the pen
            if (shouldLiftPenFirst)
                this.queue.push(`G00 Z0 F${this.feedRate} ; Lift tool before moving to zero`);

            // Then move to (0,0)
            this.queue.push(`G00 X0 Y0 ; Move to home position`);

            // Important: Emit benign G21 to trigger the next queued move
            this.socket.emit("gCodeOutput", "G21\n");
        }
    }

    drawBorder() {
        const maxX = this.drawingAreaWidth;
        const maxY = this.drawingAreaHeight;

        console.log("Drawing border...");
        this.socket.emit("gCodeOutput", "G00 Z0\n");

        if (this.enabled) {
            // FIRST: lift and move to (0,0)
            this.queue.push(`G00 Z0 F${this.feedRate} ; Lift pen`);
            this.queue.push(`G00 X${this.x_min.toFixed(3)} Y${this.y_min.toFixed(3)} F${this.feedRate} ; Rapid move to top-left`);
            // SECOND: drop the pen down BEFORE drawing
            this.queue.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool to start drawing border`);

            // Now DRAW manually by G1 moves, instead of using this.line()
            this.queue.push(`G01 X${this.x_max.toFixed(3)} Y${this.y_min.toFixed(3)} F${this.feedRate} ; Top edge`);
            this.queue.push(`G01 X${this.x_max.toFixed(3)} Y${this.y_max.toFixed(3)} F${this.feedRate} ; Right edge`);
            this.queue.push(`G01 X${this.x_min.toFixed(3)} Y${this.y_max.toFixed(3)} F${this.feedRate} ; Bottom edge`);
            this.queue.push(`G01 X${this.x_min.toFixed(3)} Y${this.y_min.toFixed(3)} F${this.feedRate} ; Left edge, close`);

            // Finally lift pen and return home
            this.queue.push(`G00 Z0 F${this.feedRate} ; Lift pen after border`);
            this.queue.push("G00 X0 Y0 Z0 ; Return to zero");
        }
    }

    liftPen() {
        if (!this.enabled) {
            console.warn("Plotter not enabled.");
            return;
        }

        console.log("Lifting pen manually...");
        this.socket.emit("gCodeOutput", "G00 Z0\n");
    }

    LiftandDropPen() {
        if (!this.enabled) {
            console.warn("Plotter not enabled.");
            return;
        }

        console.log("Lifting and lowering pen...");

        // Lift the pen
        this.socket.emit("gCodeOutput", "G00 Z0\n");
        this.socket.emit("gCodeOutput", `G01 Z${this.cuttingDepth} F${this.feedRate}\n`);
    }

    dropPen() {
        if (!this.enabled) {
            console.warn("Plotter not enabled.");
            return;
        }

        console.log("Lowering pen...");

        this.socket.emit("gCodeOutput", `G01 Z${this.cuttingDepth} F${this.feedRate}\n`);
    }

    sendStatusQuery() {
        this.socket.emit("gCodeOutput", "?");
    }

    display() {
        noFill();
        this.drawnShapes.forEach((shape) => {
            if (shape.type === 'circle') {
                ellipse(shape.x, shape.y, shape.diameter, shape.diameter);
                if (shape.fill) {
                    let radius = shape.diameter / 2;
                    for (let yy = shape.y - radius; yy <= shape.y + radius; yy += shape.fillGap) {
                        let innerValue = radius * radius - (yy - shape.y) * (yy - shape.y);
                        if (innerValue >= 0) {
                            // Valid horizontal line within the circle
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
                rotate(radians(-(shape.angle || 0)));

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
                        let x2 = halfWidth; // Right edge relative to the center
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
                        if (!isNaN(xOffset)) {
                            // Ensure valid offset calculation
                            let x1 = -xOffset;
                            let x2 = xOffset;
                            line(x1, yy, x2, yy); // Draw the fill line relative to the center
                        }
                    }
                }

                pop(); // Restore the previous drawing state
            } else if (shape.type === 'point') {
                stroke(0);
                point(shape.x, shape.y);
            }
        });

        this.drawMarginBox();
    }

    drawMarginBox() {
        //AK part of the margin work
        //Note - these "margins" simply cover parts of the drawing - they do not stop the drawing
        // margin_top/bottom/left/right and y_max are stored in mm, so convert to screen pixels
        // before drawing - otherwise this only looks correct when pixelToMMRatio happens to be 1.
        let marginTopPx = this.margin_top / this.pixelToMMRatio;
        let marginBottomPx = this.margin_bottom / this.pixelToMMRatio;
        let marginLeftPx = this.margin_left / this.pixelToMMRatio;
        let marginRightPx = this.margin_right / this.pixelToMMRatio;
        let yMaxPx = this.y_max / this.pixelToMMRatio;

        noStroke();
        fill(240);
        //top rectangle margin
        rect(0, 0, this.screenWidth, marginTopPx);
        //bottom rectangle margin
        rect(0, yMaxPx, this.screenWidth, marginBottomPx);
        rect(0, 0, marginRightPx, this.canvasHeight);
        rect(this.screenWidth - marginLeftPx, 0, marginLeftPx, this.canvasHeight);
    }

    circle(x, y, d, fill) {
        this.drawnShapes.push({
            type: 'circle',
            x: x,
            y: y,
            diameter: d,
            fill: fill,
            fillGap: this.fillGap
        });
        let mmX = this.mapX(x);
        let mmY = this.mapY(y);
        let mmD = d * this.pixelToMMRatio;
        this.circleToGCode(mmX, mmY, mmD, fill);
    }

    canDraw(x = this.marginLeft, y = this.marginTop) {
        //check if x or y are outside the margins
        // X's valid range is the same regardless of orientation (mirroring reflects
        // within [0, pageWidth], it doesn't change the range). Y's valid range flips
        // sign when matchInkscapeOrientation negates Y (see mapY).
        let yMin = this.matchInkscapeOrientation ? -(this.pageHeight - this.margin_bottom) : this.margin_top;
        let yMax = this.matchInkscapeOrientation ? -this.margin_top : this.pageHeight - this.margin_bottom;
        if (x <= this.margin_left || x >= this.pageWidth - this.margin_right ||
            y <= yMin || y >= yMax)
            return false;
        else return true;
    }

    interpolateLine(x1, y1, x2, y2) {
        // Walk from (x1,y1) to (x2,y2) in equal steps, stepping X and Y
        // independently (no slope/division), so vertical lines (dx=0, e.g. a
        // rectangle's left/right edges) don't produce a divide-by-zero -> NaN/Infinity
        // that would otherwise get embedded in the G-code and trigger a Grbl error.
        let steps = 100; // More steps for better accuracy
        let xStep = (x2 - x1) / steps;
        let yStep = (y2 - y1) / steps;

        let newX1, newY1, newX2, newY2;
        let couldDrawPrevPoint = false;
        if (this.canDraw(x1, y1)) {
            newX1 = x1;
            newY1 = y1;
            couldDrawPrevPoint = true;
        }

        let currX = x1;
        let currY = y1;
        for (let i = 1; i <= steps; i++) {
            currX += xStep;
            currY += yStep;
            let canDrawCurr = this.canDraw(currX, currY);
            if (canDrawCurr && !couldDrawPrevPoint) {
                newX1 = currX;
                newY1 = currY;
            }
            if (!canDrawCurr && couldDrawPrevPoint) {
                newX2 = currX;
                newY2 = currY;
            }
            couldDrawPrevPoint = canDrawCurr;
        }

        if (this.canDraw(x2, y2)) {
            newX2 = x2;
            newY2 = y2;
        }

        let retArray = [newX1, newY1, newX2, newY2];
        return retArray;
    }

    circleToGCode(x, y, d, fill = false) {
        let radius = d / 2;
        let gcode = ["G90 ; Absolute positioning"];

        // Segmented approximation with a fixed segment count (matches gplotter.js).
        // Native G02/G03 arcs were tried here but this controller (Grbl 1.1h
        // DrawCore V2.13) silently no-ops arc moves - accepts them with "ok" but
        // never executes the motion - so arcs aren't usable on this hardware.
        // Keeping the segment count fixed rather than scaling with radius is what
        // actually cut down the segment-count-correlated Y drift.
        let segments = 36;
        let firstCanDrawSegment = 0;

        for (let i = 0; i <= segments; i++) {
            let angle = (i * 2 * Math.PI) / segments;
            let xPos = x + radius * Math.cos(angle);
            let yPos = y + radius * Math.sin(angle);

            if (this.canDraw(xPos, yPos)) {
                if (firstCanDrawSegment == 0) {
                    gcode.push(`G00 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Move to start of circle`);
                    gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
                    firstCanDrawSegment = 1;
                }
                gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Draw circle segment`);
            } else {
                if (firstCanDrawSegment == 1) {
                    gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
                    firstCanDrawSegment = 0; // allow re-entry to lower the pen again
                }
            }
        }
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
        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
        console.log(gcode.join("\n"));
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    line(x1, y1, x2, y2, angle = 0, liftPenBefore = true, liftPenAfter = true, isFreeDraw = false) {
        this.drawnShapes.push({
            type: 'line',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            angle: angle
        });

        // Convert pixels to millimeters
        let mmX1 = this.mapX(x1);
        let mmY1 = this.mapY(y1);
        let mmX2 = this.mapX(x2);
        let mmY2 = this.mapY(y2);

        // Apply rotation transformation
        let centerX = (mmX1 + mmX2) / 2;
        let centerY = (mmY1 + mmY2) / 2;

        let rotatedStart = this.rotatePoint(mmX1, mmY1, centerX, centerY, angle);
        let rotatedEnd = this.rotatePoint(mmX2, mmY2, centerX, centerY, angle);

        this.lineToGCode(rotatedStart.x, rotatedStart.y, rotatedEnd.x, rotatedEnd.y, liftPenBefore, liftPenAfter, isFreeDraw);
    }

    lineToGCode(x1, y1, x2, y2, liftPenBefore, liftPenAfter, isFreeDraw) {
        let gcode = ["G90 ; Absolute positioning"];

        // Always lift and move to the starting point
        if (liftPenBefore) {
            gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool before moving`);
        }

        //AK margin work
        if (this.canDraw(x1, y1) && this.canDraw(x2, y2)) {
            if (liftPenBefore) {
                gcode.push(`G00 X${x1.toFixed(3)} Y${y1.toFixed(3)} F${this.feedRate} ; Rapid move to start`);
                gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
            }

            // Draw the line
            gcode.push(`G01 X${x2.toFixed(3)} Y${y2.toFixed(3)} F${this.feedRate} ; Draw line to endpoint`);
        } else if (!isFreeDraw) {
            //find point on line that cuts off and draw as close to the edge as we can
            let pointArray = this.interpolateLine(x1, y1, x2, y2);
            x1 = pointArray[0];
            y1 = pointArray[1];
            x2 = pointArray[2];
            y2 = pointArray[3];
            gcode.push(`G00 X${x1.toFixed(3)} Y${y1.toFixed(3)} F${this.feedRate} ; Rapid move to start`);
            gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
            gcode.push(`G01 X${x2.toFixed(3)} Y${y2.toFixed(3)} F${this.feedRate} ; Draw line to endpoint`);
            gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
        } else {
            //ie this is a free draw line segment
            gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
        }
        // LIFT after drawing
        if (liftPenAfter)
            gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after drawing`);

        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction
        }
    }

    rotatePoint(x, y, centerX, centerY, angle) {
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

    rectangle(x, y, w, h, fill = false, angle = 0) {
        this.drawnShapes.push({
            type: 'rectangle',
            x: x,
            y: y,
            width: w,
            height: h,
            fill: fill,
            angle: angle
        });
        let mmX = this.mapX(x);
        let mmY = this.mapY(y);
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.rectangleToGCode(mmX, mmY, mmW, mmH, fill, angle);
    }

    rectangleToGCode(x, y, w, h, fill, angle = 0) {
        let gcode = ["G90 ; Absolute positioning"];

        // Convert angle to radians
        let rad = radians(angle);

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
        // Close the loop back to the first corner
        rotatedCorners.push(rotatedCorners[0]);

        // Draw edges connecting the corners, clipping each edge against the margins.
        // Each edge is repositioned to explicitly before drawing rather than assuming
        // pen continuity from the previous edge - clipping can move the start point of
        // an edge to somewhere other than where the previous edge's draw ended, and
        // chaining G01 moves across that gap silently drew a stray diagonal line instead
        // of lifting and re-homing first.
        for (let i = 1; i < rotatedCorners.length; i++) {
            let p1 = rotatedCorners[i - 1];
            let p2 = rotatedCorners[i];
            let x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;

            if (!(this.canDraw(x1, y1) && this.canDraw(x2, y2))) {
                // Edge fully or partially outside the margins - clip to the drawable portion
                let pointArray = this.interpolateLine(x1, y1, x2, y2);
                x1 = pointArray[0];
                y1 = pointArray[1];
                x2 = pointArray[2];
                y2 = pointArray[3];
                if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
                    continue; // entire edge is outside the drawable area
                }
            }

            gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool before moving`);
            gcode.push(`G00 X${x1.toFixed(3)} Y${y1.toFixed(3)} F${this.feedRate} ; Move to edge start`);
            gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
            gcode.push(`G01 X${x2.toFixed(3)} Y${y2.toFixed(3)} F${this.feedRate} ; Draw edge`);
        }

        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);

        // Generate fill lines if 'fill' is true, clipping each line against the margins
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

                let fx1 = startXRot, fy1 = startYRot, fx2 = endXRot, fy2 = endYRot;
                if (!this.canDraw(fx1, fy1) || !this.canDraw(fx2, fy2)) {
                    let pointArray = this.interpolateLine(fx1, fy1, fx2, fy2);
                    fx1 = pointArray[0];
                    fy1 = pointArray[1];
                    fx2 = pointArray[2];
                    fy2 = pointArray[3];
                    if (fx1 === undefined || fy1 === undefined || fx2 === undefined || fy2 === undefined) {
                        continue; // entire fill line is outside the drawable area
                    }
                }

                gcode.push(`G00 X${fx1.toFixed(3)} Y${fy1.toFixed(3)} ; Move to fill start`);
                gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for filling`);
                gcode.push(`G01 X${fx2.toFixed(3)} Y${fy2.toFixed(3)} F${this.feedRate} ; Draw fill line`);
                gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after fill line`);
            }
        }


        // Output G-code to console
        console.log(gcode.join("\n"));

        // Send G-code to the plotter if enabled
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign G-code instruction to force "ok" message
        }
    }

    arc(x, y, w, h, start, stop, angle = 0) {
        this.drawnShapes.push({
            type: 'arc',
            x: x,
            y: y,
            width: w,
            height: h,
            start: start,
            stop: stop,
            angle: angle
        });

        // Apply x mirroring based on the plotter origin
        let mmX = this.mapX(x);
        let mmY = this.mapY(y);
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;

        this.arcToGCode(mmX, mmY, mmW, mmH, start, stop, angle);
    }

    normalizeAngle(angle) {
        return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    }

    arcToGCode(x, y, w, h, start, stop, angle) {
        let r_w = w / 2; // Horizontal radius
        let r_h = h / 2; // Vertical radius
        let segments = 50; // Increased segments for higher precision
        let gcode = ["G90 ; Absolute positioning"];
        let firstCanDrawSegment = 0;
        // Normalize angles to be within 0 to 2 * PI
        start = this.normalizeAngle(start);
        stop = this.normalizeAngle(stop);

        // Ensure the stop angle is greater than the start angle
        if (stop < start) stop += 2 * Math.PI;

        let angleIncrement = (stop - start) / segments;

        for (let i = 0; i <= segments; i++) {
            let currentAngle = start + i * angleIncrement;
            let xPos = x - r_w * Math.cos(currentAngle);
            let yPos = y + r_h * Math.sin(currentAngle);

            // Apply rotation to each segment point
            let rotatedPoint = this.applyRotation(xPos, yPos, x, y, angle);
            xPos = rotatedPoint.x;
            yPos = rotatedPoint.y;

            if (this.canDraw(xPos, yPos)) {
                if (firstCanDrawSegment == 0) {
                    gcode.push(`G00 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Move to start of circle`);
                    gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
                    firstCanDrawSegment = 1;
                }
                gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Draw circle segment`);
            } else {
                if (firstCanDrawSegment == 1) {
                    gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
                    firstCanDrawSegment = 0; // allow re-entry to lower the pen again
                }
            }
        }

        gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);

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

    endShape(close = false, fill) {
        let shape = this.drawnShapes[this.drawnShapes.length - 1];
        shape.type = 'customShape';
        shape.isClosed = (close === CLOSE); // Set whether the shape should be closed based on `CLOSE`
        shape.fill = fill;
        shape.fillGap = this.fillGap; // Assign the current fillGap to the shape
        this.generateGCodeForCustomShape(shape.vertices, close === CLOSE, fill, shape.fillGap);
    }

    generateGCodeForCustomShape(vertices, close, fill, fillGap) {
        let gcode = ["G90 ; Absolute positioning"];
        if (vertices.length > 0) {
            // Move to the start of the shape
            let startX = this.mapX(vertices[0].x);
            let startY = this.mapY(vertices[0].y);
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

                        let mmX = this.mapX(x);
                        let mmY = this.mapY(y);
                        gcode.push(`G01 X${mmX.toFixed(3)} Y${mmY.toFixed(3)} F${this.feedRate} ; Draw curve segment`);
                    }
                } else {
                    // Draw straight line to next vertex
                    let x = this.mapX(vertices[i].x);
                    let y = this.mapY(vertices[i].y);
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
                // Calculate the bounding box of the shape (mapY may flip the axis, so re-sort after mapping)
                let mappedYs = [this.mapY(Math.min(...vertices.map(v => v.y))), this.mapY(Math.max(...vertices.map(v => v.y)))];
                let minY = Math.min(...mappedYs);
                let maxY = Math.max(...mappedYs);

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
                                    intersections.push(this.mapX(intersectX));
                                }
                            }
                        } else {
                            // Handle straight line segments
                            let y1 = this.mapY(v1.y);
                            let y2 = this.mapY(v2.y);
                            let x1 = this.mapX(v1.x);
                            let x2 = this.mapX(v2.x);

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
        } else {
            console.log("Not enough vertices to generate a shape");
        }
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

    ellipse(x, y, w, h, fill = false, angle = 0) {
        this.drawnShapes.push({
            type: 'ellipse',
            x: x,
            y: y,
            width: w,
            height: h,
            fill: fill,
            fillGap: this.fillGap,
            angle: angle
        });
        let mmX = this.mapX(x);
        let mmY = this.mapY(y);
        let mmW = w * this.pixelToMMRatio;
        let mmH = h * this.pixelToMMRatio;
        this.ellipseToGCode(mmX, mmY, mmW, mmH, fill, angle);
    }

    ellipseToGCode(x, y, w, h, fill, angle) {
        let r_w = w / 2;
        let r_h = h / 2;
        let segments = 36;
        let gcode = ["G90 ; Absolute positioning"];

        let angleIncrement = (2 * Math.PI) / segments;
        let firstCanDrawSegment = 0;

        for (let i = 0; i <= segments + 2; i++) {
            let theta = i * angleIncrement;
            let xPos = x + r_w * Math.cos(theta);
            let yPos = y + r_h * Math.sin(theta);

            // Apply rotation to each point along the ellipse
            let rotatedPoint = this.applyRotation(xPos, yPos, x, y, angle);
            xPos = rotatedPoint.x;
            yPos = rotatedPoint.y;
            if (this.canDraw(xPos, yPos)) {
                if (firstCanDrawSegment == 0) {
                    gcode.push(`G00 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Move to start of circle`);
                    gcode.push(`G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for cutting`);
                    firstCanDrawSegment = 1;
                }
                gcode.push(`G01 X${xPos.toFixed(3)} Y${yPos.toFixed(3)} F${this.feedRate} ; Draw circle segment`);
            } else {
                if (firstCanDrawSegment == 1) {
                    gcode.push(`G00 Z0 F${this.feedRate} ; Lift tool after cutting`);
                    firstCanDrawSegment = 0; // allow re-entry to lower the pen again
                }
            }
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

        console.log(gcode.join("\n"));

        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign G-code instruction to force "ok" message
        }
    }

    point(x, y) {
        this.drawnShapes.push({ type: 'point', x: x, y: y });
        point(x, y);
        let mmX = this.mapX(x);
        let mmY = this.mapY(y);
        if (this.canDraw(x, y)) this.pointToGCode(mmX, mmY);
    }

    pointToGCode(x, y) {
        let gcode = [
            "G90 ; Absolute positioning",
            `G00 X${x.toFixed(3)} Y${y.toFixed(3)} F${this.feedRate} ; Move to point`,
            `G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for marking point`,
            `G00 Z0 F${this.feedRate} ; Lift tool after marking`
        ];
        if (this.enabled) {
            this.queue = this.queue.concat(gcode);
            this.socket.emit("gCodeOutput", 'G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    pathCommands(pathStr, offsetX, offsetY, scale) {
        let instr = [];
        let mode = '';
        for (let token of pathStr.split(' ')) {
            if (token.charAt(0) === 'M' || token.charAt(0) === 'L') {
                mode = token.charAt(0);
                token = token.substr(1);
            }
            let [x, y] = token.split(',').map(Number);
            x = offsetX + x * scale;
            y = offsetY + y * scale;
            instr.push({ type: mode, x, y });
        }
        return instr;
    }

    pathCommandsForText(font, text, offsetX = 0, offsetY = 0, scale = 1) {
        let commands = [];
        let xOffset = 0;
        for (let i = 0; i < text.length; i++) {
            let charIndex = text.charCodeAt(i) - 33;
            if (charIndex >= 0 && font.chars[charIndex]) {
                let char = font.chars[charIndex];
                commands.push(...this.pathCommands(char.d, offsetX + xOffset, offsetY, scale));
                xOffset += parseInt(char.o) * scale * 2;
            } else {
                xOffset += 10 * scale;
            }
        }
        return commands;
    }

    drawHersheyText(commands) {
        let currentPath = [];

        for (let i = 0; i < commands.length; i++) {
            let cmd = commands[i];

            if (cmd.type === 'M') {
                if (currentPath.length > 0) {
                    this.beginShape();
                    currentPath.forEach(pt => this.vertex(pt.x, pt.y));
                    this.endShape(false, false);
                    currentPath = [];
                }
                currentPath.push({ x: cmd.x, y: cmd.y });

            } else if (cmd.type === 'L') {
                currentPath.push({ x: cmd.x, y: cmd.y });
            }
        }

        if (currentPath.length > 0) {
            this.beginShape();
            currentPath.forEach(pt => this.vertex(pt.x, pt.y));
            this.endShape(false, false);
        }
    }

    onMessage(message) {
        // this is where the queue is emptied and all gcode messages are output. Final destination for gcode!
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

        if (message.includes("MSG:Pgm End")) {
            console.log("Plotter completed a shape!");
        }
        if (message.includes("error:1")) {
            this.LiftandDropPen();
        }
    }
}
