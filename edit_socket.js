const io = require('socket.io-client');

const socket_url = 'ws://localhost:3700/';
let socket = io(socket_url);

// Приём с сервера
socket.on('ALARM', function(data) {
  console.log(data);
});
