
# GPlotter Class Documentation

## Class Initialization

```javascript
let plotter = new GPlotter(594, 841, 500, false);
createCanvas(plotter.screenWidth, plotter.canvasHeight);
```

### Parameters
- `pageWidth` (Number): Width of the plotting area in millimeters (e.g., 594).
- `pageHeight` (Number): Height of the plotting area in millimeters (e.g., 841).
- `screenWidth` (Number): Width of the canvas display in pixels (e.g., 500).
- `enabled` (Boolean): Whether plotting is initially enabled (e.g., `false`).

### Notes
- Canvas height is automatically calculated to preserve the aspect ratio.
- Enables accurate scaling between physical and digital dimensions.

---

## Display Method

### `plotter.display()`
Displays all drawn shapes on the canvas using `p5.js` drawing functions.

### Functionality
- Renders the following shapes:
  - Circle
  - Rectangle
  - Arc
  - Line
  - Ellipse
  - Point
  - Custom Shape
- Simulates fill lines based on `fillGap`.

### Dependencies
- `p5.js` library

### Example
```javascript
plotter.circle(100, 100, 50, true);
plotter.rectangle(150, 150, 80, 60, true);
plotter.arc(200, 200, 100, 100, 0, PI);
plotter.line(50, 50, 200, 50);
plotter.display();
```

---

# Draw Shapes

Here is a list of all the draw functions available in the GPlotter class that users can call to create shapes. Each function adds a shape to the `drawnShapes` array and optionally generates G-code if plotting is enabled.

## 1. `plotter.circle(x, y, d, fill)`

Draws a circle at a specified position with a given diameter.

**Parameters:**
- `x` (Number): X-coordinate of the circle's center.
- `y` (Number): Y-coordinate of the circle's center.
- `d` (Number): Diameter of the circle.
- `fill` (Boolean, optional): Whether to fill the circle. Default is false.

## 2. `plotter.rectangle(x, y, w, h, fill)`

Draws a rectangle at a specified position with a given width and height.

**Parameters:**
- `x` (Number): X-coordinate of the rectangle's top-left corner.
- `y` (Number): Y-coordinate of the rectangle's top-left corner.
- `w` (Number): Width of the rectangle.
- `h` (Number): Height of the rectangle.
- `fill` (Boolean, optional): Whether to fill the rectangle. Default is false.

## 3. `plotter.arc(x, y, w, h, start, stop)`

Draws an arc with specified dimensions and angles.

**Parameters:**
- `x` (Number): X-coordinate of the arc's center.
- `y` (Number): Y-coordinate of the arc's center.
- `w` (Number): Width of the arc (horizontal diameter).
- `h` (Number): Height of the arc (vertical diameter).
- `start` (Number): Starting angle in radians.
- `stop` (Number): Stopping angle in radians.

## 4. `plotter.line(x1, y1, x2, y2)`

Draws a straight line between two points.

**Parameters:**
- `x1` (Number): X-coordinate of the starting point.
- `y1` (Number): Y-coordinate of the starting point.
- `x2` (Number): X-coordinate of the ending point.
- `y2` (Number): Y-coordinate of the ending point.

## 5. `plotter.ellipse(x, y, w, h, fill)`

Draws an ellipse at a specified position with given width and height.

**Parameters:**
- `x` (Number): X-coordinate of the ellipse's center.
- `y` (Number): Y-coordinate of the ellipse's center.
- `w` (Number): Width of the ellipse (horizontal diameter).
- `h` (Number): Height of the ellipse (vertical diameter).
- `fill` (Boolean, optional): Whether to fill the ellipse. Default is false.

## 6. `plotter.point(x, y)`

Draws a single point at a specified position.

**Parameters:**
- `x` (Number): X-coordinate of the point.
- `y` (Number): Y-coordinate of the point.

## 7. Custom Shape Functions

To create custom shapes, use the following sequence of functions:

### `plotter.beginShape()`
Starts recording vertices for a custom shape.

### `plotter.vertex(x, y)`
Adds a straight-line vertex to the custom shape.

### `plotter.curveVertex(x, y)`
Adds a curve vertex to the custom shape (for smooth curves).

### `plotter.endShape(close, fill)`
Finishes recording the custom shape and optionally closes and fills it.

**Parameters:**
- `close` (Boolean, optional): Whether to close the shape. Default is false.
- `fill` (Boolean, optional): Whether to fill the shape. Default is false.

---

## Example Usage

```javascript
// Draw a filled circle
plotter.circle(100, 100, 50, true);

// Draw a rectangle without fill
plotter.rectangle(150, 150, 80, 60, false);

// Draw an arc
plotter.arc(200, 200, 100, 100, 0, PI);

// Draw a line
plotter.line(50, 50, 200, 50);

// Draw a filled ellipse
plotter.ellipse(300, 300, 100, 60, true);

// Draw a filled custom shape
plotter.beginShape();
plotter.vertex(100, 100);
plotter.vertex(150, 200);
plotter.vertex(200, 100);
plotter.endShape(CLOSE, true);
```
## 8. `plotter.text(textString, fontData, x, y, scale)`

Draws vector text using a Hershey-style font at a given position and scale.

