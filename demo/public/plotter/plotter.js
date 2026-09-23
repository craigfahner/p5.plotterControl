// open http://localhost:3000/plotter/ in Chrome, on the computer the plotter is plugged into.
// connect and enable plotting BEFORE sharing the QR code - prompts that arrive while
// plotting is off only appear on screen (in grey).
//
// each prompt that arrives is drawn as a speech bubble whose tail points at a randomly
// chosen vacant lot on a map of NYC. the lot is marked with a small circle. bubbles are
// placed so they never overlap each other, never cover another bubble's lot, and their
// tails never cross another bubble.
//
// keys:  m = plot the map of the boroughs
//        l = show or hide every vacant lot on screen (never plotted - for checking the map)
//
// the canvas is 594px wide for an A1 page (594mm wide), so 1 pixel = 1 mm.
// all the sizes below are in mm.

let pageWidth = 594;
let pageHeight = 841;

// margins:
// the map and the bubbles stay inside the margins set in the plotter controls
// (Margin Top/Bottom/Left/Right), checked every time something is drawn, so you can
// change them during the demo. everything stays this many pixels further in, so
// nothing lands exactly on a margin line and gets cut off by GPlotter.
let marginSafety = 1;

// map calibration:
// these numbers come from the Wild Lots project, where they were matched to a
// laser-cut map of the city. change them together or not at all!
let northLat = 40.933;  // latitude at the top of the map
let southLat = 40.595;  // latitude at the bottom of the map
let westLng = -74.16;   // longitude at the left of the map
let eastLng = -73.785;  // longitude at the right of the map
let mapRotation = -23;  // degrees, turns the map so the city fits the page better
let pivotX = 24;        // the point the map is rotated around
let pivotY = 688;
let mapScaleLeft = -200; // where westLng lands, before rotating
let mapScaleRight = 583; // where eastLng lands, before rotating
let mapScaleTop = 20;    // where northLat lands, before rotating
let mapScaleBottom = 838; // where southLat lands, before rotating

// map drawing:
// the map data has a point every few meters, far more than the plotter needs.
// a new point is only drawn once it's at least this far from the last one.
// higher = faster plotting, but a rougher coastline.
let mapPointSpacing = 1;
// islands smaller than this (in width or height) are skipped.
let smallestIsland = 3;

// speech bubbles:
let textScale = 0.2;        // size of the text (0.2 makes capital letters about 4mm tall)
let charactersPerLine = 22; // longer prompts wrap onto more lines
let linePitch = 30;         // space between lines of text, in font units (scaled by textScale)
let bubblePadding = 4;      // gap between the text and the bubble outline
let bubbleSpacing = 4;      // smallest gap allowed between two bubbles
let shortestTail = 15;      // how far a bubble can be from its lot
let longestTail = 60;
let tailWidth = 6;          // width of the tail where it meets the bubble
let lotMarkerSize = 2;      // diameter of the circle marking the lot
let placementAttempts = 80; // positions to try for each lot before giving up on it
let lotAttempts = 30;       // lots to try before giving up on a prompt
let skipsUntilFull = 5;     // prompts skipped in a row before showing "page is full"

// the font's letters sit on this row (see drawPath() in gplotter.js). used to
// center the text in the bubble.
let hersheyBaseline = 22;

let plotter;
let socket;
let mapData;
let lotTable;

let lots = [];           // every vacant lot that lands on the map: { x, y, address }
let placedBubbles = [];  // rectangles of bubbles already drawn: { left, top, right, bottom }
let placedTails = [];    // lines of tails already drawn: { x1, y1, x2, y2 }
let usedLots = [];       // lots that already have a bubble: { x, y }
let showAllLots = false;
let skipsInARow = 0;     // prompts skipped in a row because there was no room
let pageFullLabel;       // the "page is full" message, below the plotter controls

function preload() {
  mapData = loadJSON('data/shapeData.json');
  lotTable = loadTable('data/lots.csv', 'csv', 'header');
}

