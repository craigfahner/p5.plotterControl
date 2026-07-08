// Introduction:
// This code initializes a GPlotter instance to create a canvas for drawing shapes
// and generating G-code for a physical plotter device if connected.
//
// For detailed examples demonstrating how to draw different shapes (circle, line, rectangle, arc, etc.),
// check out the "examples" folder in the project directory.
//
// Available Shapes:
// - Circle:        plotter.circle(x, y, diameter, fill);
// - Line:          plotter.line(x1, y1, x2, y2, angle);
// - Rectangle:     plotter.rectangle(x, y, width, height, fill, angle);
// - Arc:           plotter.arc(x, y, width, height, startAngle, stopAngle, angle);
// - Ellipse:       plotter.ellipse(x, y, width, height, fill, angle);
// - Point:         plotter.point(x, y);
// - Custom Shape:  plotter.beginShape(); plotter.vertex(x, y); plotter.curveVertex(x, y); plotter.endShape(CLOSE, fill);
// - Text:          plotter.drawString(text, x, y, scale);
//
// Remember to call `plotter.display()` in the `draw()` function to visualize the shapes.
//
// Explore the "examples" folder for more comprehensive usage!

let plotter;

let myString = "Hi";

let currentShape = "c";

let pos = 0;

function setup() {
  plotter = new GPlotter(594, 841, 500, false);
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
}

function draw() {
  background(225);
  stroke(0);
  plotter.display(); // Display drawn shapes
}

// function keyPressed(){
//   if(key==="c"){
//     plotter.drawString("Hello", 50,500, 0.5);
//   } else if(key==="e"){
//     plotter.circle(350,350,50,false);
//   } else if(key==="t"){
//     plotter.drawString(String(pos), 10+(pos+10),475, 0.5);
//     pos++;
//   } else if(key==="q"){
//     plotter.sendStatusQuery();
//   }

//   if(key==="c"){
//     currentShape="c";
//   } else if(key ==="r"){
//     currentShape="r";
//   } else if(key === "a"){
//     currentShape="a";
//   }
// }

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (key === "t") {
      plotter.drawString(myString, mouseX, mouseY, 0.5);
    } else if (key === "c") {
      plotter.circle(mouseX, mouseY, 50, false);
    } else if (key === "r") {
      plotter.rectangle(mouseX, mouseY, 50, 50);
    } else if (key === "a") {
      let randomStart = random(2 * PI);
      let randomStop = random(2 * PI);
      plotter.arc(mouseX, mouseY, 50, 50, randomStart, randomStop, 0);
    } else if (key === "e") {
      plotter.ellipse(mouseX, mouseY, 50, 25);
    }
  }
}
