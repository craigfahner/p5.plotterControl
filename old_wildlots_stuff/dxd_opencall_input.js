let json;
let parsedData;
let input;
let button;
let plotter;
let path = [];
let margin1 = 50;
let margin2 = 50;
let margin3 = 50;
let margin4 = 50;
let loopNum = 0;

let rotateMap = true;
let rotationAngle = -23;

let pivotX = 24;
let pivotY = 688;

let currentLocation = "Enter an address to find the nearest vacant lot";

let pos = "";

let nycBox = {
  minLong: -74.16,
  maxLong: -73.785,
  minLat: 40.933,
  maxLat: 40.595 //40.549;
};

// let nycBox = {
//   minLong: -74.07,
//   maxLong: -73.9,
//   minLat: 40.88,
//   maxLat: 40.69,
// };

function preload() {
  json = loadJSON("shapeData.json", parseJSON);
}

function setup() {
  plotter = new GPlotter(594, 841, 594, false, 0, 0, 0, 0);
  plotter.addEventListener("seedReceived", (e) => {
    // SEED DROP EVENT IS BELOW
    const data = e.detail;
    currentLocation = data.address;
    console.log("Seed drop data received:", data);
    dropSeeds(data.lat,data.lng,data.isSI);
    // trigger seed drop function!
    
  });
  //createCanvas(540, 800); //windowWidth, windowHeight); to be like A1 paper
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
  background(215, 0, 0);
  fill(220);
  noStroke();
  //rect(margin1, margin4, width - margin1 - margin3, height - margin2 - margin4);
  setupInputs();
  //drawCity();
}

function draw() {
  background(215);

  //drawCity();
  stroke(0);
  strokeWeight(3);
  plotter.display();
  fill(25);
  noStroke();
  text(currentLocation, 15, 16);
  //fill(255);
}

function setupInputs() {
  // input = createInput();
  // input.position(20, 30);
  // button = createButton("submit");
  // button.position(160, 30);
  // button.mousePressed(drawLocation);

  background(225);
  noStroke();
  fill(0);
  text(currentLocation, 15, 16);
  fill(230);
}

function plotManhat() {
  strokeWeight(2);
  stroke(0);
  manhattanOutlineShapes = json.features[4].geometry.coordinates;

  //console.log(manhattanOutlineShapes[0]);
  let boroughs = json.features;
  for (let q = 0; q < boroughs.length; q++) {
    let boroughShapes = boroughs[q].geometry.coordinates;
    for (let i = 0; i < boroughShapes.length; i++) {
      //plotter.beginShape();
      let lastX = 0;
      let lastY = 0;
      for (let b = 0; b < boroughShapes[i].length; b++) {
        let coord = latlong2coord(
          boroughShapes[i][b][0],
          boroughShapes[i][b][1],
        );
        //don't get bogged down in the tiny parts of the drawing
        if (abs(coord.x - lastX) < 0.03 || abs(coord.y - lastY) < 0.03) {
          continue;
        }
        //or if the coord is out of bounds
        if (coord.x == -1) {
          continue;
        }

        //plotter.point(coord.x, coord.y);
        if (!(lastX == 0 && lastY == 0))
          plotter.line(lastX, lastY, coord.x, coord.y);
        //point(coord.x,coord.y);
        lastX = coord.x;
        lastY = coord.y;
      }
      //plotter.endShape();
    }
  }
}

function keyPressed() {
  if (key == "m") {
    drawCity();
  }
  if (key == "q") {
    drawCityNoPlot();
  }
  if (key == "h") {
    plotter.toggleControls();
    let ps = selectAll("p");
    for (let i = 0; i < ps.length; i++) {
      ps[i].hide();
    }
  }
}

function dropSeeds(lng,lat,isSI){
  console.log("drop seed function");
  console.log(isSI);
  let coord=latlong2coord(lat,lng);
  if(isSI){
    console.log("Staten Island manual seed reroute");
    coord=latlong2coord(-74.07,40.627);
    //redefine the coords to be a random place inside the box in SI - we can add more places and randomize this list later
  }
  let x=coord.x;
  let y=coord.y;
  console.log(x + " "+y)
  plotter.dropPen();
  plotter.point(x,y,true);
  plotter.point(x,y,true);
  plotter.returnToZero(false);
  plotter.dropPen();


}
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    strokeWeight(5);
    stroke(255,0,0);
    let coord1=testPoint(true,mouseX,mouseY);

    if(coord1.x!=-1){
      console.log(coord1);
      dropSeeds(coord1.x,coord1.y);
    //   plotter.point(coord1.x,coord1.y);
    }

  }
}

