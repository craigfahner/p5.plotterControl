const socket = io();                                //use this to initialize the socket that we will use to talk to the server
var textfield = document.getElementById("input");   //variable to quickly refer to the text input field
var button = document.getElementById("submit");     //variable to quickly refer to the submit button
var content = document.getElementById("content");   //variable to quickly refer to the display div

button.addEventListener('click', () => {            //when the submit button is pressed...
  //content.innerHTML = textfield.value;              //set the text in our own browser to the text that was typed into the text field
  socket.emit("outgoingData", textfield.value);     //send the text to the server
  textfield.value = "";                             //reset the text field so it says nothing
});

textfield.addEventListener('keyup', e => {          //when a key is pressed and the text field is in focus...
  if (e.keyCode === 13) {                           //if the key is the enter key (code 13)
        button.click();                             //click the button
    }
});

socket.on("incomingData", (data) => {               //if data from the server is received...
  content.innerHTML = data;                         //set the displayed in our browser to the received text
});