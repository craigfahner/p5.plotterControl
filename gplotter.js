class GPlotter {
    constructor(pageWidth, pageHeight, screenWidth, enabled, margin_left = 0, margin_bottom = 0, margin_right = 0, margin_top = 0) {
        this.queue = []; // array to store gcode instructions
        this.feedRate = 3000;
        this.cuttingDepth = 6.25;
        this.drawnShapes = []; // array to store shapes drawn to canvas
        this.enabled = enabled; // option to not send gcode values via the serial port
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;

        this.margin_left = margin_left;
        this.margin_bottom = margin_bottom;
        this.margin_right = margin_right;
        this.margin_top = margin_top;
        this.recalculateMarginBounds();

        this.screenWidth = screenWidth;
        this.canvasHeight = screenWidth / (pageWidth / pageHeight);
        this.pixelToMMRatio = pageWidth / screenWidth;
        this.fillGap = 5;
        this.lastEndPoint = null; // Track the endpoint within the class

        // When true, output is remapped to match the classroom's Inkscape workflow:
        // X mirrored, Y negated (see mapX/mapY for the derivation). Off by default
        // to preserve the currently-tested native/raw coordinate behavior.
        this.matchInkscapeOrientation = true;

        this.demoMode = false;

        // Create Enable Checkbox to enable plotting
        this.enabledCheckbox = createCheckbox("Plotting Enabled", false);
        this.enabledCheckbox.position(screenWidth + 10, 10);
        this.enabledCheckbox.elt.querySelector('input').id = 'enabled';
        this.enabledCheckbox.changed(() => this.toggleEnabled());

        // Web Serial connection state (see connectToPort/disconnectFromPort). There's
        // no port picker here - navigator.serial.requestPort() shows the browser's
        // own native device chooser.
        this.webSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;
        this.serialPort = null;
        this.serialWriter = null;
        this.serialReader = null;
        this.serialReadableClosed = null;
        this.serialWritableClosed = null;
        this.serialReadBuffer = '';
        this.connectedPort = null; // truthy once connected, matches prior checks elsewhere

        // Create a connect button
        this.connectButton = createButton("Connect");
        this.connectButton.position(screenWidth + 15, 38);
        this.connectButton.mousePressed(() => this.toggleConnection());

        // Add a label to show connection status
        this.connectionStatusLabel = createP(this.webSerialSupported ? "Not connected to plotter" : "Web Serial not supported in this browser");
        this.connectionStatusLabel.position(screenWidth + 120, 23);

        if (this.webSerialSupported) {
            // Reflect a physical unplug/power-off even if the user never clicked Disconnect.
            navigator.serial.addEventListener('disconnect', (event) => {
                if (event.target === this.serialPort) {
                    this.handlePortDisconnected();
                }
            });
        } else {
            this.enabled = false;
        }

          // Add text input for feed rate
        createP("Feed Rate:").position(screenWidth + 15, 55);
        this.feedRateInput = createInput(this.feedRate.toString(), "number");
        this.feedRateInput.position(screenWidth + 120, 70);
        this.feedRateInput.size(80);
        this.feedRateInput.input(() => this.updateFeedRate());

        // Add text input for cutting depth
        createP("Z Depth:").position(screenWidth + 15, 85);
        this.cuttingDepthInput = createInput(this.cuttingDepth.toString(), "number");
        this.cuttingDepthInput.position(screenWidth + 120, 100);
        this.cuttingDepthInput.size(80);
        this.cuttingDepthInput.input(() => this.updateCuttingDepth());

        // Add text input for fill gap
        createP("Fill Gap:").position(screenWidth + 15, 115);
        this.fillGapInput = createInput(this.fillGap.toString(), "number");
        this.fillGapInput.position(screenWidth + 120, 130);
        this.fillGapInput.size(80);
        this.fillGapInput.input(() => this.updateFillGap());

        // Add text inputs for margins (top/bottom/left/right)
        createP("Margin Top:").position(screenWidth + 15, 145);
        this.marginTopInput = createInput(this.margin_top.toString(), "number");
        this.marginTopInput.position(screenWidth + 120, 160);
        this.marginTopInput.size(80);
        this.marginTopInput.input(() => this.updateMarginTop());

        createP("Margin Bottom:").position(screenWidth + 15, 175);
        this.marginBottomInput = createInput(this.margin_bottom.toString(), "number");
        this.marginBottomInput.position(screenWidth + 120, 190);
        this.marginBottomInput.size(80);
        this.marginBottomInput.input(() => this.updateMarginBottom());

        createP("Margin Left:").position(screenWidth + 15, 205);
        this.marginLeftInput = createInput(this.margin_left.toString(), "number");
        this.marginLeftInput.position(screenWidth + 120, 220);
        this.marginLeftInput.size(80);
        this.marginLeftInput.input(() => this.updateMarginLeft());

        createP("Margin Right:").position(screenWidth + 15, 235);
        this.marginRightInput = createInput(this.margin_right.toString(), "number");
        this.marginRightInput.position(screenWidth + 120, 250);
        this.marginRightInput.size(80);
        this.marginRightInput.input(() => this.updateMarginRight());

        // Create Save Settings button
        this.saveSettingsButton = createButton('Save Settings');
        this.saveSettingsButton.position(screenWidth + 15, 280);
        this.saveSettingsButton.mousePressed(() => this.saveSettings());

         // Create Set New Zero button
         this.setZeroButton = createButton('Set New Zero');
         this.setZeroButton.position(screenWidth + 15, 335);
         this.setZeroButton.mousePressed(() => this.setNewZero());

         // Create Return to Zero button
         this.returnZeroButton = createButton('Return to Zero');
         this.returnZeroButton.position(screenWidth + 125, 335); // Adjust position as needed
         this.returnZeroButton.mousePressed(() => this.returnToZero());

         // Create a Draw Border Button
        this.drawBorderButton = createButton('Draw Border');
        this.drawBorderButton.position(this.screenWidth + 15, 405);
        this.drawBorderButton.mousePressed(() => this.drawBorder());

        // Create a Lift Pen Button
        this.liftPenButton = createButton('Lift Pen');
        this.liftPenButton.position(this.screenWidth + 15, 475);
        this.liftPenButton.mousePressed(() => this.liftPen());

        // Create Demo Mode Checkbox
        this.demoModeCheckbox = createCheckbox("Demo Mode", false);
        this.demoModeCheckbox.position(this.screenWidth + 15, 530);
        this.demoModeCheckbox.elt.querySelector('input').id = 'demoMode';
        this.demoModeCheckbox.changed(() => this.toggleDemoMode());

        // Demo mode: column 1 - shape selector radio buttons
        this.demoShapeRadio = createRadio();
        this.demoShapeRadio.option('circle', 'Circle');
        this.demoShapeRadio.option('ellipse', 'Ellipse');
        this.demoShapeRadio.option('arc', 'Arc');
        this.demoShapeRadio.option('rectangle', 'Rectangle');
        this.demoShapeRadio.option('line', 'Line');
        this.demoShapeRadio.option('freeDraw', 'Free Draw');
        this.demoShapeRadio.option('text', 'Text');
        this.demoShapeRadio.selected('circle');
        this.demoShapeRadio.position(this.screenWidth + 15, 560);
        // p5's radio options render as inline spans by default - stack them into a list
        Array.from(this.demoShapeRadio.elt.children).forEach(child => child.style.display = 'block');
        this.demoShapeRadio.changed(() => this.updateDemoParamVisibility());

        // Demo mode: column 2 - per-shape parameter fields, positioned to the right
        // of the radio list. Only the group matching the selected radio is shown.
        const demoParamX = this.screenWidth + 180;
        const demoParamY = 560;

        this.demoCircleDiameterLabel = createP('Diameter:');
        this.demoCircleDiameterLabel.position(demoParamX, demoParamY);
        this.demoCircleDiameterInput = createInput('50', 'number');
        this.demoCircleDiameterInput.position(demoParamX + 90, demoParamY + 15);
        this.demoCircleDiameterInput.size(60);

        this.demoEllipseWidthLabel = createP('Width:');
        this.demoEllipseWidthLabel.position(demoParamX, demoParamY);
        this.demoEllipseWidthInput = createInput('50', 'number');
        this.demoEllipseWidthInput.position(demoParamX + 90, demoParamY + 15);
        this.demoEllipseWidthInput.size(60);

        this.demoEllipseHeightLabel = createP('Height:');
        this.demoEllipseHeightLabel.position(demoParamX, demoParamY + 30);
        this.demoEllipseHeightInput = createInput('30', 'number');
        this.demoEllipseHeightInput.position(demoParamX + 90, demoParamY + 45);
        this.demoEllipseHeightInput.size(60);

        this.demoArcWidthLabel = createP('Width:');
        this.demoArcWidthLabel.position(demoParamX, demoParamY);
        this.demoArcWidthInput = createInput('50', 'number');
        this.demoArcWidthInput.position(demoParamX + 90, demoParamY + 15);
        this.demoArcWidthInput.size(60);

        this.demoArcHeightLabel = createP('Height:');
        this.demoArcHeightLabel.position(demoParamX, demoParamY + 30);
        this.demoArcHeightInput = createInput('50', 'number');
        this.demoArcHeightInput.position(demoParamX + 90, demoParamY + 45);
        this.demoArcHeightInput.size(60);

        this.demoArcStartLabel = createP('Arc start angle (deg):');
        this.demoArcStartLabel.position(demoParamX, demoParamY + 60);
        this.demoArcStartInput = createInput('0', 'number');
        this.demoArcStartInput.position(demoParamX + 90, demoParamY + 75);
        this.demoArcStartInput.size(60);

        this.demoArcStopLabel = createP('Arc stop angle (deg):');
        this.demoArcStopLabel.position(demoParamX, demoParamY + 90);
        this.demoArcStopInput = createInput('180', 'number');
        this.demoArcStopInput.position(demoParamX + 90, demoParamY + 105);
        this.demoArcStopInput.size(60);

        this.demoRectWidthLabel = createP('Width:');
        this.demoRectWidthLabel.position(demoParamX, demoParamY);
        this.demoRectWidthInput = createInput('50', 'number');
        this.demoRectWidthInput.position(demoParamX + 90, demoParamY + 15);
        this.demoRectWidthInput.size(60);

        this.demoRectHeightLabel = createP('Height:');
        this.demoRectHeightLabel.position(demoParamX, demoParamY + 30);
        this.demoRectHeightInput = createInput('50', 'number');
        this.demoRectHeightInput.position(demoParamX + 90, demoParamY + 45);
        this.demoRectHeightInput.size(60);

        this.demoLineInstructions = createP('Click and drag; when the mouse is released, a line will appear between the mousedown and mouseup point.');
        this.demoLineInstructions.position(demoParamX, demoParamY);
        this.demoLineInstructions.style('width', '220px');

        this.demoTextLabel = createP('Text to draw:');
        this.demoTextLabel.position(demoParamX, demoParamY);
        this.demoTextInput = createInput('Hi', 'text');
        this.demoTextInput.position(demoParamX + 90, demoParamY + 15);
        this.demoTextInput.size(100);

        this.demoTextScaleLabel = createP('Scale:');
        this.demoTextScaleLabel.position(demoParamX, demoParamY + 30);
        this.demoTextScaleInput = createInput('0.5', 'number');
        this.demoTextScaleInput.position(demoParamX + 90, demoParamY + 45);
        this.demoTextScaleInput.size(60);

        // Groups of elements shown/hidden together based on the selected radio option.
        // Free Draw has no fields of its own, so it has no entry here.
        this.demoParamGroups = {
            circle: [this.demoCircleDiameterLabel, this.demoCircleDiameterInput],
            ellipse: [this.demoEllipseWidthLabel, this.demoEllipseWidthInput, this.demoEllipseHeightLabel, this.demoEllipseHeightInput],
            arc: [this.demoArcWidthLabel, this.demoArcWidthInput, this.demoArcHeightLabel, this.demoArcHeightInput, this.demoArcStartLabel, this.demoArcStartInput, this.demoArcStopLabel, this.demoArcStopInput],
            rectangle: [this.demoRectWidthLabel, this.demoRectWidthInput, this.demoRectHeightLabel, this.demoRectHeightInput],
            line: [this.demoLineInstructions],
            freeDraw: [],
            text: [this.demoTextLabel, this.demoTextInput, this.demoTextScaleLabel, this.demoTextScaleInput]
        };

        // Demo mode click/drag state (used by Line, and by circle/ellipse/arc/rectangle)
        this.demoDragStart = null;
        this.demoDragCurrent = null;

        // Public free-draw stroke state (see startFreeDraw/freeDrawTo/endFreeDraw).
        this.freeDrawLastPoint = null;

        // Demo mode: Free Draw "live" polling state. Drives the public free-draw
        // API from mouse events, polling on a fixed interval - decoupled from how
        // often the browser fires mousemove/mouseDragged - rather than on every
        // drag event, so the pen goes down immediately on press and a new segment
        // is added on each tick for as long as the mouse stays down.
        this.demoFreeDrawTimerId = null;
        this.demoFreeDrawPollMs = 50;

        this.updateDemoModeVisibility(); // demoMode starts false, so this hides everything above

        // Lift and Drop Pen Button
        this.liftDropButton = createButton('Lift and Drop Pen');
        this.liftDropButton.position(this.screenWidth+15, 440); // Adjust position if needed
        this.liftDropButton.mousePressed(() => this.LiftandDropPen());

        // Create Clear Queue button
        this.clearQueueButton = createButton('Clear Queue (Emergency Stop)');
        this.clearQueueButton.position(screenWidth+15, 370);
        this.clearQueueButton.mousePressed(() => {
            this.queue = []; // clear the queue
            this.liftPen();
            this.enabled = false;
            let enabledCheckbox = select("#enabled");
            enabledCheckbox.checked(false);
        });

        // Settings persist to localStorage now (see saveSettings/loadSettings)
        // instead of round-tripping through a server on connect.
        this.loadSettings();
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

    // mapY is linear (a pure negation, no offset), so it flips relative Y deltas
    // the same way it flips absolute Y positions. Shapes that compute a point as
    // "already-mapped center + a raw local Y offset" (e.g. an arc's r_h*sin(theta))
    // need to apply this same sign to that offset, or the local geometry stops
    // matching the global orientation flip. Symmetric shapes (full circle/ellipse)
    // never reveal this, since mirroring them vertically gives the same shape back -
    // but a partial arc does show it, as a flipped opening direction.
    mapYSign() {
        return this.matchInkscapeOrientation ? -1 : 1;
    }

    toggleEnabled() {
        let checkbox = select("#enabled");
        if (checkbox.checked() === true) {
            if (this.connectedPort) {
                this.enabled = true;
                const gcode = "G92 X0 Y0 Z0 ;";
                this.queue.push(gcode);
                this.writeToSerial(gcode + "\n");
            } else {
                checkbox.checked(false);
                console.log("cannot enable plotter functions");
            }
        } else {
            // Re-enabling later sends G92 X0 Y0 Z0, which redefines wherever the pen
            // currently is as the new zero - so if we don't return to the true zero
            // before disabling, re-enabling mid-drawing silently shifts the origin
            // to wherever the pen happened to be sitting when disabled.
            if (this.enabled) {
                this.returnToZero();
            }
            this.enabled = false;
            checkbox.checked(false);
        }
    }

    toggleDemoMode() {
        let checkbox = select("#demoMode");
        this.demoMode = checkbox.checked();
        this.updateDemoModeVisibility();
    }

    // Shows/hides the demo-mode UI (radio list + param panels) based on this.demoMode.
    updateDemoModeVisibility() {
        if (this.demoMode) {
            this.demoShapeRadio.show();
            this.updateDemoParamVisibility();
        } else {
            this.demoShapeRadio.hide();
            Object.values(this.demoParamGroups).flat().forEach(el => el.hide());
        }
    }

    // Shows only the parameter group matching the currently-selected demo shape.
    updateDemoParamVisibility() {
        const selected = this.demoShapeRadio.value();
        for (const [shape, elements] of Object.entries(this.demoParamGroups)) {
            elements.forEach(el => (this.demoMode && shape === selected) ? el.show() : el.hide());
        }
    }

    // Called by the sketch's mousePressed() when demoMode is active.
    // Circle/ellipse/arc/rectangle/line don't draw immediately - they record the
    // press location and are only actually plotted on release (see
    // handleDemoMouseReleased), sized either by the fields as listed (a plain
    // click, no drag) or by however far the mouse was dragged (handleDemoMouseDragged
    // updates the fields live as the drag progresses). The center point stays fixed
    // at the press location either way.
    handleDemoMousePressed(x, y) {
        const shape = this.demoShapeRadio.value();
        if (shape === 'text') {
            this.drawString(this.demoTextInput.value(), x, y, parseFloat(this.demoTextScaleInput.value()) || 0.5);
        } else if (shape === 'freeDraw') {
            this.startDemoFreeDrawLive(x, y);
        } else {
            this.demoDragStart = { x, y };
            this.demoDragCurrent = { x, y };
        }
    }

    // Called by the sketch's mouseDragged() when demoMode is active.
    handleDemoMouseDragged(x, y) {
        const shape = this.demoShapeRadio.value();
        this.demoDragCurrent = { x, y };

        // Free Draw's segments are added by the setInterval poll in
        // startDemoFreeDrawLive(), not by drag events - nothing to do here.
        if (shape === 'freeDraw') return;

        if (!this.demoDragStart) return;
        const dx = x - this.demoDragStart.x;
        const dy = y - this.demoDragStart.y;

        switch (shape) {
            case 'circle':
                this.demoCircleDiameterInput.value((2 * Math.sqrt(dx * dx + dy * dy)).toFixed(1));
                break;
            case 'ellipse':
                this.demoEllipseWidthInput.value((2 * Math.abs(dx)).toFixed(1));
                this.demoEllipseHeightInput.value((2 * Math.abs(dy)).toFixed(1));
                break;
            case 'arc':
                this.demoArcWidthInput.value((2 * Math.abs(dx)).toFixed(1));
                this.demoArcHeightInput.value((2 * Math.abs(dy)).toFixed(1));
                break;
            case 'rectangle':
                this.demoRectWidthInput.value((2 * Math.abs(dx)).toFixed(1));
                this.demoRectHeightInput.value((2 * Math.abs(dy)).toFixed(1));
                break;
            // 'line' needs no field updates - its endpoint is just demoDragCurrent
        }
    }

    // Called by the sketch's mouseReleased() when demoMode is active.
    handleDemoMouseReleased(x, y) {
        const shape = this.demoShapeRadio.value();
        if (this.demoDragStart) {
            const cx = this.demoDragStart.x;
            const cy = this.demoDragStart.y;
            switch (shape) {
                case 'circle':
                    this.circle(cx, cy, parseFloat(this.demoCircleDiameterInput.value()) || 0, false);
                    break;
                case 'ellipse':
                    this.ellipse(cx, cy, parseFloat(this.demoEllipseWidthInput.value()) || 0, parseFloat(this.demoEllipseHeightInput.value()) || 0, false);
                    break;
                case 'arc':
                    this.arc(
                        cx, cy,
                        parseFloat(this.demoArcWidthInput.value()) || 0,
                        parseFloat(this.demoArcHeightInput.value()) || 0,
                        radians(parseFloat(this.demoArcStartInput.value()) || 0),
                        radians(parseFloat(this.demoArcStopInput.value()) || 0),
                        0
                    );
                    break;
                case 'rectangle':
                    this.rectangle(cx, cy, parseFloat(this.demoRectWidthInput.value()) || 0, parseFloat(this.demoRectHeightInput.value()) || 0, false);
                    break;
                case 'line':
                    this.line(cx, cy, x, y, 0);
                    break;
            }
        }
        if (shape === 'freeDraw') {
            this.stopDemoFreeDrawLive();
        }

        this.demoDragStart = null;
        this.demoDragCurrent = null;
    }

    // ---- Public free-draw API ----
    // Lets any sketch draw a continuous, arbitrary-length stroke by feeding a
    // start point, a stream of points, and an end call - no polling/timer setup
    // required. Demo mode's "Free Draw" option is just a thin mouse-driven wrapper
    // around these same three methods (see startDemoFreeDrawLive below).
    //
    // Example:
    //   plotter.startFreeDraw(x0, y0);
    //   plotter.freeDrawTo(x1, y1);
    //   plotter.freeDrawTo(x2, y2);
    //   ...
    //   plotter.endFreeDraw();

    // Lowers the pen at (x, y) and begins a new free-draw stroke.
    startFreeDraw(x, y) {
        this.freeDrawLastPoint = { x, y };
        const mmX = this.mapX(x);
        const mmY = this.mapY(y);
        this.queueGCode([
            "G90 ; Absolute positioning",
            `G00 X${mmX.toFixed(3)} Y${mmY.toFixed(3)} F${this.feedRate} ; Move to free-draw start`,
            `G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool for free-draw`
        ]);
    }

    // Draws a continuous line segment from the last free-draw point to (x, y).
    // No-op if startFreeDraw() hasn't been called (or endFreeDraw() already ended
    // the stroke).
    freeDrawTo(x, y) {
        if (!this.freeDrawLastPoint) return;
        // Pen is already down from startFreeDraw()/the previous segment, so no
        // lift before or after - this keeps the whole stroke one continuous line.
        this.line(this.freeDrawLastPoint.x, this.freeDrawLastPoint.y, x, y, 0, false, false);
        this.freeDrawLastPoint = { x, y };
    }

    // Ends the current free-draw stroke and lifts the pen.
    endFreeDraw() {
        if (this.freeDrawLastPoint) {
            this.queueGCode([`G00 Z0 F${this.feedRate} ; Lift tool after free-draw`]);
        }
        this.freeDrawLastPoint = null;
    }

    // ---- Demo mode's mouse-driven wrapper around the free-draw API ----

    // Starts polling the mouse position on a fixed interval - decoupled from how
    // often the browser actually fires mousemove/mouseDragged events - feeding
    // each tick's position into freeDrawTo() for as long as the mouse stays down.
    startDemoFreeDrawLive(x, y) {
        this.stopDemoFreeDrawLive(); // clear any stray previous timer first
        this.startFreeDraw(x, y);

        this.demoFreeDrawTimerId = setInterval(() => {
            if (!mouseIsPressed) {
                // Safety net in case mouseReleased() didn't fire (e.g. released
                // outside the window).
                this.stopDemoFreeDrawLive();
                return;
            }
            this.freeDrawTo(mouseX, mouseY);
        }, this.demoFreeDrawPollMs);
    }

    // Stops the live free-draw polling timer (if running) and ends the stroke.
    stopDemoFreeDrawLive() {
        if (this.demoFreeDrawTimerId) {
            clearInterval(this.demoFreeDrawTimerId);
            this.demoFreeDrawTimerId = null;
        }
        this.endFreeDraw();
    }

    // Draws the live in-progress preview while a demo shape is being pressed/dragged.
    // Called every frame from display().
    drawDemoPreview() {
        if (!this.demoMode) return;
        const shape = this.demoShapeRadio.value();
        push();
        stroke(0);
        noFill();
        if (shape === 'line' && this.demoDragStart && this.demoDragCurrent) {
            line(this.demoDragStart.x, this.demoDragStart.y, this.demoDragCurrent.x, this.demoDragCurrent.y);
            // Free Draw needs no preview here - its segments are drawn live (queued
            // and pushed to drawnShapes) by the poll in startDemoFreeDrawLive(), so
            // they already render each frame via the normal shape-drawing loop above.
        } else if (this.demoDragStart && (shape === 'circle' || shape === 'ellipse' || shape === 'arc' || shape === 'rectangle')) {
            const cx = this.demoDragStart.x;
            const cy = this.demoDragStart.y;
            switch (shape) {
                case 'circle':
                    circle(cx, cy, parseFloat(this.demoCircleDiameterInput.value()) || 0);
                    break;
                case 'ellipse':
                    ellipse(cx, cy, parseFloat(this.demoEllipseWidthInput.value()) || 0, parseFloat(this.demoEllipseHeightInput.value()) || 0);
                    break;
                case 'arc':
                    arc(
                        cx, cy,
                        parseFloat(this.demoArcWidthInput.value()) || 0,
                        parseFloat(this.demoArcHeightInput.value()) || 0,
                        radians(parseFloat(this.demoArcStartInput.value()) || 0),
                        radians(parseFloat(this.demoArcStopInput.value()) || 0)
                    );
                    break;
                case 'rectangle': {
                    const w = parseFloat(this.demoRectWidthInput.value()) || 0;
                    const h = parseFloat(this.demoRectHeightInput.value()) || 0;
                    rect(cx - w / 2, cy - h / 2, w, h);
                    break;
                }
            }
        }
        pop();
    }

    toggleConnection() {
        if (this.connectedPort) {
            this.disconnectFromPort();
        } else {
            this.connectToPort();
        }
    }

    // Opens the browser's native serial device chooser (navigator.serial.requestPort),
    // opens the chosen port, and starts the read loop. There's no port dropdown here -
    // the browser owns device selection/permissioning.
    async connectToPort() {
        if (!this.webSerialSupported) {
            this.connectionStatusLabel.html('Web Serial not supported in this browser');
            return;
        }

        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 115200 });

            this.serialPort = port;

            const encoderStream = new TextEncoderStream();
            this.serialWritableClosed = encoderStream.readable.pipeTo(port.writable);
            this.serialWriter = encoderStream.writable.getWriter();

            this.connectedPort = true;
            this.connectionStatusLabel.html('Connected to plotter');
            this.connectButton.html('Disconnect');

            // Plotting is enabled automatically on a successful connection - the
            // user can still disable it manually to test something without
            // disconnecting; disconnecting always disables it again (see
            // disconnectFromPort/handlePortDisconnected).
            this.enabled = true;
            this.enabledCheckbox.checked(true);

            this.startSerialReadLoop();

            // Many Arduino/AVR-based Grbl boards reset when the serial port is
            // opened (a DTR toggle), which takes a second or two to reboot and
            // print its startup banner before it's ready to accept commands.
            // Sending G92 immediately risks it being silently dropped mid-boot -
            // wait first so "zero starts wherever the pen physically is right now"
            // actually takes effect. This also means: position the pen at the
            // desired origin before connecting, since every connection (including
            // after a page refresh) resets zero to wherever it's currently sitting.
            setTimeout(() => {
                this.writeToSerial('G92 X0Y0Z0\n');
            }, 2000);
        } catch (error) {
            console.error('Failed to connect:', error);
            this.connectionStatusLabel.html('Not connected to plotter');
        }
    }

    // Reads from the serial port in a loop, decoding to text and buffering until a
    // full line is available before handing it to onMessage() - serial data can
    // arrive chunked at arbitrary byte boundaries, not aligned with G-code lines.
    async startSerialReadLoop() {
        const decoderStream = new TextDecoderStream();
        this.serialReadableClosed = this.serialPort.readable.pipeTo(decoderStream.writable);
        this.serialReader = decoderStream.readable.getReader();
        this.serialReadBuffer = '';

        try {
            while (true) {
                const { value, done } = await this.serialReader.read();
                if (done) break;
                if (!value) continue;

                this.serialReadBuffer += value;
                let newlineIndex;
                while ((newlineIndex = this.serialReadBuffer.indexOf('\n')) >= 0) {
                    const line = this.serialReadBuffer.slice(0, newlineIndex);
                    this.serialReadBuffer = this.serialReadBuffer.slice(newlineIndex + 1);
                    this.onMessage(line);
                }
            }
        } catch (error) {
            console.error('Serial read error:', error);
        } finally {
            try {
                this.serialReader.releaseLock();
            } catch (e) {}
        }
    }

    async disconnectFromPort() {
        if (!this.connectedPort) return;

        try {
            // Lift the pen and home before closing, same as the old server's
            // socket-disconnect handler did.
            this.writeToSerial('G01 Z0\nG28\n');
        } catch (error) {
            console.error('Error sending disconnect gcode:', error);
        }

        if (this.serialReader) {
            try {
                await this.serialReader.cancel();
            } catch (error) {}
        }
        if (this.serialReadableClosed) {
            await this.serialReadableClosed.catch(() => {});
        }

        if (this.serialWriter) {
            try {
                await this.serialWriter.close();
            } catch (error) {}
        }
        if (this.serialWritableClosed) {
            await this.serialWritableClosed.catch(() => {});
        }

        try {
            await this.serialPort.close();
        } catch (error) {
            console.error('Error closing serial port:', error);
        }

        this.serialPort = null;
        this.serialWriter = null;
        this.serialReader = null;
        this.serialReadableClosed = null;
        this.serialWritableClosed = null;
        this.connectedPort = null;
        this.enabled = false;
        this.enabledCheckbox.checked(false); // keep the checkbox in sync with this.enabled
        this.connectionStatusLabel.html('Not connected to plotter');
        this.connectButton.html('Connect');
    }

    // Called when navigator.serial fires 'disconnect' for our port (e.g. the device
    // was physically unplugged/powered off without clicking Disconnect first).
    handlePortDisconnected() {
        this.serialPort = null;
        this.serialWriter = null;
        this.serialReader = null;
        this.serialReadableClosed = null;
        this.serialWritableClosed = null;
        this.connectedPort = null;
        this.enabled = false;
        this.enabledCheckbox.checked(false); // keep the checkbox in sync with this.enabled
        this.connectionStatusLabel.html('Not connected to plotter');
        this.connectButton.html('Connect');
    }

    // Writes a string directly to the open serial port. This is the WebSerial
    // equivalent of the old this.socket.emit("gCodeOutput", data) calls.
    writeToSerial(data) {
        if (!this.serialWriter) {
            console.error('Serial port not open');
            return;
        }
        this.serialWriter.write(data);
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

    updateMarginTop() {
        const newValue = parseFloat(this.marginTopInput.value());
        if (!isNaN(newValue) && newValue >= 0) {
            this.margin_top = newValue;
            this.recalculateMarginBounds();
        } else {
            this.marginTopInput.value(this.margin_top.toString()); // Reset invalid input
        }
    }

    updateMarginBottom() {
        const newValue = parseFloat(this.marginBottomInput.value());
        if (!isNaN(newValue) && newValue >= 0) {
            this.margin_bottom = newValue;
            this.recalculateMarginBounds();
        } else {
            this.marginBottomInput.value(this.margin_bottom.toString()); // Reset invalid input
        }
    }

    updateMarginLeft() {
        const newValue = parseFloat(this.marginLeftInput.value());
        if (!isNaN(newValue) && newValue >= 0) {
            this.margin_left = newValue;
            this.recalculateMarginBounds();
        } else {
            this.marginLeftInput.value(this.margin_left.toString()); // Reset invalid input
        }
    }

    updateMarginRight() {
        const newValue = parseFloat(this.marginRightInput.value());
        if (!isNaN(newValue) && newValue >= 0) {
            this.margin_right = newValue;
            this.recalculateMarginBounds();
        } else {
            this.marginRightInput.value(this.margin_right.toString()); // Reset invalid input
        }
    }

    // Saves the current feed rate, cutting depth, fill gap, and margins to
    // localStorage (there's no server to persist them to anymore).
    saveSettings() {
        const settings = {
            feedRate: this.feedRate,
            cuttingDepth: this.cuttingDepth,
            fillGap: this.fillGap,
            margin_top: this.margin_top,
            margin_bottom: this.margin_bottom,
            margin_left: this.margin_left,
            margin_right: this.margin_right
        };
        localStorage.setItem('gplotterSettings', JSON.stringify(settings));
        console.log('Settings saved:', settings);
    }

    // Loads settings previously saved via saveSettings() from localStorage, if any.
    // Called once from the constructor, after the settings UI inputs exist.
    loadSettings() {
        const raw = localStorage.getItem('gplotterSettings');
        if (!raw) return;
        try {
            this.applySettings(JSON.parse(raw));
        } catch (error) {
            console.error('Error parsing saved settings from localStorage:', error);
        }
    }

    // Applies a settings object (from loadSettings(), or any caller) to both the
    // internal state and the corresponding UI inputs.
    applySettings(settings) {
        if (!settings) return;

        if (settings.feedRate !== undefined) {
            this.feedRate = settings.feedRate;
            this.feedRateInput.value(this.feedRate.toString());
        }
        if (settings.cuttingDepth !== undefined) {
            this.cuttingDepth = settings.cuttingDepth;
            this.cuttingDepthInput.value(this.cuttingDepth.toString());
        }
        if (settings.fillGap !== undefined) {
            this.fillGap = settings.fillGap;
            this.fillGapInput.value(this.fillGap.toString());
        }
        if (settings.margin_top !== undefined) {
            this.margin_top = settings.margin_top;
            this.marginTopInput.value(this.margin_top.toString());
        }
        if (settings.margin_bottom !== undefined) {
            this.margin_bottom = settings.margin_bottom;
            this.marginBottomInput.value(this.margin_bottom.toString());
        }
        if (settings.margin_left !== undefined) {
            this.margin_left = settings.margin_left;
            this.marginLeftInput.value(this.margin_left.toString());
        }
        if (settings.margin_right !== undefined) {
            this.margin_right = settings.margin_right;
            this.marginRightInput.value(this.margin_right.toString());
        }
        this.recalculateMarginBounds();
        console.log('Settings restored:', settings);
    }

    setNewZero() {
        const gcode = "G92 X0 Y0 Z0 ;";
        console.log(gcode);

        if (this.enabled) {
            this.queue.push(gcode);
            this.writeToSerial(gcode + "\n");
        }
    }

    returnToZero(shouldLiftPenFirst = true) {
        if (this.enabled) {
            // First lift the pen
            if (shouldLiftPenFirst)
                this.queue.push(`G00 Z0 F${this.feedRate} ; Lift tool before moving to zero`);

            // Then move to (0,0)
            this.queue.push(`G00 X0 Y0 ; Move to home position`);

            // Important: send benign G21 to trigger the next queued move
            this.writeToSerial("G21\n");
        }
    }

    drawBorder() {
        console.log("Drawing border...");

        // x_min/x_max/y_min/y_max are the margin-derived drawable-area bounds in
        // "natural" (always-positive) mm space. X is never flipped (see mapX), but
        // Y needs the same sign applied that every drawn shape's Y already gets via
        // mapY, or the border's Y coordinates won't match the orientation the
        // machine is actually zeroed for when matchInkscapeOrientation is on.
        const yMin = this.mapYSign() * this.y_min;
        const yMax = this.mapYSign() * this.y_max;

        const gcode = [
            "G90 ; Absolute positioning",
            `G00 Z0 F${this.feedRate} ; Lift pen`,
            `G00 X${this.x_min.toFixed(3)} Y${yMin.toFixed(3)} F${this.feedRate} ; Rapid move to top-left`,
            `G01 Z${this.cuttingDepth} F${this.feedRate} ; Lower tool to start drawing border`,
            `G01 X${this.x_max.toFixed(3)} Y${yMin.toFixed(3)} F${this.feedRate} ; Top edge`,
            `G01 X${this.x_max.toFixed(3)} Y${yMax.toFixed(3)} F${this.feedRate} ; Right edge`,
            `G01 X${this.x_min.toFixed(3)} Y${yMax.toFixed(3)} F${this.feedRate} ; Bottom edge`,
            `G01 X${this.x_min.toFixed(3)} Y${yMin.toFixed(3)} F${this.feedRate} ; Left edge, close`,
            `G00 Z0 F${this.feedRate} ; Lift pen after border`,
            "G00 X0 Y0 Z0 ; Return to zero"
        ];

        this.queueGCode(gcode);
    }

    liftPen() {
        if (!this.enabled) {
            console.warn("Plotter not enabled.");
            return;
        }

        console.log("Lifting pen manually...");
        this.writeToSerial("G00 Z0\n");
    }

    LiftandDropPen() {
        if (!this.enabled) {
            console.warn("Plotter not enabled.");
            return;
        }

        console.log("Lifting and lowering pen...");

        // Lift the pen
        this.writeToSerial("G00 Z0\n");
        this.writeToSerial(`G01 Z${this.cuttingDepth} F${this.feedRate}\n`);
    }

    dropPen() {
        if (!this.enabled) {
            console.warn("Plotter not enabled.");
            return;
        }

        console.log("Lowering pen...");

        this.writeToSerial(`G01 Z${this.cuttingDepth} F${this.feedRate}\n`);
    }

    sendStatusQuery() {
        this.writeToSerial("?");
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
        this.drawMarginOutline();
        this.drawDemoPreview();
    }

    drawMarginBox() {
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
        rect(0, 0, marginLeftPx, this.canvasHeight);
        rect(this.screenWidth - marginRightPx, 0, marginRightPx, this.canvasHeight);
    }

    // Draws a red, 1px outline around the current drawable area (i.e. the page
    // inset by the margins), in the same screen-pixel space as drawMarginBox.
    drawMarginOutline() {
        let marginTopPx = this.margin_top / this.pixelToMMRatio;
        let marginBottomPx = this.margin_bottom / this.pixelToMMRatio;
        let marginLeftPx = this.margin_left / this.pixelToMMRatio;
        let marginRightPx = this.margin_right / this.pixelToMMRatio;

        let outlineX = marginLeftPx;
        let outlineY = marginTopPx;
        let outlineW = this.screenWidth - marginLeftPx - marginRightPx;
        let outlineH = this.canvasHeight - marginTopPx - marginBottomPx;

        push();
        noFill();
        stroke(255, 0, 0);
        strokeWeight(1);
        rect(outlineX, outlineY, outlineW, outlineH);
        pop();
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

    // Recomputes the drawable-area bounds from the current margin_top/bottom/left/right.
    // Called once from the constructor and again whenever a margin UI input changes.
    recalculateMarginBounds() {
        this.drawingAreaWidth = this.pageWidth - this.margin_left - this.margin_right;
        this.drawingAreaHeight = this.pageHeight - this.margin_top - this.margin_bottom;
        this.x_min = this.margin_left;
        this.y_min = this.margin_top;
        this.x_max = this.pageWidth - this.margin_right;
        this.y_max = this.pageHeight - this.margin_bottom;
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
        this.queueGCode(gcode);
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

        this.queueGCode(gcode);
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
        this.queueGCode(gcode);
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
            let xPos = x + r_w * Math.cos(currentAngle);
            let yPos = y + this.mapYSign() * r_h * Math.sin(currentAngle);

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

        this.queueGCode(gcode);
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

        this.queueGCode(gcode);
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

        this.queueGCode(gcode);
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
        this.queueGCode(gcode);
    }

    // Draws a string of Hershey-font text starting at (x, y), scaled by sca.
    drawString(str, x, y, sca) {
        this.drawPath(this.getPathCommandsForText(str), x, y, sca);
    }

    // Draws a single character at the origin. It's up to the caller to
    // scale/translate/rotate it via drawPath, or use drawString for a full string.
    drawChar(c, bCentered = false) {
        let cidx = c.charCodeAt(0) - 33;
        if (cidx >= 0) {
            let dx = bCentered ? 0 - hersheyFutural.futural.chars[cidx].o : 0;
            let dy = 0;
            this.drawPath(this.getPathCommandsForText(c), dx, dy, 1.0);
        }
    }

    // Produces an array of M/L path commands for the given string, laid out
    // left-to-right using each glyph's own advance width (offset).
    getPathCommandsForText(s) {
        const font = hersheyFutural.futural;
        let commands = [];
        let offset = 0;

        for (let i = 0; i < s.length; i++) {
            let cidx = s.charCodeAt(i) - 33;
            let glyph = font.chars[cidx];

            if (glyph && glyph.d) {
                Array.prototype.push.apply(
                    commands,
                    this.getPathCommandsForChar(glyph.d, offset),
                );
                offset += int(glyph.o) * 2;
            } else {
                // fallback spacing for missing glyphs, spaces, accents, etc.
                offset += 10;
            }
        }

        return commands;
    }

    // Converts a hersheytextjs SVG path string for a single glyph into a list
    // of M/L opentype-esque commands, offset horizontally by `offset`.
    getPathCommandsForChar(s, offset) {
        let instr = [];
        let mode = "";
        for (let t of s.split(" ")) {
            if (t.charAt(0) == "M" || t.charAt(0) == "L") {
                mode = t.charAt(0);
                t = t.substr(1);
            }
            let coords = t.split(",");
            if (mode == "M") {
                instr.push({ type: "M", x: int(coords[0]) + offset, y: int(coords[1]) });
            } else if (mode == "L") {
                instr.push({ type: "L", x: int(coords[0]) + offset, y: int(coords[1]) });
            }
        }
        return instr;
    }

    // Walks a list of M/L path commands, drawing each L segment as a plotted
    // line (lifting the pen at the start of each new M contour).
    drawPath(cmds, x, y, sca) {
        // current pen position
        let cx = 0;
        let cy = 0;
        // start position of current contour
        let startX = 0;
        let startY = 0;
        const dy = 22;
        let shouldPickUpPen = true;
        for (let cmd of cmds) {
            switch (cmd.type) {
                case "M":
                    startX = cmd.x;
                    startY = cmd.y;
                    cx = cmd.x;
                    cy = cmd.y;
                    shouldPickUpPen = true;
                    break;
                case "L":
                    let x0 = x + cx * sca;
                    let y0 = y + (cy - dy) * sca;
                    let x1 = x + cmd.x * sca;
                    let y1 = y + (cmd.y - dy) * sca;
                    this.line(x0, y0, x1, y1, 0, shouldPickUpPen, false);
                    stroke(255);
                    cx = cmd.x;
                    cy = cmd.y;
                    shouldPickUpPen = false;
                    break;
            }
        }

        // Queue the final lift instead of calling liftPen(), which sends its
        // G00 Z0 immediately, out of band, bypassing the queue - that would lift
        // the pen right away instead of after the string's queued line segments
        // have actually been sent and drawn.
        this.queueGCode([`G00 Z0 F${this.feedRate} ; Lift tool after string`]);
    }

    // Appends gcode lines to the send queue. Only fires the benign "G21" kickstart
    // when the queue was empty beforehand (i.e. genuinely idle, with nothing else
    // already in flight to trigger the next pop-and-send via a real ok response).
    // Firing it unconditionally on every call - as every shape method used to -
    // floods Grbl with far more traffic than its planner/serial buffers can absorb
    // when many small operations are queued back-to-back in a tight loop (e.g.
    // drawPath() calling line() once per glyph stroke: dozens of calls firing their
    // own "ok"-triggering G21 in the same tick, each one prematurely popping and
    // sending the next real line long before Grbl has physically caught up). That
    // overflows Grbl's receive buffer and corrupts/drops bytes, producing skipped
    // segments and stray connecting lines, or otherwise interrupting whatever is
    // currently mid-draw.
    queueGCode(gcodeArray) {
        if (!this.enabled) return;
        const wasEmpty = this.queue.length === 0;
        this.queue = this.queue.concat(gcodeArray);
        if (wasEmpty) {
            this.writeToSerial('G21\n'); // benign gcode instruction to force "ok" message
        }
    }

    onMessage(message) {
        // this is where the queue is emptied and all gcode messages are output. Final destination for gcode!
        console.log(message);

        // Lines are already newline-delimited by startSerialReadLoop()'s buffering,
        // but this loose check (rather than an exact "ok" match) is kept as-is to
        // avoid changing this behavior as part of the transport swap.
        if (message.trim().includes('k')) {
            console.log('message ok received');
            if (plotter.queue.length > 0) {
                console.log('sending ' + this.queue[0]);
                this.writeToSerial(this.queue[0] + '\n');
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

// This Hershey Font has been converted to SVG Font format
// by https://github.com/techninja/hersheytextjs
const hersheyFutural = {
  futural: {
    name: "Sans 1-stroke",
    chars: [
      { d: "M5,1 L5,15 M5,20 L4,21 5,22 6,21 5,20", o: 5 },
      { d: "M4,1 L4,8 M12,1 L12,8", o: 8 },
      { d: "M11,-3 L4,29 M17,-3 L10,29 M4,10 L18,10 M3,16 L17,16", o: 11 },
      {
        d: "M8,-3 L8,26 M12,-3 L12,26 M17,4 L15,2 12,1 8,1 5,2 3,4 3,6 4,8 5,9 7,10 13,12 15,13 16,14 17,16 17,19 15,21 12,22 8,22 5,21 3,19",
        o: 10,
      },
      {
        d: "M21,1 L3,22 M8,1 L10,3 10,5 9,7 7,8 5,8 3,6 3,4 4,2 6,1 8,1 10,2 13,3 16,3 19,2 21,1 M17,15 L15,16 14,18 14,20 16,22 18,22 20,21 21,19 21,17 19,15 17,15",
        o: 12,
      },
      {
        d: "M23,10 L23,9 22,8 21,8 20,9 19,11 17,16 15,19 13,21 11,22 7,22 5,21 4,20 3,18 3,16 4,14 5,13 12,9 13,8 14,6 14,4 13,2 11,1 9,2 8,4 8,6 9,9 11,12 16,19 18,21 20,22 22,22 23,21 23,20",
        o: 13,
      },
      { d: "M5,3 L4,2 5,1 6,2 6,4 5,6 4,7", o: 5 },
      { d: "M11,-3 L9,-1 7,2 5,6 4,11 4,15 5,20 7,24 9,27 11,29", o: 7 },
      { d: "M3,-3 L5,-1 7,2 9,6 10,11 10,15 9,20 7,24 5,27 3,29", o: 7 },
      { d: "M8,7 L8,19 M3,10 L13,16 M13,10 L3,16", o: 8 },
      { d: "M13,4 L13,22 M4,13 L22,13", o: 13 },
      { d: "M5,18 L4,19 3,18 4,17 5,18 5,20 3,22", o: 4 },
      { d: "M4,13 L22,13", o: 13 },
      { d: "M4,17 L3,18 4,19 5,18 4,17", o: 4 },
      { d: "M20,-3 L2,29", o: 11 },
      {
        d: "M9,1 L6,2 4,5 3,10 3,13 4,18 6,21 9,22 11,22 14,21 16,18 17,13 17,10 16,5 14,2 11,1 9,1",
        o: 10,
      },
      { d: "M6,5 L8,4 11,1 11,22", o: 10 },
      {
        d: "M4,6 L4,5 5,3 6,2 8,1 12,1 14,2 15,3 16,5 16,7 15,9 13,12 3,22 17,22",
        o: 10,
      },
      {
        d: "M5,1 L16,1 10,9 13,9 15,10 16,11 17,14 17,16 16,19 14,21 11,22 8,22 5,21 4,20 3,18",
        o: 10,
      },
      { d: "M13,1 L3,15 18,15 M13,1 L13,22", o: 10 },
      {
        d: "M15,1 L5,1 4,10 5,9 8,8 11,8 14,9 16,11 17,14 17,16 16,19 14,21 11,22 8,22 5,21 4,20 3,18",
        o: 10,
      },
      {
        d: "M16,4 L15,2 12,1 10,1 7,2 5,5 4,10 4,15 5,19 7,21 10,22 11,22 14,21 16,19 17,16 17,15 16,12 14,10 11,9 10,9 7,10 5,12 4,15",
        o: 10,
      },
      { d: "M17,1 L7,22 M3,1 L17,1", o: 10 },
      {
        d: "M8,1 L5,2 4,4 4,6 5,8 7,9 11,10 14,11 16,13 17,15 17,18 16,20 15,21 12,22 8,22 5,21 4,20 3,18 3,15 4,13 6,11 9,10 13,9 15,8 16,6 16,4 15,2 12,1 8,1",
        o: 10,
      },
      {
        d: "M16,8 L15,11 13,13 10,14 9,14 6,13 4,11 3,8 3,7 4,4 6,2 9,1 10,1 13,2 15,4 16,8 16,13 15,18 13,21 10,22 8,22 5,21 4,19",
        o: 10,
      },
      { d: "M4,10 L3,11 4,12 5,11 4,10 M4,17 L3,18 4,19 5,18 4,17", o: 4 },
      {
        d: "M4,10 L3,11 4,12 5,11 4,10 M5,18 L4,19 3,18 4,17 5,18 5,20 3,22",
        o: 4,
      },
      { d: "M20,4 L4,13 20,22", o: 12 },
      { d: "M4,10 L22,10 M4,16 L22,16", o: 13 },
      { d: "M4,4 L20,13 4,22", o: 12 },
      {
        d: "M3,6 L3,5 4,3 5,2 7,1 11,1 13,2 14,3 15,5 15,7 14,9 13,10 9,12 9,15 M9,20 L8,21 9,22 10,21 9,20",
        o: 9,
      },
      {
        d: "M18,9 L17,7 15,6 12,6 10,7 9,8 8,11 8,14 9,16 11,17 14,17 16,16 17,14 M12,6 L10,8 9,11 9,14 10,16 11,17 M18,6 L17,14 17,16 19,17 21,17 23,15 24,12 24,10 23,7 22,5 20,3 18,2 15,1 12,1 9,2 7,3 5,5 4,7 3,10 3,13 4,16 5,18 7,20 9,21 12,22 15,22 18,21 20,20 21,19 M19,6 L18,14 18,16 19,17",
        o: 14,
      },
      { d: "M9,1 L1,22 M9,1 L17,22 M4,15 L14,15", o: 9 },
      {
        d: "M4,1 L4,22 M4,1 L13,1 16,2 17,3 18,5 18,7 17,9 16,10 13,11 M4,11 L13,11 16,12 17,13 18,15 18,18 17,20 16,21 13,22 4,22",
        o: 10,
      },
      {
        d: "M18,6 L17,4 15,2 13,1 9,1 7,2 5,4 4,6 3,9 3,14 4,17 5,19 7,21 9,22 13,22 15,21 17,19 18,17",
        o: 11,
      },
      {
        d: "M4,1 L4,22 M4,1 L11,1 14,2 16,4 17,6 18,9 18,14 17,17 16,19 14,21 11,22 4,22",
        o: 10,
      },
      { d: "M4,1 L4,22 M4,1 L17,1 M4,11 L12,11 M4,22 L17,22", o: 9 },
      { d: "M4,1 L4,22 M4,1 L17,1 M4,11 L12,11", o: 8 },
      {
        d: "M18,6 L17,4 15,2 13,1 9,1 7,2 5,4 4,6 3,9 3,14 4,17 5,19 7,21 9,22 13,22 15,21 17,19 18,17 18,14 M13,14 L18,14",
        o: 11,
      },
      { d: "M4,1 L4,22 M18,1 L18,22 M4,11 L18,11", o: 11 },
      { d: "M4,1 L4,22", o: 4 },
      { d: "M12,1 L12,17 11,20 10,21 8,22 6,22 4,21 3,20 2,17 2,15", o: 8 },
      { d: "M4,1 L4,22 M18,1 L4,15 M9,10 L18,22", o: 10 },
      { d: "M4,1 L4,22 M4,22 L16,22", o: 7 },
      { d: "M4,1 L4,22 M4,1 L12,22 M20,1 L12,22 M20,1 L20,22", o: 12 },
      { d: "M4,1 L4,22 M4,1 L18,22 M18,1 L18,22", o: 11 },
      {
        d: "M9,1 L7,2 5,4 4,6 3,9 3,14 4,17 5,19 7,21 9,22 13,22 15,21 17,19 18,17 19,14 19,9 18,6 17,4 15,2 13,1 9,1",
        o: 11,
      },
      {
        d: "M4,1 L4,22 M4,1 L13,1 16,2 17,3 18,5 18,8 17,10 16,11 13,12 4,12",
        o: 10,
      },
      {
        d: "M9,1 L7,2 5,4 4,6 3,9 3,14 4,17 5,19 7,21 9,22 13,22 15,21 17,19 18,17 19,14 19,9 18,6 17,4 15,2 13,1 9,1 M12,18 L18,24",
        o: 11,
      },
      {
        d: "M4,1 L4,22 M4,1 L13,1 16,2 17,3 18,5 18,7 17,9 16,10 13,11 4,11 M11,11 L18,22",
        o: 10,
      },
      {
        d: "M17,4 L15,2 12,1 8,1 5,2 3,4 3,6 4,8 5,9 7,10 13,12 15,13 16,14 17,16 17,19 15,21 12,22 8,22 5,21 3,19",
        o: 10,
      },
      { d: "M8,1 L8,22 M1,1 L15,1", o: 8 },
      { d: "M4,1 L4,16 5,19 7,21 10,22 12,22 15,21 17,19 18,16 18,1", o: 11 },
      { d: "M1,1 L9,22 M17,1 L9,22", o: 9 },
      { d: "M2,1 L7,22 M12,1 L7,22 M12,1 L17,22 M22,1 L17,22", o: 12 },
      { d: "M3,1 L17,22 M17,1 L3,22", o: 10 },
      { d: "M1,1 L9,11 9,22 M17,1 L9,11", o: 9 },
      { d: "M17,1 L3,22 M3,1 L17,1 M3,22 L17,22", o: 10 },
      { d: "M4,-3 L4,29 M5,-3 L5,29 M4,-3 L11,-3 M4,29 L11,29", o: 7 },
      { d: "M0,1 L14,25", o: 7 },
      { d: "M9,-3 L9,29 M10,-3 L10,29 M3,-3 L10,-3 M3,29 L10,29", o: 7 },
      { d: "M8,-1 L0,13 M8,-1 L16,13", o: 8 },
      { d: "M0,29 L18,29", o: 9 },
      { d: "M5,6 L3,8 3,10 4,11 5,10 4,9 3,10", o: 4 },
      {
        d: "M15,8 L15,22 M15,11 L13,9 11,8 8,8 6,9 4,11 3,14 3,16 4,19 6,21 8,22 11,22 13,21 15,19",
        o: 10,
      },
      {
        d: "M4,1 L4,22 M4,11 L6,9 8,8 11,8 13,9 15,11 16,14 16,16 15,19 13,21 11,22 8,22 6,21 4,19",
        o: 9,
      },
      {
        d: "M15,11 L13,9 11,8 8,8 6,9 4,11 3,14 3,16 4,19 6,21 8,22 11,22 13,21 15,19",
        o: 9,
      },
      {
        d: "M15,1 L15,22 M15,11 L13,9 11,8 8,8 6,9 4,11 3,14 3,16 4,19 6,21 8,22 11,22 13,21 15,19",
        o: 10,
      },
      {
        d: "M3,14 L15,14 15,12 14,10 13,9 11,8 8,8 6,9 4,11 3,14 3,16 4,19 6,21 8,22 11,22 13,21 15,19",
        o: 9,
      },
      { d: "M10,1 L8,1 6,2 5,5 5,22 M2,8 L9,8", o: 7 },
      {
        d: "M15,8 L15,24 14,27 13,28 11,29 8,29 6,28 M15,11 L13,9 11,8 8,8 6,9 4,11 3,14 3,16 4,19 6,21 8,22 11,22 13,21 15,19",
        o: 10,
      },
      { d: "M4,1 L4,22 M4,12 L7,9 9,8 12,8 14,9 15,12 15,22", o: 10 },
      { d: "M3,1 L4,2 5,1 4,0 3,1 M4,8 L4,22", o: 4 },
      { d: "M5,1 L6,2 7,1 6,0 5,1 M6,8 L6,25 5,28 3,29 1,29", o: 5 },
      { d: "M4,1 L4,22 M14,8 L4,18 M8,14 L15,22", o: 8 },
      { d: "M4,1 L4,22", o: 4 },
      {
        d: "M4,8 L4,22 M4,12 L7,9 9,8 12,8 14,9 15,12 15,22 M15,12 L18,9 20,8 23,8 25,9 26,12 26,22",
        o: 15,
      },
      { d: "M4,8 L4,22 M4,12 L7,9 9,8 12,8 14,9 15,12 15,22", o: 10 },
      {
        d: "M8,8 L6,9 4,11 3,14 3,16 4,19 6,21 8,22 11,22 13,21 15,19 16,16 16,14 15,11 13,9 11,8 8,8",
        o: 10,
      },
      {
        d: "M4,8 L4,29 M4,11 L6,9 8,8 11,8 13,9 15,11 16,14 16,16 15,19 13,21 11,22 8,22 6,21 4,19",
        o: 9,
      },
      {
        d: "M15,8 L15,29 M15,11 L13,9 11,8 8,8 6,9 4,11 3,14 3,16 4,19 6,21 8,22 11,22 13,21 15,19",
        o: 10,
      },
      { d: "M4,8 L4,22 M4,14 L5,11 7,9 9,8 12,8", o: 6 },
      {
        d: "M14,11 L13,9 10,8 7,8 4,9 3,11 4,13 6,14 11,15 13,16 14,18 14,19 13,21 10,22 7,22 4,21 3,19",
        o: 9,
      },
      { d: "M5,1 L5,18 6,21 8,22 10,22 M2,8 L9,8", o: 7 },
      { d: "M4,8 L4,18 5,21 7,22 10,22 12,21 15,18 M15,8 L15,22", o: 10 },
      { d: "M2,8 L8,22 M14,8 L8,22", o: 8 },
      { d: "M3,8 L7,22 M11,8 L7,22 M11,8 L15,22 M19,8 L15,22", o: 11 },
      { d: "M3,8 L14,22 M14,8 L3,22", o: 9 },
      { d: "M2,8 L8,22 M14,8 L8,22 6,26 4,28 2,29 1,29", o: 8 },
      { d: "M14,8 L3,22 M3,8 L14,8 M3,22 L14,22", o: 9 },
      {
        d: "M9,-3 L7,-2 6,-1 5,1 5,3 6,5 7,6 8,8 8,10 6,12 M7,-2 L6,0 6,2 7,4 8,5 9,7 9,9 8,11 4,13 8,15 9,17 9,19 8,21 7,22 6,24 6,26 7,28 M6,14 L8,16 8,18 7,20 6,21 5,23 5,25 6,27 7,28 9,29",
        o: 7,
      },
      { d: "M4,-3 L4,29", o: 4 },
      {
        d: "M5,-3 L7,-2 8,-1 9,1 9,3 8,5 7,6 6,8 6,10 8,12 M7,-2 L8,0 8,2 7,4 6,5 5,7 5,9 6,11 10,13 6,15 5,17 5,19 6,21 7,22 8,24 8,26 7,28 M8,14 L6,16 6,18 7,20 8,21 9,23 9,25 8,27 7,28 5,29",
        o: 7,
      },
      {
        d: "M3,16 L3,14 4,11 6,10 8,10 10,11 14,14 16,15 18,15 20,14 21,12 M3,14 L4,12 6,11 8,11 10,12 14,15 16,16 18,16 20,15 21,12 21,10",
        o: 12,
      },
      {
        d: "M0,1 L0,22 1,22 1,1 2,1 2,22 3,22 3,1 4,1 4,22 5,22 5,1 6,1 6,22 7,22 7,1 8,1 8,22 9,22 9,1 10,1 10,22 11,22 11,1 12,1 12,22 13,22 13,1 14,1 14,22 15,22 15,1 16,1 16,22",
        o: 8,
      },
    ],
  },
};