function setup() {
  plotter = new GPlotter(pageWidth, pageHeight, 594); // A1 page, 594px wide on screen (1px = 1mm)
  createCanvas(plotter.screenWidth, plotter.canvasHeight);

  loadLots();

  // an empty message below the plotter controls, filled in when the page is full
  pageFullLabel = createP('');
  pageFullLabel.position(plotter.screenWidth + 15, 720);
  pageFullLabel.style('font-size', '24px');
  pageFullLabel.style('font-weight', 'bold');

  // connect to the server (socket.io is loaded in index.html).
  socket = io();
  socket.on('connect', joinAsPlotter);
  socket.on('prompt:new', addPrompt);
}

// the area inside GPlotter's margins, pulled in by marginSafety, in canvas pixels:
// { left, top, right, bottom }. GPlotter stores its margins in mm, so they're
// converted to pixels (on this A1 canvas, 1mm is 1px anyway).
function getDrawingArea() {
  let mmPerPixel = plotter.pixelToMMRatio;
  return {
    left: plotter.margin_left / mmPerPixel + marginSafety,
    top: plotter.margin_top / mmPerPixel + marginSafety,
    right: width - plotter.margin_right / mmPerPixel - marginSafety,
    bottom: height - plotter.margin_bottom / mmPerPixel - marginSafety
  };
}

// tells the server that this page is the plotter, so it sends prompts here.
function joinAsPlotter() {
  socket.emit('plotter:join');
}

function draw() {
  background(225);
  stroke(0);
  plotter.display();

  if (showAllLots) {
    drawAllLots();
  }
}

function keyPressed() {
  if (key == 'm') {
    drawMap();
  }
  if (key == 'l') {
    if (showAllLots) {
      showAllLots = false;
    } else {
      showAllLots = true;
    }
  }
}

// ---- map ----

// converts a latitude and longitude to a position on the canvas, using the
// Wild Lots calibration above. returns { x, y }.
function latLngToCanvas(lat, lng) {
  let x = map(lng, westLng, eastLng, mapScaleLeft, mapScaleRight);
  let y = map(lat, northLat, southLat, mapScaleTop, mapScaleBottom);

  // rotate the point around the pivot
  let angle = radians(mapRotation);
  let dx = x - pivotX;
  let dy = y - pivotY;
  let rotatedX = cos(angle) * dx - sin(angle) * dy + pivotX;
  let rotatedY = sin(angle) * dx + cos(angle) * dy + pivotY;

  return { x: rotatedX, y: rotatedY };
}

// plots the outline of every borough.
function drawMap() {
  let area = getDrawingArea(); // checked once, when the map is drawn
  let boroughs = mapData.features;
  let shapeCount = 0;
  let pointCount = 0;

  for (let i = 0; i < boroughs.length; i++) {
    // each borough is made of several outlines (the main shape, plus islands)
    let outlines = boroughs[i].geometry.coordinates;

    for (let j = 0; j < outlines.length; j++) {
      let pieces = outlineToPieces(outlines[j], area);

      for (let k = 0; k < pieces.length; k++) {
        drawPiece(pieces[k]);
        shapeCount = shapeCount + 1;
        pointCount = pointCount + pieces[k].length;
      }
    }
  }

  console.log('Map: ' + shapeCount + ' shapes, ' + pointCount + ' points');
}

