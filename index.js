const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 5001 });



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
  
  ws.send('something');
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "page.html");
});
  
httpServer.listen(5000);