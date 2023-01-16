const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 5001 });
const axios = require("axios")


const express = require("express");
const { createServer } = require("http");
const app = express();
const httpServer = createServer(app);
app.use(express.json());


wss.on('connection', function connection(ws) {
  console.log("Connection ! ")
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
  ws.on('webhook', function message(data) {
    sendMessage("https://discord.com/api/webhooks/1064275921462382642/O9KMso7-Pa9hWrYll8b6SfyNN5zqM9acCK5CBTacLow3xsfEXF5rAF5ZiQpIaLh4ZIFr",data)
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