// converts one outline from the map data into canvas points, ready to draw.
// skips points closer together than mapPointSpacing. if the outline goes off
// the margins (the drawing area), it's split into separate pieces, so the pen never
// draws a line straight across the gap. returns a list of pieces (each a list of points).
function outlineToPieces(outline, area) {
  let pieces = [];
  let currentPiece = [];

  for (let i = 0; i < outline.length; i++) {
    // map data stores each point as [longitude, latitude]
    let lng = outline[i][0];
    let lat = outline[i][1];
    let pos = latLngToCanvas(lat, lng);
    let isLastPoint = (i == outline.length - 1);

    if (pointInRect(pos.x, pos.y, area) == false) {
      // the outline left the drawing area: finish this piece and start a new one later
      if (currentPiece.length > 0) {
        pieces.push(currentPiece);
        currentPiece = [];
      }
      continue;
    }

    if (currentPiece.length == 0) {
      currentPiece.push(pos);
      continue;
    }

    // keep the point if it's far enough from the last one, and always keep the
    // outline's last point so the shape closes up
    let lastPos = currentPiece[currentPiece.length - 1];
    if (dist(pos.x, pos.y, lastPos.x, lastPos.y) >= mapPointSpacing || isLastPoint) {
      currentPiece.push(pos);
    }
  }
  if (currentPiece.length > 0) {
    pieces.push(currentPiece);
  }

  // throw away pieces too small to be worth plotting
  let keptPieces = [];
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].length >= 2 && pieceSize(pieces[i]) >= smallestIsland) {
      keptPieces.push(pieces[i]);
    }
  }
  return keptPieces;
}

// the width or height of a piece, whichever is bigger.
function pieceSize(piece) {
  let minX = piece[0].x;
  let maxX = piece[0].x;
  let minY = piece[0].y;
  let maxY = piece[0].y;
  for (let i = 1; i < piece.length; i++) {
    minX = min(minX, piece[i].x);
    maxX = max(maxX, piece[i].x);
    minY = min(minY, piece[i].y);
    maxY = max(maxY, piece[i].y);
  }
  return max(maxX - minX, maxY - minY);
}

// plots one piece of outline as a single shape, so the pen stays down the whole way.
function drawPiece(piece) {
  plotter.beginShape();
  for (let i = 0; i < piece.length; i++) {
    plotter.vertex(piece[i].x, piece[i].y);
  }
  plotter.endShape();
}

// ---- vacant lots ----

// converts every lot in the table to a canvas position. (whether a lot is inside the
// margins is checked when it's picked, since the margins can change.) (lots.csv was already trimmed down from the Wild Lots data: it
// leaves out Staten Island, lots with no location, and lots out in the water
// that fall outside the borough outlines.)
function loadLots() {
  for (let i = 0; i < lotTable.getRowCount(); i++) {
    let lat = lotTable.getNum(i, 'latitude');
    let lng = lotTable.getNum(i, 'longitude');
    let pos = latLngToCanvas(lat, lng);

    let lot = {
      x: pos.x,
      y: pos.y,
      address: lotTable.getString(i, 'address')
    };
    lots.push(lot);
  }
  console.log(lots.length + ' vacant lots loaded');
}

// shows every lot as a tiny red dot. uses regular p5 functions, so it's never plotted.
function drawAllLots() {
  push();
  noStroke();
  fill(255, 0, 0);
  for (let i = 0; i < lots.length; i++) {
    circle(lots[i].x, lots[i].y, 1.5);
  }
  pop();
}

// ---- speech bubbles ----

// called by socket.io each time the server sends a new prompt.
function addPrompt(prompt) {
  let lines = wrapText(prompt.text);
  let textBlock = measureTextBlock(lines);
  let bubbleWidth = textBlock.width + bubblePadding * 2;
  let bubbleHeight = textBlock.height + bubblePadding * 2;

  // try random lots until one has room for a bubble nearby
  for (let attempt = 0; attempt < lotAttempts; attempt++) {
    let lot = random(lots);
    if (isLotAvailable(lot) == false) {
      continue;
    }

    let bubble = findBubblePosition(lot, bubbleWidth, bubbleHeight);
    if (bubble != null) {
      drawSpeechBubble(bubble, lot, lines, textBlock);
      console.log('Prompt ' + prompt.id + ' points to ' + lot.address);

      // it fit, so the page isn't full (a short prompt can sometimes still squeeze in)
      skipsInARow = 0;
      pageFullLabel.html('');
      return;
    }
  }

  console.log('No room for prompt ' + prompt.id + ', skipping: "' + prompt.text + '"');
  skipsInARow = skipsInARow + 1;
  if (skipsInARow >= skipsUntilFull) {
    pageFullLabel.html('page is full');
  }
}

