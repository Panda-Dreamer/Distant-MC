const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 5002 });
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
const io = require("socket.io")(httpServer, {
});



io.on("connection", (socket) => {
  console.log("Socket.io connected")
  socket.join("update")
  socket.on("chat", (text) => {
    sendWS("chat",text,session)
  });
  socket.on("PlayerConnect", (text) => {
    sendWS("connect",text,session)
  });
  socket.on("PlayerDisconnect", (text) => {
    sendWS("disconnect"," ",session)
  });
  socket.on("screenshot", (text) => {
    sendWS("screenshot"," ",session)
  });
  socket.on("keybind", (text) => {
    sendWS("keybind",text,session)
  });
});


wss.on('connection', function connection(ws) {
  session = ws
  console.log("Connection ! ")
  sendWS("log","Connection established",ws)
  ws.on('message', function message(data) {
    data = Buffer.from(data,"base64").toString()
    console.log("Data:",data)
    user = data.toString().split("$$$")[0]
    id = data.toString().split("$$$")[1]
    data = data.toString().split("$$$")[2]
    console.log(id,data)
    if(id == "information"){
        io.sockets.in("update").emit("information",{user:user});
    }else if(id == "chat"){
        io.sockets.in("update").emit("chat",data);
    }else if(id=="screenshot"){
      arrayBuffer = data
      var base64 = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        io.sockets.in("update").emit("screenshot",base64);
    }
    
  })
});

function sendWS(channel,data,ws){
    console.log("Send ws:",`${channel}$$$${data}`)
    ws.send(`${channel}$$$${data}`)
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/page.html");
});
  

//httpServer2.listen(5003)
httpServer.listen(5001)