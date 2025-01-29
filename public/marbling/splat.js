const NUM_POINTS_IN_SPLATS = 256;

/** 
 * A splat is a deformable blob of colour.  
 * It keeps a list of points forming its boundary.  
 @typedef {{
 pts: p5.Vector[],
 initialRadius:number,
 shouldFill:boolean, 
 shouldClose:boolean, 
 colour: string, 
 centre: p5.Vector,
 strokeWeight:number
}} Splat */

/** Create a splat as a set of points in a circle around the given pos at given radius.
 * This function doesn't consider other splats that might be nearby.
 * @returns {Splat}
 */
function createSplat({ radius, pos, colour }) {
    const pts = [];
    const numPoints = NUM_POINTS_IN_SPLATS;
    const angleStep = TWO_PI / numPoints;
    for (let angle = 0; angle < TWO_PI; angle += angleStep) {
        const offset = polarToCartesian(angle, radius);
        pts.push(p5.Vector.add(offset, pos));
    }
    return {
        pts,
        colour,
        centre: pos.copy(),
        initialRadius: radius,
        strokeWeight: 2,
        shouldFill: false,
        shouldClose: false,
    };
}

/**
 *
 * @param {Splat} splat
 */
function drawSplat(splat) {
    push();
    beginShape();
    if (splat.shouldFill) {
        noStroke();
        fill(splat.colour);
    } else {
        strokeWeight(splat.strokeWeight);
        stroke(splat.colour);
        noFill();
    }

    for (let pt of splat.pts) {
        vertex(pt.x, pt.y);
    }

    splat.shouldClose ? endShape(CLOSE) : endShape();
    pop();
}

/**
 * @param {Splat} mainSplat
 * @param {Splat} otherSplat
 */
function deformSplatBasedOn(mainSplat, otherSplat) {
    const c = otherSplat.centre;
    const r = otherSplat.initialRadius;

    mainSplat.pts.forEach((p) => {
        const pMinusC = p5.Vector.sub(p, c);
        const magSq = pMinusC.magSq();

        // Apply a clamp to prevent extreme deformation when points are very close
        const deformationFactor = sqrt(1 + (r * r) / max(1e-0, magSq));

        // Calculate the new position of the point
        const movement = p5.Vector.add(
            c,
            pMinusC.mult(deformationFactor)
        );

        p.set(movement);
    });
}




