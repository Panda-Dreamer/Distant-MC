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


sessions = {

}


sockets = {
}

drops = {

}

wss.on('connection', function connection(ws) {
  console.log("Connection ! ")
  ws.on('message', function message(data) {
    user = data.toString().split("$$$")[0]
    id = data.toString().split("$$$")[1]
    data = data.toString().split("$$$")[2]
    console.log(id,data)
    if(id == "webhook"){
      sendMessage(config.url,{content:data})
    }else if(id == "join"){
      sockets[user] = data
      
    }else if(id == "item"){
      if(drops[user] == undefined){
        drops[user] = {}
      }
      if(drops[user][data] == undefined){
        drops[user][data] = 0
      }
      drops[user][data] += 1

      sendMessage(config.url,{
        "username": "Glacite farming",
        "avatar_url": "",
        "content": "",
        "embeds": [
          {
            "title": "RARE DROP",
            "color": 50421,
            "description": `${sockets[user]} just dropped ${data}\n\nTimes dropped during the session: ${drops[user][data]} `,
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
    }else if(id == "sessionStart"){
      drops[user] = {}
      sessions[user] = new Date()
      sendMessage(config.url,{content:`${sockets[user]} just started a session, drops count reset !`})
    }else if(id == "sessionEnd"){
      seconds = (new Date().getTime() - sessions[user].getTime())/1000
      hours = Math.floor(seconds/3600)
      seconds = seconds % 3600;

      minutes = Math.floor(seconds/60)
      seconds = Math.floor(seconds % 60)

      time = `${hours}h ${minutes}m ${seconds}s`
      list = ""
      Object.keys(drops[user]).forEach(item=>{
          list+=`- **${item}**: ${drops[user][item]}\n`
      })
      drops[user] = {}
      
      sendMessage(config.url,{content:`${sockets[user]} just stopped a session, drops count reset !
      
      Drop list:
${list}
      
      Session length: ${time}
      ${getPing(user)}`
      
      
    })
    }else if(id == "disconnect"){
      sendMessage(config.url,{content:`${sockets[user]} just got disconnected ! ${getPing(user)}`})
    }else if(id == "death"){
      sendMessage(config.url,{content:`${sockets[user]} just got bozoed ! ${getPing(user)}`})
    }
  });
  ws.send('something');
});

function getPing(username){
  //console.log(username)
  table = {
    " omega7707":"<@448812656304848906>",
    " game602":"<@600630149167185950>"
  }
  return table[username.toLowerCase()]
}

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