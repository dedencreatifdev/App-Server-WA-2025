const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const chromium = require("chromium");
// const browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']});

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
  qrcode.generate(qr, { small: true });
});

client.on("message_create", async (message) => {
  console.log(message.body);
  if (message.body.toLowerCase() === "ping") {
    // send back "pong" to the chat the message was sent in
    await message.reply('pong');
  }
});

// Start your client
client.initialize();

const express = require("express");
const app = express();
const port = 80;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
