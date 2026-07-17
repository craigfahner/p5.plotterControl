// Introduction:
// This sketch listens for speech via p5.speech (p5.SpeechRec) and draws each
// newly-recognized phrase as a classic speech-bubble shape on the plotter canvas -
// an oval body with a small triangular tail, containing the wrapped text - placed
// at a random position that doesn't overlap any bubble already drawn.
//
// Docs: https://idmnyu.github.io/p5.js-speech/#examples

let plotter;
let recognizer;

let detectedString = "";      // most recently recognized (and processed) phrase
let lastProcessedString = ""; // guards against reprocessing an unchanged result

let speechBubbles = []; // { x, y, w, h } bounding boxes of bubbles already placed

const TEXT_SCALE = 0.1;

// Must match the `dy` constant in gplotter.js's drawPath(): drawString()'s y
// parameter is the output position of the raw glyph row dy=22, i.e.
// renderedY = y + (rawGlyphY - HERSHEY_DY) * scale. Used to solve for the y to
// pass to drawString() so text lands centered in the bubble instead of guessed.
const HERSHEY_DY = 22;
// Baseline-to-baseline spacing between wrapped lines, in raw Hershey font units
// (same units as HERSHEY_DY) - not derived from measurement, just a fixed pitch
// that looks right, since Hershey letterforms are fairly uniform in height.
const LINE_PITCH_RAW = 30;

// BUBBLE_PADDING/TAIL_LENGTH/TAIL_WIDTH/BUBBLE_SPACING are all "at scale 1"
// reference sizes - each is multiplied by TEXT_SCALE where used, so the whole
// bubble (not just the text) shrinks or grows together with TEXT_SCALE.
const BUBBLE_PADDING = 20;       // gap between the text block and the bubble outline
const TAIL_LENGTH = 25;
const TAIL_WIDTH = 18;
const BUBBLE_SPACING = 20;       // minimum gap enforced between bubbles
const MAX_PLACEMENT_ATTEMPTS = 100;
const MIN_WORDS_PER_BREAK = 12;  // phrases shorter than this stay on one line

function setup() {
  plotter = new GPlotter(594, 841, 500, false);
  createCanvas(plotter.screenWidth, plotter.canvasHeight);
  background(225);

  recognizer = new p5.SpeechRec();
  recognizer.continuous = true; // keep listening for multiple phrases over time
  // interimResults is left at its default (false), so onResult only fires once a
  // phrase is finalized - we don't want a bubble drawn for every partial guess.
  recognizer.onResult = handleSpeechResult;
  // The underlying Web Speech API frequently ends a recognition session on its
  // own - after a pause, an error, or sometimes even after successfully
  // recognizing a phrase - despite continuous being true. onEnd fires for all of
  // those cases, so restarting there is what actually keeps it listening
  // indefinitely instead of relying on `continuous` alone.
  recognizer.onEnd = restartListening;
  recognizer.start();
}

function restartListening() {
  // A short delay avoids a "recognition has already started" error some
  // browsers throw if start() is called immediately after the previous
  // session's end event.
  setTimeout(() => {
    try {
      recognizer.start();
    } catch (error) {
      console.warn('Could not restart speech recognition:', error);
    }
  }, 250);
}

function draw() {
  background(225);
  stroke(0);
  plotter.display(); // Display drawn shapes
}

function handleSpeechResult() {
  const result = (recognizer.resultString || "").trim();
  if (!result || result === lastProcessedString) return;
  lastProcessedString = result;
  detectedString = result;

  addSpeechBubble(detectedString);
}

// ---- Speech bubble layout + placement ----

// Splits a phrase into at most two lines, breaking near the midpoint at a space
// so a long phrase doesn't produce an overly wide, horizontally-elongated bubble.
function wrapForBubble(str) {
  if (str.length <= MIN_WORDS_PER_BREAK) return [str];

  const mid = Math.floor(str.length / 2);
  // Search outward from the midpoint for the nearest space to break on.
  let breakAt = -1;
  for (let offset = 0; offset < str.length; offset++) {
    if (str[mid + offset] === ' ') { breakAt = mid + offset; break; }
    if (str[mid - offset] === ' ') { breakAt = mid - offset; break; }
  }

  if (breakAt === -1) return [str]; // no space to break on (e.g. a single long word)

  return [str.slice(0, breakAt).trim(), str.slice(breakAt + 1).trim()];
}

// Measures a single line's actual rendered extent by inspecting its raw Hershey
// glyph path commands directly, rather than guessing from character count - this
// is what actually guarantees the text fits the bubble it's drawn into.
function measureTextLine(str) {
  const commands = plotter.getPathCommandsForText(str);
  if (commands.length === 0) return { width: 0, minY: 0, maxY: 0 };

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  commands.forEach((cmd) => {
    minX = Math.min(minX, cmd.x);
    maxX = Math.max(maxX, cmd.x);
    minY = Math.min(minY, cmd.y);
    maxY = Math.max(maxY, cmd.y);
  });

  return { width: (maxX - minX) * TEXT_SCALE, minY, maxY };
}

