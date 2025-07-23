const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const chromium = require("chromium");
var qr = require("qr-image");
var kodeQr = "";

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
  if (message.body.toLowerCase() === "ping") {
    // send back "pong" to the chat the message was sent in
    await panggil_data();
    await message.reply(panggil_data());
  }
});

// mysql

function panggil_data() {
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "srv1417.hstgr.io",
    user: "u349378717_sparepart",
    password: "Adzka@001",
    database: "u349378717_sparepart",
  });

  connection.connect();

  connection.query(
    "SELECT * FROM users",
    function (error, results, fields) {
      if (error) throw error;
      console.log("The solution is: ", results[0].name);
    }
  );

  connection.end();
}

// Start your client
client.initialize();

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  var qr_svg = qr.image(kodeQr, { type: "svg" });
  qr_svg.pipe(require("fs").createWriteStream("i_qr.svg"));

  var svg_string = qr.imageSync(kodeQr, { type: "svg", size: "7", margin: 1 });
  res.send(svg_string);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
