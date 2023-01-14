const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const axios = require("axios");
const app = express();
const { resolve } = require("path");
const fs = require("fs");

io.on("connection", (socket) => {
    console.log("Connection !");
    socket.join("update");
    console.log("Refershing....");
    socket.on("scan", (pages) => {
      console.log("Received scan order for max pages:", pages);
    });
  });
  
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/website/main.html");
  });
  
  function status(text) {
    //console.log(text);
    const statusFile = JSON.parse(fs.readFileSync("./files/status.json", "utf8"));
    io.sockets.in("update").emit("status", {progress:text,lastUpdate:`Last update: ${new Date(statusFile.lastPricesUpdate).toLocaleString()}`});
  }
  httpServer.listen(5000);