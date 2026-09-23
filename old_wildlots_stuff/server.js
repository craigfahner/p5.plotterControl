
// GIS stuff
const axios = require("axios");
const csv = require("csv-parser");

 const timelapse = require('./public/timelapser.js');

const { SerialPort } = require("serialport");
// const NodeWebcam = require("node-webcam");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const fs = require("fs");

// NYC bounding box (update to match p5js stuff)
const minLat = 40.549;//40.595;
const maxLat = 40.933;
const minLng = -74.16;
const maxLng = -73.785;

const minLatSI = 40.50;
const maxLatSI = 40.65;
const minLngSI = -74.26;
const maxLngSI = -74.03;

//quiet hours
const QUIET_START = 23; // 11 PM
const QUIET_END = 7;    // 7 AM
const checkingQuietHours = true;


// let nycBox = {
//   minLong: -74.16,
//   maxLong: -73.785,
//   minLat: 40.933,
//   maxLat: 40.595,
// };

let locations = [];

// Load CSV once
fs.createReadStream("PLUTO_filtered.csv")
  .pipe(csv())
  .on("data", (row) => {
    locations.push({
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude),
      address: row.address,
      isSI: (insideBoundingBox(row.latitude, row.longitude)==0),
    });
  })
  .on("end", () => {
    console.log("CSV loaded:", locations.length, "rows");
  });

// =======================
// SETUP
// =======================
const port = 3000;
const portList = [];
let serialPort;
let Webcam;

// Setup image storage folder
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// // =======================
// // CAMERA SETUP
// // =======================
// NodeWebcam.list((cameras) => {
//   const cleanedCameras = cameras.map((cam) => cam.replace(/^=>\s*/, "").trim());
//   const deviceName =
//     cleanedCameras.find((c) => c.includes("Logitech")) || cleanedCameras[0];

//   if (!deviceName) {
//     console.error("No webcam found");
//     return;
//   }

//   Webcam = NodeWebcam.create({
//     width: 1920,
//     height: 1080,
//     quality: 100,
//     saveShots: true,
//     output: "jpeg",
//     device: deviceName,
//     callbackReturn: "location",
//     verbose: true,
//     delay: 0.2,
//   });

//   console.log("Webcam ready:", deviceName);
// });

// =======================
// SERVER START
// =======================
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Serve static files
//app.use(express.static('public'));  // this may be causing windows errors
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(imagesDir));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


// stream video page
app.get('/timelapse', (req, res) => {

    const videoPath = path.join(__dirname, 'public/photos/timelapse.mp4');
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    const range = req.headers.range;

    if (range) {

        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = (end - start) + 1;

        const file = fs.createReadStream(videoPath, { start, end });

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4"
        };

        res.writeHead(206, headers);
        file.pipe(res);

    } else {

        const headers = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4"
        };

        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
});

// =======================
// SERIAL PORT LISTING
// =======================
SerialPort.list()
  .then((ports) => {
    console.log("Available Serial Ports:");
    ports.forEach((portInfo) => {
      console.log(
        `- Port: ${portInfo.path}, Manufacturer: ${portInfo.manufacturer}`,
      );
      portList.push(portInfo.path);
    });
  })
  .catch((err) => {
    console.error("Error listing serial ports:", err.message);
  });