// splits text into lines of at most charactersPerLine characters, breaking
// between words. a single word that's too long is split across lines.
function wrapText(text) {
  let words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // split up any word that's too long to fit on a line by itself
    while (word.length > charactersPerLine) {
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = '';
      }
      lines.push(word.substring(0, charactersPerLine));
      word = word.substring(charactersPerLine);
    }

    if (currentLine.length == 0) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= charactersPerLine) {
      currentLine = currentLine + ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

// measures one line of text by looking at the font's actual pen strokes, so the
// bubble is always exactly big enough. width is in mm; minX/minY/maxY are in font
// units (minX is the small gap before the first letter starts, used for centering).
function measureTextLine(line) {
  let commands = plotter.getPathCommandsForText(line);
  if (commands.length == 0) {
    return { width: 0, minX: 0, minY: 0, maxY: 0 };
  }

  let minX = commands[0].x;
  let maxX = commands[0].x;
  let minY = commands[0].y;
  let maxY = commands[0].y;
  for (let i = 1; i < commands.length; i++) {
    minX = min(minX, commands[i].x);
    maxX = max(maxX, commands[i].x);
    minY = min(minY, commands[i].y);
    maxY = max(maxY, commands[i].y);
  }
  return { width: (maxX - minX) * textScale, minX: minX, minY: minY, maxY: maxY };
}

// measures all the lines stacked together: the widest line, the total height,
// and the measurements drawSpeechBubble() needs to center each line.
function measureTextBlock(lines) {
  let lineSizes = [];
  let width = 0;
  let blockTop = Infinity;
  let blockBottom = -Infinity;

  for (let i = 0; i < lines.length; i++) {
    let size = measureTextLine(lines[i]);
    lineSizes.push(size);
    width = max(width, size.width);

    // each line sits linePitch font units below the one before it
    blockTop = min(blockTop, size.minY + i * linePitch);
    blockBottom = max(blockBottom, size.maxY + i * linePitch);
  }

  return {
    width: width,
    height: (blockBottom - blockTop) * textScale,
    lineSizes: lineSizes,
    centerY: (blockTop + blockBottom) / 2 // in font units
  };
}

// a lot can't be used if its circle wouldn't fit inside the margins, if it's already
// inside or right next to a bubble, or if it's too close to a lot that already has a bubble.
function isLotAvailable(lot) {
  let area = growRect(getDrawingArea(), -lotMarkerSize / 2);
  if (pointInRect(lot.x, lot.y, area) == false) {
    return false;
  }
  for (let i = 0; i < placedBubbles.length; i++) {
    let paddedBubble = growRect(placedBubbles[i], bubbleSpacing);
    if (pointInRect(lot.x, lot.y, paddedBubble)) {
      return false;
    }
  }
  for (let i = 0; i < usedLots.length; i++) {
    if (dist(lot.x, lot.y, usedLots[i].x, usedLots[i].y) < lotMarkerSize * 2) {
      return false;
    }
  }
  return true;
}

// tries random spots around the lot until the bubble fits without touching
// anything already drawn. returns the bubble's rectangle, or null if nothing fits.
function findBubblePosition(lot, bubbleWidth, bubbleHeight) {
  for (let attempt = 0; attempt < placementAttempts; attempt++) {
    // pick a random direction and distance from the lot for the bubble's center
    let angle = random(TWO_PI);
    let distance = random(shortestTail, longestTail + max(bubbleWidth, bubbleHeight) / 2);
    let centerX = lot.x + cos(angle) * distance;
    let centerY = lot.y + sin(angle) * distance;

    let bubble = {
      left: centerX - bubbleWidth / 2,
      top: centerY - bubbleHeight / 2,
      right: centerX + bubbleWidth / 2,
      bottom: centerY + bubbleHeight / 2
    };

    if (bubbleFits(bubble, lot)) {
      return bubble;
    }
  }
  return null;
}

// checks every rule for a bubble at this position, pointing at this lot.
function bubbleFits(bubble, lot) {
  // stay inside the margins
  let area = getDrawingArea();
  if (bubble.left < area.left || bubble.right > area.right) {
    return false;
  }
  if (bubble.top < area.top || bubble.bottom > area.bottom) {
    return false;
  }

  // the tail can't be too short or too long
  let tail = getTail(bubble, lot);
  let tailLength = dist(tail.baseX, tail.baseY, lot.x, lot.y);
  if (tailLength < shortestTail || tailLength > longestTail) {
    return false;
  }

  let paddedBubble = growRect(bubble, bubbleSpacing);

  // don't cover this bubble's own lot
  if (pointInRect(lot.x, lot.y, paddedBubble)) {
    return false;
  }

  for (let i = 0; i < placedBubbles.length; i++) {
    // don't overlap another bubble
    if (rectsOverlap(paddedBubble, placedBubbles[i])) {
      return false;
    }
    // this tail can't cross another bubble
    let paddedOther = growRect(placedBubbles[i], bubbleSpacing);
    if (lineHitsRect(tail.baseX, tail.baseY, tail.tipX, tail.tipY, paddedOther)) {
      return false;
    }
  }

  for (let i = 0; i < placedTails.length; i++) {
    // another bubble's tail can't cross this bubble
    let other = placedTails[i];
    if (lineHitsRect(other.x1, other.y1, other.x2, other.y2, paddedBubble)) {
      return false;
    }
  }

  for (let i = 0; i < usedLots.length; i++) {
    // don't cover a lot that already has a bubble
    if (pointInRect(usedLots[i].x, usedLots[i].y, paddedBubble)) {
      return false;
    }
  }

  return true;
}

// works out where the tail leaves the bubble: from whichever side faces the
// lot, as close to the lot as it can be without running into a corner.
// the tip stops at the edge of the lot's circle rather than its center.
function getTail(bubble, lot) {
  // how far the lot is past each side of the bubble (negative if it isn't past that side)
  let pastLeft = bubble.left - lot.x;
  let pastRight = lot.x - bubble.right;
  let pastTop = bubble.top - lot.y;
  let pastBottom = lot.y - bubble.bottom;

  // the tail comes out of the side the lot is furthest past
  let side = 'left';
  let furthest = pastLeft;
  if (pastRight > furthest) {
    side = 'right';
    furthest = pastRight;
  }
  if (pastTop > furthest) {
    side = 'top';
    furthest = pastTop;
  }
  if (pastBottom > furthest) {
    side = 'bottom';
    furthest = pastBottom;
  }

  // slide the tail along that side to line up with the lot, keeping it away from the corners
  let baseX;
  let baseY;
  let inset = tailWidth / 2 + 1;
  if (side == 'left' || side == 'right') {
    baseY = constrain(lot.y, bubble.top + inset, bubble.bottom - inset);
    if (side == 'left') {
      baseX = bubble.left;
    } else {
      baseX = bubble.right;
    }
  } else {
    baseX = constrain(lot.x, bubble.left + inset, bubble.right - inset);
    if (side == 'top') {
      baseY = bubble.top;
    } else {
      baseY = bubble.bottom;
    }
  }

  // stop the tip at the edge of the lot's circle
  let tailLength = dist(baseX, baseY, lot.x, lot.y);
  let shortenBy = lotMarkerSize / 2;
  let tipX = lot.x - (lot.x - baseX) / tailLength * shortenBy;
  let tipY = lot.y - (lot.y - baseY) / tailLength * shortenBy;

  return { side: side, baseX: baseX, baseY: baseY, tipX: tipX, tipY: tipY };
}

function drawSpeechBubble(bubble, lot, lines, textBlock) {
  let tail = getTail(bubble, lot);
  let halfTail = tailWidth / 2;

  // the lot marker
  plotter.circle(lot.x, lot.y, lotMarkerSize, false);

  // the bubble outline, drawn as one shape clockwise from the top left corner,
  // with the tail added into whichever side it comes out of.
  plotter.beginShape();
  plotter.vertex(bubble.left, bubble.top);
  if (tail.side == 'top') {
    plotter.vertex(tail.baseX - halfTail, bubble.top);
    plotter.vertex(tail.tipX, tail.tipY);
    plotter.vertex(tail.baseX + halfTail, bubble.top);
  }
  plotter.vertex(bubble.right, bubble.top);
  if (tail.side == 'right') {
    plotter.vertex(bubble.right, tail.baseY - halfTail);
    plotter.vertex(tail.tipX, tail.tipY);
    plotter.vertex(bubble.right, tail.baseY + halfTail);
  }
  plotter.vertex(bubble.right, bubble.bottom);
  if (tail.side == 'bottom') {
    plotter.vertex(tail.baseX + halfTail, bubble.bottom);
    plotter.vertex(tail.tipX, tail.tipY);
    plotter.vertex(tail.baseX - halfTail, bubble.bottom);
  }
  plotter.vertex(bubble.left, bubble.bottom);
  if (tail.side == 'left') {
    plotter.vertex(bubble.left, tail.baseY + halfTail);
    plotter.vertex(tail.tipX, tail.tipY);
    plotter.vertex(bubble.left, tail.baseY - halfTail);
  }
  plotter.endShape(CLOSE, false);

  // the text, one drawString() call per line, centered in the bubble.
  // drawString() puts the font's baseline row at the y we give it, so this
  // works out the y that lands each line where measureTextBlock() measured it.
  let centerX = (bubble.left + bubble.right) / 2;
  let centerY = (bubble.top + bubble.bottom) / 2;
  for (let i = 0; i < lines.length; i++) {
    // the first letter's strokes start a little to the right of the x we give
    // drawString(), so shift left by that gap to center what's actually drawn
    let lineSize = textBlock.lineSizes[i];
    let lineX = centerX - lineSize.width / 2 - lineSize.minX * textScale;
    let lineY = centerY + textScale * (hersheyBaseline - textBlock.centerY + i * linePitch);
    plotter.drawString(lines[i], lineX, lineY, textScale);
  }

  // remember everything, so later bubbles stay out of the way
  placedBubbles.push(bubble);
  placedTails.push({ x1: tail.baseX, y1: tail.baseY, x2: tail.tipX, y2: tail.tipY });
  usedLots.push({ x: lot.x, y: lot.y });
}

// ---- geometry helpers ----

// returns a copy of a rectangle, grown by `amount` on every side.
function growRect(rect, amount) {
  return {
    left: rect.left - amount,
    top: rect.top - amount,
    right: rect.right + amount,
    bottom: rect.bottom + amount
  };
}

function pointInRect(x, y, rect) {
  if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
    return true;
  } else {
    return false;
  }
}

