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





sockets = {
}

drops = {

}

wss.on('connection', function connection(ws) {
  console.log("Connection ! ")
  ws.on('message', function message(data) {
    id = data.toString().split("$$$")[0]
    data = data.toString().split("$$$")[1]
    console.log(id,data)
    if(id == "webhook"){
      sendMessage(config.url,{content:data})
    }else if(id == "join"){
      sockets[ws] = data
      
    }else if(id == "item"){
      if(drops[ws] == undefined){
        drops[ws] = {}
      }
      if(drops[ws][data] == undefined){
        drops[ws][data] = 0
      }
      drops[ws][data] += 1

      sendMessage(config.url,{
        "username": "Glacite farming",
        "avatar_url": "",
        "content": "",
        "embeds": [
          {
            "title": "RARE DROP",
            "color": 50421,
            "description": `${sockets[ws]} just dropped ${data}\n\nTimes dropped during the session: ${drops[ws][data]} `,
            "timestamp": "",
            "author": {
              "name": ""
            },
            "image": {},
            "thumbnail": {},
            "footer": {},
            "fields": []
          }
        ],
        "components": []
      })
    }else if(channel == "sessionStart"){
      drops[ws] = {}
      sendMessage(config.url,{content:`${sockets[ws]} just started a session, drops count reset !`})
    }else if(channel == "sessionEnd"){
      drops[ws] = {}
      sendMessage(config.url,{content:`${sockets[ws]} just stopped a session, drops count reset !`})
    }
  });
  ws.send('something');
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/page.html");
});
  
async function sendMessage(webhookUrl, message) {
  try {
      const response = await axios.post(webhookUrl, message);
      console.log(`Message sent successfully: ${response.status}`);
  } catch (error) {
      console.error(`Error sending message: ${error}`);
  }
}


httpServer.listen(5000);