// =======================
// SOCKET.IO HANDLING
// =======================
io.on("connection", (socket) => {
  console.log("User connected");

  socket.emit("portList", portList);

  // if (Webcam) {
  //   socket.emit("webcam-selected", "Webcam ready");
  // }

  // socket.on("get-webcams", () => {
  //   NodeWebcam.list((cameras) => {
  //     const cleanedCameras = cameras.map((cam) =>
  //       cam.replace(/^=>\s*/, "").trim(),
  //     );
  //     socket.emit("webcam-list", cleanedCameras);
  //   });
  // });

  // socket.on("capture-image", () => {
  //   if (!Webcam) {
  //     console.error("Webcam not set yet");
  //     socket.emit("capture-error", "Webcam not set yet.");
  //     return;
  //   }

  //   const fileName = `image_${Date.now()}.jpg`;
  //   const filePath = path.join(imagesDir, fileName);

  //   Webcam.capture(filePath, (err) => {
  //     if (err) {
  //       console.error("Capture error:", err);
  //       socket.emit("capture-error", err.message);
  //     } else {
  //       console.log("Image captured:", fileName);
  //       socket.emit("capture-success", fileName);
  //     }
  //   });
  // });

  socket.on("gCodeOutput", (data) => {
    if (serialPort && serialPort.isOpen) {
      serialPort.write(data);
    } else {
      console.error("Serial port not open");
    }
  });

  socket.on("portSelect", (data) => {
    serialPort = new SerialPort({
      path: data,
      baudRate: 115200,
    });

    socket.emit("portConnected", data);
    serialPort.write("G92 X0Y0Z0\n");

    serialPort.on("data", (data) => {
      console.log("Plotter data:", data.toString());
      io.emit("plotter", data.toString());
    });
  });

  socket.on("disconnectPort", (callback) => {
    if (serialPort && serialPort.isOpen) {
      serialPort.close((err) => {
        if (err) {
          console.error("Error closing port:", err.message);
          if (callback) callback({ success: false, error: err.message });
        } else {
          console.log("Serial port disconnected");
          if (callback) callback({ success: true });
          serialPort = null;
        }
      });
    } else {
      console.log("No port to disconnect");
      if (callback)
        callback({ success: false, error: "No port is currently connected" });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${reason}`);
    if (serialPort && serialPort.isOpen) {
      //serialPort.write("G01 Z0\nG28\n");
      // experimenting with not closing the serial port when socket disconnects
      // serialPort.close((err) => {
      //   if (err) {
      //     console.error("Serial port close error:", err.message);
      //   } else {
      //     console.log("Serial port closed");
      //   }
      // });
    }
  });
  socket.on("adminLiftAndDrop", (data) => {
    socket.broadcast.emit("adminLiftAndDrop", data); // bounce message to everyone else
  });
  socket.on("adminSetNewZero", (data) => {
    socket.broadcast.emit("adminSetNewZero", data); // bounce message to everyone else
  });
  socket.on("adminReturnToZero", (data) => {
    socket.broadcast.emit("adminReturnToZero", data); // bounce message to everyone else
  });
  socket.on("adminLiftPen", (data) => {
    socket.broadcast.emit("adminLiftPen", data); // bounce message to everyone else
  });
  socket.on("adminEmergencyStop", (data) => {
    socket.broadcast.emit("adminEmergencyStop", data); // bounce message to everyone else
  }); 
  socket.on("adminConnect", (port) => {
    console.log("Admin requested connect to port:", port);
    socket.broadcast.emit("adminConnect", port); // bounce message to everyone else
  });
  socket.on("adminPlottingEnabled", (enabled) => {
    console.log("Admin set plotting enabled:", enabled);
    socket.broadcast.emit("adminPlottingEnabled", enabled); // bounce message to everyone else
  });
  socket.on("lookup-address", async (address) => {
    if (isQuietHours() && checkingQuietHours) {
        console.log("Request received, past quiet hours, ignoring");
        socket.emit("lookup-result", {
          status: "error",
          code: "TOO_LATE",
        });
        return;
    }
    try {
      const coords = await geocode(address);

      if (insideBoundingBox(coords.lat, coords.lng)==-1) {
        socket.emit("lookup-result", {
          status: "error",
          code: "OUTSIDE_BOUNDING_BOX",
        });
        return;
      }
      //ie if the address is in staten island
      if (insideBoundingBox(coords.lat, coords.lng)==0) {
        console.log("THIS IS STATEN ISLAND //AND// OUTSIDE THE BOUNDING MAP BOX");
        //do nothing, keep going so that accurte information about nearest lot is given to the user without erroring out of bounds
      }
      const nearest = findNearest(coords.lat, coords.lng);
      const encodedAddress = encodeURIComponent(nearest.address + " NEW YORK");
      console.log(nearest);

      socket.emit("lookup-result", {
        status: "ok",
        user: coords,
        nearest
      });

    } catch (err) {
      socket.emit("lookup-result", {
        status: "error",
        code: err.message || "LOOKUP_FAILED",
      });
    }
  });
  socket.on("request-seed-drop", (location) => {
    console.log("Location received:", location);
    socket.broadcast.emit("drop-seed", location); // send to all other clients except sender
  });
});

// Haversine distance calculator
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function insideBoundingBox(lat, lng) {
  //returns 1 if all good
  // 0 if is staten island
  // -1 if not staten island and also bad
  if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng)
    return 1;
  else if (lat >= minLatSI && lat <= maxLatSI && lng >= minLngSI && lng <= maxLngSI)
    return 0;
  else
    return -1;
}

async function geocode(address) {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { q: address, format: "json", limit: 1 },
    headers: { "User-Agent": "socketio-geo-demo" },
  });

  if (!res.data.length) throw new Error("ADDRESS_NOT_FOUND");

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
}

function findNearest(lat, lng ) {
  let best = null;
  let min = Infinity;

  for (const loc of locations) {
    const d = haversine(lat, lng, loc.lat, loc.lng);
    if (d < min) {
      min = d;
      best = { ...loc, distanceKm: d };
    }
  }
  return best;
}

// Determine if we're in quiet hours
function isQuietHours() {
    const hour = new Date().getHours();
    return hour >= QUIET_START || hour < QUIET_END;
}