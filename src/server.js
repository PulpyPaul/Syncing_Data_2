const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass in the http server into socketio and grab the websocket server as io
const io = socketio(app);

const addObject = (sock) => {
  const socket = sock;

  socket.on('draw', (data) => {
    io.sockets.in('room1').emit('updateCanvas', data);
  });
};

io.sockets.on('connection', (socket) => {
  console.log('connected!');

  socket.join('room1');

  addObject(socket);
});

