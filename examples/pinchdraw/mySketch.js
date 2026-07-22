// pinch-a-sketch
// uses ml5.js handPose implementation to live-draw to a plotter
// to use, make a "pinch" gesture with your thumb and index finger
// the path traced by your gesture will be plotted using the freeDraw functions (startFreeDraw, freeDrawTo, endFreeDraw)

let plotter;

//ml5 vars
let handPose;
let video;
let hands = [];
// A variable to track a indexPinch between thumb and index
let indexPinch = 0;
let indexPinched = false;

function preload() {
  handPose = ml5.handPose({ flipHorizontal: true });
}

function setup() {
  //plotter = new GPlotter(594, 841, 500); //A1 size
  plotter = new GPlotter(210, 297, 500, true); // creates a GPlotter object that is A4 sized (210mm x 297mm), with an on-screen width of 500px
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(225);

  let xOffset = -((640 - width) / 2); //center video on x axis (and offset handpose coords later)
  let yOffset = (height - 480) / 2; //center video on y axis
  image(video, xOffset, yOffset, 640, 480);
  // overlay rectangle to blend the vid into the background a lil bit
  noStroke();
  fill(225, 100);
  rect(xOffset, yOffset, 640, 480);

  stroke(0);

  // detecting a "pinch" gesture using handpose:

  // If there is at least one hand...
  if (hands.length > 0) {
    // Find the index finger tip and thumb tip and apply offsets
    let index = hands[0].index_finger_tip;
    let indexX = index.x + xOffset; // apply offsets cuz we moved the video
    let indexY = index.y + yOffset;
    let thumb = hands[0].thumb_tip;
    let thumbX = thumb.x + xOffset;
    let thumbY = thumb.y + yOffset;

    // Draw circles at finger positions...
    let centerIndexX = (indexX + thumbX) / 2;
    let centerIndexY = (indexY + thumbY) / 2;
    // Calculate the indexPinch "distance" between finger and thumb...
    let indexPinch = dist(indexX, indexY, thumbX, thumbY);

    if (indexPinch < 15) { // if we have detected that there's a pinch gesture...
      fill(255, 0, 0, 100);
      if (!indexPinched) { // if we WEREN'T detecting a pinch gesture on the previous frame...
        // LOWER pen and start freedrawing
        plotter.startFreeDraw(centerIndexX, centerIndexY);
        indexPinched = true;
      } else { // if we WERE detecting a pinch gesture on the previous frame...
        // pen is already down... update pen position
        plotter.freeDrawTo(centerIndexX, centerIndexY);
      }
    } else { // if there is NO pinch gesture detected...
      fill(0, 255, 0, 200);
      if (indexPinched) { // if there WAS a pinch gesture detected on the previous frame...
        // LIFT pen and end free draw segment
        plotter.endFreeDraw();
        indexPinched = false;
      }
    }

    // This circle's size is controlled by a "indexPinch" gesture
    stroke(0);
    strokeWeight(2);
    circle(centerIndexX, centerIndexY, indexPinch);
  } else {
    // No hand detected - end any in-progress stroke rather than leaving the
    // pen down indefinitely if hand tracking is lost mid-pinch.
    if (indexPinched) {
      plotter.endFreeDraw();
      indexPinched = false;
    }
  }

  plotter.display();
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

// these mouse events are being passed into the plotter object to enable the "Demo Mode" – feel free to include your own mouse events alongside these handlers:
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (plotter.demoMode) {
      plotter.handleDemoMousePressed(mouseX, mouseY);
    }
  }
}

function mouseDragged() {
  if (plotter.demoMode) {
    plotter.handleDemoMouseDragged(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (plotter.demoMode) {
    plotter.handleDemoMouseReleased(mouseX, mouseY);
  }
}