// Measures a full (already-wrapped) block of lines: the widest line's width, the
// overall stacked height, and enough raw-unit bookkeeping (lineMetrics,
// blockCenterY) for drawSpeechBubble() to position each line precisely.
function measureTextBlock(lines) {
  const lineMetrics = lines.map(measureTextLine);
  const width = Math.max(...lineMetrics.map((m) => m.width));

  let blockMinY = Infinity, blockMaxY = -Infinity;
  lineMetrics.forEach((m, i) => {
    const offset = i * LINE_PITCH_RAW;
    blockMinY = Math.min(blockMinY, m.minY + offset);
    blockMaxY = Math.max(blockMaxY, m.maxY + offset);
  });

  return {
    width,
    height: (blockMaxY - blockMinY) * TEXT_SCALE,
    lineMetrics,
    blockCenterY: (blockMinY + blockMaxY) / 2
  };
}

// Measures the bubble size needed for the given (already-wrapped) lines, using
// the actual glyph measurements above rather than an estimate.
function measureBubble(lines) {
  const block = measureTextBlock(lines);
  const padding = BUBBLE_PADDING * TEXT_SCALE;
  return {
    w: block.width + padding * 2,
    h: block.height + padding * 2,
    block
  };
}

// Simple bounding-box overlap check (with a margin) between two bubbles.
function overlaps(a, b) {
  const spacing = BUBBLE_SPACING * TEXT_SCALE;
  return Math.abs(a.x - b.x) < (a.w + b.w) / 2 + spacing &&
         Math.abs(a.y - b.y) < (a.h + b.h) / 2 + spacing;
}

// Converts the plotter's current page margins (stored in mm) to pixel-space
// bounds on the canvas, so bubbles can be kept within the "interior dimensions"
// (the drawable area inside the margins) rather than the full canvas. Computed
// fresh each call since margins can change live via the UI.
function getInteriorBoundsPx() {
  const marginLeftPx = plotter.margin_left / plotter.pixelToMMRatio;
  const marginRightPx = plotter.margin_right / plotter.pixelToMMRatio;
  const marginTopPx = plotter.margin_top / plotter.pixelToMMRatio;
  const marginBottomPx = plotter.margin_bottom / plotter.pixelToMMRatio;

  return {
    xMin: marginLeftPx,
    xMax: width - marginRightPx,
    yMin: marginTopPx,
    yMax: height - marginBottomPx
  };
}

// Tries random positions within the margin interior until one doesn't overlap an
// existing bubble (leaving room below for the tail too, also within the margins).
// Returns null if no free space was found.
function findBubblePosition(w, h) {
  const interior = getInteriorBoundsPx();
  const halfW = w / 2;
  const halfH = h / 2;
  const tailAllowance = halfH + TAIL_LENGTH * TEXT_SCALE;

  const xMin = interior.xMin + halfW;
  const xMax = interior.xMax - halfW;
  const yMin = interior.yMin + halfH;
  const yMax = interior.yMax - tailAllowance;

  if (xMin > xMax || yMin > yMax) return null; // too big for the interior area

  for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
    const x = random(xMin, xMax);
    const y = random(yMin, yMax);
    const candidate = { x, y, w, h };

    const collides = speechBubbles.some((existing) => overlaps(candidate, existing));
    if (!collides) return candidate;
  }

  return null; // no free space found after MAX_PLACEMENT_ATTEMPTS tries
}

function addSpeechBubble(str) {
  const lines = wrapForBubble(str);
  const size = measureBubble(lines);
  const position = findBubblePosition(size.w, size.h);

  if (!position) {
    console.log('No room for a new speech bubble - skipping: "' + str + '"');
    return;
  }

  drawSpeechBubble(position.x, position.y, size.w, size.h, lines, size.block);
  speechBubbles.push(position);
}

function drawSpeechBubble(cx, cy, w, h, lines, block) {
  const hw = w / 2;
  const hh = h / 2;
  const tailLength = TAIL_LENGTH * TEXT_SCALE;
  const tailWidth = TAIL_WIDTH * TEXT_SCALE;
  const tailX = cx - w * 0.15; // offset slightly off-center, like a classic bubble

  // Rectangle body (sharp corners) with a triangular notch/tail cut into the
  // bottom edge, drawn as one continuous outline instead of two separate shapes.
  plotter.beginShape();
  plotter.vertex(cx - hw, cy - hh);                // top-left
  plotter.vertex(cx + hw, cy - hh);                // top-right
  plotter.vertex(cx + hw, cy + hh);                // bottom-right
  plotter.vertex(tailX + tailWidth / 2, cy + hh);  // bottom edge, right of notch
  plotter.vertex(tailX, cy + hh + tailLength);     // tail tip
  plotter.vertex(tailX - tailWidth / 2, cy + hh);  // bottom edge, left of notch
  plotter.vertex(cx - hw, cy + hh);                // bottom-left
  plotter.endShape(CLOSE, false);

  // Text, centered within the rectangle both horizontally and vertically - one
  // drawString() call per line, since drawString() has no line-break support.
  // lineY is solved from drawPath()'s renderedY = y + (rawY - HERSHEY_DY) * scale
  // so each line lands exactly where measureTextBlock() assumed it would,
  // guaranteeing containment within the bubble it was sized for.
  lines.forEach((line, i) => {
    const metrics = block.lineMetrics[i];
    const lineX = cx - metrics.width / 2;
    const lineY = cy + TEXT_SCALE * (HERSHEY_DY - block.blockCenterY + i * LINE_PITCH_RAW);
    plotter.drawString(line, lineX, lineY, TEXT_SCALE);
  });
}

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