function drawCityNoPlot() {
  strokeWeight(2);
  stroke(0);
  //manhattanOutlineShapes = json.features[4].geometry.coordinates;
  // console.log(
  //   "amount of manhattanOutlineShapes = " + manhattanOutlineShapes.length
  // );
  //console.log(manhattanOutlineShapes[0]);
  let boroughs = json.features;
  for (let q = 0; q < boroughs.length; q++) {
    let boroughShapes = boroughs[q].geometry.coordinates;
    for (let i = 0; i < boroughShapes.length; i++) {
      beginShape();
      let lastX = 0;
      let lastY = 0;
      for (let b = 0; b < boroughShapes[i].length; b++) {
        let coord = latlong2coord(
          true,
          boroughShapes[i][b][0],
          boroughShapes[i][b][1],
        );
        if (coord.x == -1) {
          continue;
        }
        lastX = coord.x;
        lastY = coord.y;
        //plotter.point(coord.x, coord.y);
        vertex(coord.x, coord.y);
      }
    }
    endShape();
  }
}

function drawCity() {
  strokeWeight(2);
  stroke(0);
  manhattanOutlineShapes = json.features[4].geometry.coordinates;
  // console.log(
  //   "amount of manhattanOutlineShapes = " + manhattanOutlineShapes.length
  // );
  //console.log(manhattanOutlineShapes[0]);
  let boroughs = json.features;
  for (let q = 0; q < boroughs.length; q++) {
    let boroughShapes = boroughs[q].geometry.coordinates;
    for (let i = 0; i < boroughShapes.length; i++) {
      //beginShape();
      let lastX = 0;
      let lastY = 0;
      for (let b = 0; b < boroughShapes[i].length; b++) {
        let coord = latlong2coord(
          boroughShapes[i][b][0],
          boroughShapes[i][b][1],
          true
        );
        //console.log(coord);
        //  if(coord.x==-1 ){
        //   continue
        // }
        //don't get bogged down in the tiny parts of the drawing
        //vertex(coord.x, coord.y);
        let thresh = 1;

        if (abs(coord.x - lastX) < thresh || abs(coord.y - lastY) < thresh) {
          continue;
        }
        //or if the coord is out of bounds
        if (coord.x == -1) {
          continue;
        }
        lastX = coord.x;
        lastY = coord.y;
        plotter.point(coord.x, coord.y);

      }

    }
    //endShape();
  }
}

function parseJSON() {
  //parsedData = json.features[0].geometry.coordinates;
  parsedData = json.features;
  //console.log(parsedData);
}

function latlong2coord(long, lat, shouldCutOffPoints = true) {
  let padding = 20;
  let maxX = 583;
  let maxY = 838;
  let minX = 5;
  let minY = 5;
  let x = map(long, nycBox.minLong, nycBox.maxLong, -200, maxX);
  let y = map(lat, nycBox.minLat, nycBox.maxLat, padding, maxY);

  let rotationRadians = radians(rotationAngle);
  let cos = Math.cos(rotationRadians);
  let sin = Math.sin(rotationRadians);

  let dx = x - pivotX;
  let dy = y - pivotY;

  let rotatedX = cos * dx - sin * dy + pivotX;
  let rotatedY = sin * dx + cos * dy + pivotY;

  if (rotateMap) {
    x = rotatedX;
    y = rotatedY;
  }

  //x = x - 120;
  console.log("x,y  "+x.toFixed(1) + ", "+y.toFixed(1));
  if ((x < minX || x > maxX || y < minY || y > maxY)) {
    x = -1;
    y = -1;
  }
  return { x, y };
}

function testPoint(shouldCutOffPoints, x, y) {
  let maxX = 583;
  let maxY = 838;
  let minX = 5;
  let minY = 5;
  //x = x - 120;
  if (shouldCutOffPoints && (x < minX || x > maxX || y < minY || y > maxY)) {
    x = -1;
    y = -1;
  }
  return { x, y };
}