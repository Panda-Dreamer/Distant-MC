const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 5001 });
const axios = require("axios")
const config = require("./config.json")

const express = require("express");
const { createServer } = require("http");
const { type } = require('os');
const { channel } = require('diagnostics_channel');
const app = express();
const httpServer = createServer(app);
app.use(express.json());

session = ""

const httpServer2 = require("http").createServer();
const io = require("socket.io")(httpServer2, {
});



io.on("connection", (socket) => {
  console.log("Socket.io connected")
  socket.joint("update")
  socket.on("chat", (text) => {
    sendWS("chat",text,session)
  });
});


wss.on('connection', function connection(ws) {
  session = ws
  console.log("Connection ! ")
  ws.on('message', function message(data) {
    user = data.toString().split("$$$")[0]
    id = data.toString().split("$$$")[1]
    data = data.toString().split("$$$")[2]
    console.log(id,data)

    sendWS("log","Connection established",ws)
    io.sockets.in("update").emit("information",{user:user});
  })
});

function sendWS(channel,data,ws){
    ws.send(`${channel}$$$${data}`)
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/page.html");
});
  


httpServer.listen(5002)