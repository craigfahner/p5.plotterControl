class GPlotter {
    constructor(pageWidth, pageHeight, screenWidth) {
        this.queue = []; // array to store gcode instructions
        this.feedRate = 3000;
        this.cuttingDepth = 6.25;
        this.drawnShapes = []; // array to store shapes drawn to canvas
        this.enabled = true; // option to not send gcode values via 
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