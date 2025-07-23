const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const chromium = require('chromium');


// Create a new client instance
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "AUTH",
  }),
  puppeteer: {
    // executablePath: chromium.path,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
  if (message.body === "ping") {
    // send back "pong" to the chat the message was sent in
    await client.sendMessage(message.from, "pong");
  }
});

// Start your client
client.initialize();
