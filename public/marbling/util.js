function polarToCartesian(angle, radius) {
    const x = radius * cos(angle);
    const y = radius * sin(angle);
    return createVector(x, y);
}
function repeat(numRepeats, fn) {
    for (let i = 0; i < numRepeats; i++) {
        fn(i);
    }
}

function randomScreenPos() {
    return createVector(random(width), random(height));
}

function collect(n, fn) {
    let collection = [];
    repeat(n, (ix) => {
        collection.push(fn(ix));
    });
    return collection;
}

function mousePos() {
	return createVector(mouseX, mouseY);
}
