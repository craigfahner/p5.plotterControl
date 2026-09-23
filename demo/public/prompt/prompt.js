// Phone prompt page: people type an answer to the question and submit it once.
// The text is sent to the server, which passes it on to the plotter page.
//
// Each phone can only submit once. To submit again, reload the page.

// the longest answer allowed, in characters (the server uses the same limit,
// and so does maxlength on the text box in index.html)
let maxLength = 140;

let socket;
let promptBox;
let countLabel;
let submitButton;
let submitted = false;

function setup() {
  noCanvas(); // this page only uses p5 for select() and events, not for drawing

  // connect to the server via socket.io library
  socket = io();

  promptBox = select('#prompt');
  countLabel = select('#count');
  submitButton = select('#submit');

  promptBox.input(updateCount);
  submitButton.mousePressed(submitPrompt);
}

// shows how many characters have been typed, e.g. "42 / 140"
function updateCount() {
  countLabel.html(promptBox.value().length + ' / ' + maxLength);
}

// pressing Enter (or Return on a phone keyboard) submits instead of starting a new line
function keyPressed() {
  if (keyCode == ENTER) {
    submitPrompt();
    return false;
  }
}

function submitPrompt() {
  if (submitted) {
    return;
  }

  let text = promptBox.value().trim();
  if (text.length == 0) {
    return;
  }

  submitted = true;
  submitButton.html('Sending…');
  submitButton.attribute('disabled', '');
  promptBox.attribute('disabled', '');

  let message = {
    text: text
  };
  // the server calls handleServerReply() once it has received the prompt.
  socket.emit('prompt:submit', message, handleServerReply);
}

function handleServerReply(reply) {
  if (reply.ok) {
    // stays disabled: one submission per phone
    submitButton.html('Plotting…');
    return;
  }

  // something went wrong. let them try again without losing what they typed
  submitted = false;
  submitButton.removeAttribute('disabled');
  promptBox.removeAttribute('disabled');
  if (reply.reason == 'no-plotter') {
    submitButton.html('Plotter offline, retry');
  } else {
    submitButton.html('Retry');
  }
}
