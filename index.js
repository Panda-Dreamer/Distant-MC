const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 5001 });
const axios = require("axios")
const config = require("./config.json")

const express = require("express");
const { createServer } = require("http");
const app = express();
const httpServer = createServer(app);
app.use(express.json());


wss.on('connection', function connection(ws) {
  console.log("Connection ! ")
  ws.on('message', function message(data) {
    channel = data.split("[CHANNEL]")[0]
    if(channel == "WEBHOOK"){
      sendMessage(config.url,data.split("[CHANNEL]")[1])
    }
  });
  ws.send('something');
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/page.html");
});
  
async function sendMessage(webhookUrl, message) {
  try {
      const response = await axios.post(webhookUrl, {
          content: message
      });
      console.log(`Message sent successfully: ${response.status}`);
  } catch (error) {
      console.error(`Error sending message: ${error}`);
  }
}


httpServer.listen(5000);