**Parameters:**
- `textString` (`String`): The text content to draw (e.g., `"Hello World!"`).
- `fontData` (`Object`): The Hershey font JSON object (e.g., `hershey.futural`) loaded via `loadJSON()`.
- `x` (`Number`): X-coordinate offset for the start of the text (left baseline).
- `y` (`Number`): Y-coordinate offset for the baseline of the text.
- `scale` (`Number`): Multiplier to scale the text size (e.g., `1.5` for 150% size).

**Behavior:**
- Automatically lifts the pen between character strokes.
- Uses `beginShape()` and `endShape()` to simulate plotter pen-up and pen-down behavior.
- Appends drawn shapes to `drawnShapes` and queues G-code instructions if `plotter.enabled` is true.

**Example:**

```js
let font;

function preload() {
  font = loadJSON("hersheytext.json");
}

function setup() {
  let plotter = new GPlotter(594, 841, 500, true);
  createCanvas(plotter.screenWidth, plotter.canvasHeight);

  plotter.text("Hello Plotter!", font.futural, 50, 200, 1.5);
}
```

These functions allow you to create a variety of shapes on the canvas and generate corresponding G-code if plotting is enabled.


---

## On-Screen UI

### Port Management Controls
- **Connect Button**: Connects/disconnects using `toggleConnection()`. Connecting opens the browser's native Web Serial device picker (`navigator.serial.requestPort()`) - there's no in-page port dropdown.
- **Connection Status Label**: Displays "Connected to plotter" / "Not connected to plotter".

### Plotter Controls
- **Enable Plotting Checkbox**: Toggles plotter with `toggleEnabled()`.
- **Clear Queue Button (Emergency Stop)**: Clears queue with `this.queue = []`.
- **Lift Pen Button**: Lifts pen using `liftPen()`.
- **Lift and Drop Pen Button**: Calls `LiftandDropPen()`.
- **Draw Border Button**: Calls `drawBorder()`.

### Parameter Controls
- **Feed Rate Input**: Sets speed via `updateFeedRate()`.
- **Cutting Depth Input**: Sets Z depth via `updateCuttingDepth()`.
- **Fill Gap Input**: Sets fill spacing via `updateFillGap()`.

### Plotter Position Controls
- **Set New Zero Button**: Calls `setNewZero()`.
- **Return to Zero Button**: Calls `returnToZero()`.

### Camera Controls (Optional)
- **Enable Camera Capture Checkbox**: Toggles `cameraCaptureEnabled`. Calls `captureAndSaveImage()` in `onMessage()` when enabled.

---

## Function Reference

### `toggleEnabled()`
Enables/disables plotter functionality.

### `toggleConnection()`
Toggles the Web Serial connection.

### `connectToPort()`
Opens the browser's native device picker and connects to the chosen serial port.

### `disconnectFromPort()`
Disconnects from the current serial port.

### `onMessage(data)`
Handles a line of data read from the serial port.

### `updateFeedRate()`
Updates G-code feed rate.

### `updateCuttingDepth()`
Updates G-code cutting depth.

### `updateFillGap()`
Updates shape fill spacing.

### `setNewZero()`
Sets current position as origin.

### `returnToZero()`
Moves tool to origin.

### `display()`
Draws shapes on canvas.

### `circle(x, y, d, fill)`
Draws circle and generates G-code.

### `circleToGCode(x, y, d, fill)`
Generates circle G-code.

### `line(x1, y1, x2, y2, angle = 0)`
Draws line and generates G-code.

### `lineToGCode(x1, y1, x2, y2)`
Generates line G-code.

### `rectangle(x, y, w, h, fill, angle = 0)`
Draws rectangle and generates G-code.

### `rectangleToGCode(x, y, w, h, fill, angle = 0)`
Generates rectangle G-code.

### `arc(x, y, w, h, start, stop, angle = 0)`
Draws arc and generates G-code.

### `arcToGCode(x, y, w, h, start, stop, angle = 0)`
Generates arc G-code.

### `normalizeAngle(angle)`
Normalizes angle between 0 and 2π.

### `beginShape()`
Starts a custom shape.

### `vertex(x, y)`
Adds vertex to shape.

### `curveVertex(x, y)`
Adds curve vertex.

### `endShape(close, fill)`
Ends shape definition, generates G-code.

### `generateGCodeForCustomShape(vertices, close, fill, fillGap)`
Generates G-code for custom shape.

### `catmullRom(t, p0, p1, p2, p3)`
Computes Catmull-Rom spline point.

### `ellipse(x, y, w, h, fill, angle)`
Draws ellipse and generates G-code.

### `ellipseToGCode(x, y, w, h, fill, angle)`
Generates ellipse G-code.

### `point(x, y)`
Draws a point.

### `pointToGCode(x, y)`
Generates point G-code.

### `text(str, fontData, x, y, scale = 1)`
Draws a vector-based text string using Hershey-style stroke fonts and generates G-code for each character.

### `pathCommands(pathStr, offsetX, offsetY, scale)`
Parses a Hershey font path string into a list of movement commands for drawing.

### `pathCommandsForText(font, text, offsetX = 0, offsetY = 0, scale = 1)`
Converts a text string into a list of vector drawing commands using the Hershey font format.