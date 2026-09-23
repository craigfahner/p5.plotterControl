const socket = io();

const addressDiv = document.getElementById("resultaddress");
const distanceDiv = document.getElementById("resultdistance");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");
const statusText = document.getElementById("statustext");
const btnDiv = document.getElementById("searchbutton");
const btn = document.getElementById("btn");
const centerCircle = document.getElementById("centercircle");
const seedStatus = document.getElementById("seedDropStatus");
const addrField = document.getElementById("address");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let nearest = "";

document.getElementById("address").addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    // Prevent the default form submission behavior if necessary
    event.preventDefault(); 
    // Trigger the click event of the button
    btn.click();
  }
});

addrField.onclick = () => {
  if('virtualKeyboard' in navigator) {
    navigator.virtualKeyboard.show();
  }
}


btn.onclick = () => {
  const addr = addrField.value;
  if('virtualKeyboard' in navigator) {
    navigator.virtualKeyboard.hide();
  } 
  addrField.style.display = "none"; 
  btnDiv.style.display = "none";
  statusDiv.style.display = "flex";
  centerCircle.style.opacity = 1;
  centerCircle.style.backgroundColor = "rgba(254,104,6,0.0)"
  statusText.innerText = "Looking up...";
  socket.emit("lookup-address", addr);
};

socket.on("lookup-result", (data) => {
  // we have received data from the server containing the lookup result
  if (data.status === "error") {
    statusDiv.style.display = "flex";
    if (data.code === "ADDRESS_NOT_FOUND") {
      statusDiv.innerHTML = `Address not found. <br \> <a href="dxd_lookup.html">Try another address?</a>`;
    } else if (data.code === "OUTSIDE_BOUNDING_BOX") {
      statusDiv.innerHTML = `Address is outside NYC bounding box. <br \> <a href="dxd_lookup.html">Try another address?</a>`;
    } else if (data.code === "TOO_LATE") {
      statusDiv.innerHTML = `Gallery is currently closed, please try again tomorrow.`;
    } else {
      statusDiv.innerHTML = `Lookup failed.<br \> <a href="dxd_lookup.html">Try another address?</a>`;
    }
    return;
  }
  
  console.log(data.nearest);
  // construct map URL from lat long and address
  // data.nearest from the server
  nearest = data.nearest;
  const encodedAddress = encodeURIComponent(nearest.address);
  // GOOGLE MAPS:
  // Encode the address for display

  // Google Maps URL
  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${nearest.lat},${nearest.lng}&query=${encodedAddress}`;
  // END GOOGLE MAPS

  // Encode the address to include safely in the URL (optional for display purposes)

  // Construct a map URL centered on the exact lat/lng
  const OSMUrl = `https://www.openstreetmap.org/?mlat=${nearest.lat}&mlon=${nearest.lng}#map=18/${nearest.lat}/${nearest.lng}&address=${encodedAddress}`;
  // end address stuff

  addressDiv.innerHTML = `<a href="${googleMapUrl}" target="_blank" rel="noopener noreferrer">
        ${data.nearest.address}
      </a><br>`;

  distanceDiv.innerHTML = `${data.nearest.distanceKm.toFixed(2)} km`;
  resultDiv.style.display = "flex";
  // resultDiv.style.opacity = 1;
  
  centerCircle.style.borderRadius = "0%";
  statusDiv.style.display = "none";
  fadeInResult();

  // START COUNTDOWN FOR "DROP SEED" ELEMENT

  // TRIGGER THIS SERVER EVENT AFTER COUNTDOWN
});

async function fadeInResult() {
  await delay(250);
  
  await delay(1000);
  resultDiv.style.opacity = 1;
  await delay(500);
  initiateSeedDrop();
}

async function initiateSeedDrop() {
  await delay(500);
  seedStatus.innerHTML = "Depositing seed in 3...";
  await delay(1000);
  seedStatus.innerHTML += " 2...";
  await delay(1000);
  seedStatus.innerHTML += " 1...";
  await delay(1000);
  seedStatus.innerHTML += " planting...";
  socket.emit("request-seed-drop", nearest); // send the "nearest" address info back to the server
  await delay(3000);
  seedStatus.innerHTML += "<br \>Seed planted!";
  await delay(1000);
  seedStatus.innerHTML += `<br \><br \> Congratulations! ${nearest.address} is your wild lot.`;
}