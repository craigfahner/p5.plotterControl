
# p5-plotter-control examples

## Example 1: timed events using setInterval()

Draws shapes at random positions. Uses the setInterval() function to plot a new shape every second.

[Link to code](/examples/timer1/mySketch.js) | Launch sketch in browser

## Example 2: timed events using millis() - "infinischotter"

![Schotter example](/assets/schotter.gif)

Renders Georg Nees' 1968 plotter-based drawing Schotter in real time. Uses a millis() based timer in the draw loop as a one-shot timed event that adds shapes to the drawing. Uses UI buttons (below the canvas) to start and stop the sequence.

```
  if(timerOn){
    if(millis()>prevMillis+interval){ //
      drawSchotterShape(); // draw the shape
      prevMillis = millis(); // reset the timer
    }
  }
```

[Link to code](/examples/timer2/mySketch.js) | Launch sketch in browser

## Example 3: live control using webcam via ml5.js handpose

![hello handpose example](/assets/helloPlot.gif)

Uses the [ml5.js](https://ml5js.org/) implementation of [HandPose](https://docs.ml5js.org/#/reference/handpose) to detect the position of a person's hand on a webcam. By tracking the distance between the tips of the index finger and thumb, a pinch gesture is detected. When the pinch is detected, the pen is lowered and traces the position of the pinched fingers. When the pinch is released, the pen is raised.

[Link to code](/examples/pinchdraw/mySketch.js) | Launch sketch in browser

## Example 4: audio-reactive drawing

![alt text](../assets/soundWave.gif)

Draws a graph of the amplitude of audio input in your computer's built in microphone.

[Link to code](/examples/soundactivated/mySketch.js) | Launch sketch in browser

## Example 5: speech recognition

![alt text](../assets/speech.gif)

Using p5.speech, detects fragments of speech via the microphone, and plots them as text inside speech bubbles.

[Link to code](/examples/speechbubble/mySketch.js) | Launch sketch in browser