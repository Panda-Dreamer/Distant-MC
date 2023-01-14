const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 5001 });

wss.on('connection', function connection(ws) {
  console.log("Conenction ! ")
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
  
  ws.send('something');
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "page.html");
});
  
httpServer.listen(5000);