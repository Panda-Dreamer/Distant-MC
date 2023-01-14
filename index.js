const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 5000 });

wss.on('connection', function connection(ws) {
  console.log("Conenction ! ")
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
  
  ws.send('something');
});