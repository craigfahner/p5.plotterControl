
function addTextAsSplat({ word, fontSize, pos }) {
    const options = {};
    textAlign(CENTER, CENTER);
    const fontPoints = font
        .textToPoints(word, pos.x, pos.y, fontSize, options)
        .map((pt) => createVector(pt.x, pt.y));

    const minX = min(fontPoints.map((p) => p.x));
    const maxX = max(fontPoints.map((p) => p.x));
    const minY = min(fontPoints.map((p) => p.y));
    const maxY = max(fontPoints.map((p) => p.y));

    const offset = createVector(-(maxX - minX) / 2, (maxY - minY) / 2);
    const finalPoints = fontPoints.map((p) => p5.Vector.add(p, offset));
    /** @type {Splat} */
    const textSplat = {
        centre: createVector(width / 2, height / 2),
        initialRadius: 100,
        colour: random(otherColours),
        pts: finalPoints,
        shouldFill: true,
        shouldClose: false,
        strokeWeight: 5,
    };

    splatLayers[0].push(textSplat);
}

function drawText(){
	textSize(30);
	textAlign(RIGHT, CENTER);
	text(currentPalette.name, width - 30, height - 30);
}