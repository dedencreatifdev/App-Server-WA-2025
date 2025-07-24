const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const chromium = require("chromium");
var qr = require("qr-image");
var kodeQr = "";
var dts;
const https = require("https");

// Create a new client instance
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "AUTH",
  }),
  // browser
  puppeteer: {
    executablePath: chromium.path,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  },
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Client is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
  console.log(chromium.path);
  kodeQr = qr;
  qrcode.generate(qr, { small: true });
});

client.on("message_create", async (message) => {
  console.log(message.body);
  // If the message is "ping", reply with "pong"
  if (message.body.toLowerCase() === "deden") {
    https
      .get("https://jsonplaceholder.typicode.com/users", (res) => {
        let data = [];
        const headerDate =
          res.headers && res.headers.date
            ? res.headers.date
            : "no response date";
        console.log("Status Code:", res.statusCode);
        console.log("Date in Response header:", headerDate);

        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          console.log("Response ended: ");
          const users = JSON.parse(Buffer.concat(data).toString());
          // console.log(users);
          users.forEach((user) => {
            dataku = `ID: ${user.id},\nName: ${user.name},\nEmail: ${user.email}`;
          });
          console.log(dataku);
          // for (user of users) {
          //   console.log(`Got user with id: ${user.id}, name: ${user.name}`);
          //   dataku = `ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`;
          // }
          message.reply(dataku);
        });
      })
      .on("error", (err) => {
        console.log("Error: ", err.message);
      });
  }
});

// Start your client
client.initialize();

const express = require("express");
const { json } = require("stream/consumers");
const app = express();
const port = 80;

app.get("/", (req, res) => {
  var qr_svg = qr.image(kodeQr, { type: "svg" });
  qr_svg.pipe(require("fs").createWriteStream("i_qr.svg"));

  var svg_string = qr.imageSync(kodeQr, { type: "svg", size: "7", margin: 1 });
  res.send(svg_string);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