function rectsOverlap(a, b) {
  if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
    return true;
  } else {
    return false;
  }
}

// true if the line from (x1, y1) to (x2, y2) touches the rectangle at all.
function lineHitsRect(x1, y1, x2, y2, rect) {
  // an end of the line is inside the rectangle
  if (pointInRect(x1, y1, rect) || pointInRect(x2, y2, rect)) {
    return true;
  }
  // or the line crosses one of the rectangle's four sides
  if (linesCross(x1, y1, x2, y2, rect.left, rect.top, rect.right, rect.top)) {
    return true;
  }
  if (linesCross(x1, y1, x2, y2, rect.right, rect.top, rect.right, rect.bottom)) {
    return true;
  }
  if (linesCross(x1, y1, x2, y2, rect.right, rect.bottom, rect.left, rect.bottom)) {
    return true;
  }
  if (linesCross(x1, y1, x2, y2, rect.left, rect.bottom, rect.left, rect.top)) {
    return true;
  }
  return false;
}

// true if line A (from a1 to a2) crosses line B (from b1 to b2).
function linesCross(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  let denominator = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y);
  if (denominator == 0) {
    return false; // the lines are parallel
  }
  let ua = ((b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x)) / denominator;
  let ub = ((a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x)) / denominator;
  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return true;
  } else {
    return false;
  }
}
