//Roughly following (the start of) shiffman's paper marbling video: 
//  https://www.youtube.com/watch?v=p7IGZTjC008 
//
//Palettes from kgolid's chromotome: https://kgolid.github.io/chromotome-site/

const config = {
	shouldAddText: false
};

/** @type {Palette} */
let currentPalette;

/** indicates the next splat layer to be added to / modified
 * @type {number} */
let currentSplatLayerIndex = 0;

/**
 * The non-background colours from the current palette
 * @type {string[]} */
let otherColours;

/**The background colour from the current palette
 * @type {string} */
let bgColour;

/** @type {Splat[][]} */
let splatLayers;

let font;

// function preload() {
// 	font = loadFont("./Lobster-Regular.ttf");
// }

function setup() {
	createCanvas(594, 841);
	noStroke();
	restart();
	noLoop();
}

function draw() {
	background(bgColour);
	drawSplats();
	drawText();
}

function restart() {
	setupPalette();
	splatLayers = [
		[],
		[],
		[]
	];

	// if (config.shouldAddText) {
	// 	addTextAsSplat({
	// 		fontSize: 300,
	// 		word: "Create",
	// 		pos: createVector(width / 2, height / 2),
	// 	});
	// }

	createInitialSplats();
	// redraw();
}


function setupPalette() {
	currentPalette = randomPalette();
	const result = splitPalette(currentPalette);
	bgColour = result.bgColour;
	otherColours = result.otherColours;
}


function drawSplats() {
	splatLayers.forEach((sl) => sl.forEach(drawSplat));
}

function createInitialSplats() {
	for (let i = 0; i < 30; i++) {
		//Here is how to generate splats and specify their location, radius and color
		const splats = splatLayers[currentSplatLayerIndex];
		const radius = random(50, 200);
		const colour = random(otherColours);
		createAndAddOneSplat(randomScreenPos(), radius, splats, colour);
	}
}

function createAndAddOneSplat(pos, radius, splats, colour) {
	const newSplat = createSplat({
		radius,
		pos,
		colour,
	});

	splats.forEach((mainSplat) => deformSplatBasedOn(mainSplat, newSplat));
	splats.push(newSplat);
}

//export Splats Vectors as txt files directly readable by Gplotter code
function keyPressed() {
	if (key === "o" || key === "O") {
		exportSplatsAsVertices();
	}
}

function exportSplatsAsVertices() {
	let result = '';

	splatLayers.forEach((layer, layerIndex) => {
		result += `// Layer ${layerIndex + 1}\n`;
		layer.forEach((splat, splatIndex) => {
			result += `// Splat ${splatIndex + 1}\n`;
			result += 'plotter.beginShape();\n';
			splat.pts.forEach(pt => {
				if (pt.x.toFixed(2) > 0 && pt.x.toFixed(2) < width && pt.y.toFixed(2) > 0 && pt.y.toFixed(2) < height) {
					result += `plotter.vertex(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)});\n`;
				} else {
					result += 'plotter.endShape();\n\n';
					result += 'plotter.beginShape();\n\n'; // there might be a better way of doing this to prevent repeated beginshape/ednshapes
				}
			});
			result += 'plotter.endShape();\n\n';
		});
	});

	// Save the result as a text file
	saveStrings([result], 'splatVertices.txt');
}



// function mouseDragged() {
// 	const splats = splatLayers[currentSplatLayerIndex];
// 	const offset = p5.Vector.random2D().mult(random(5, 40));
// 	createAndAddOneSplat(mousePos().add(offset), random(10, 60), splats);
// 	redraw();
// }

// function mouseClicked() {
// 	const splats = splatLayers[currentSplatLayerIndex];
// 	createAndAddOneSplat(createVector(mouseX, mouseY), random(50, 100), splats);
// 	redraw();
// }

// function deviceShaken() {
// 	restart();
// }

// function keyPressed() {
// 	if (key === "s") {
// 		save("my-p5-screenshot");
// 	}
// 	if (key === " ") {
// 		restart();
// 	}
// 	if (key === "t") {
// 		config.shouldAddText = !config.shouldAddText;
// 		restart();
// 	}
// 	if (key === "1") {
// 		currentSplatLayerIndex = 0;
// 	}
// 	if (key === "2") {
// 		currentSplatLayerIndex = 1;
// 	}
// 	if (key === "3") {
// 		currentSplatLayerIndex = 2;
// 	}
// 	if (key === "p") {
// 		setupPalette();
// 	}
// }