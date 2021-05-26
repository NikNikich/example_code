const io = require('socket.io-client');

let socket_url = 'http://localhost:3700';
// eslint-disable-next-line @typescript-eslint/no-var-requires
let socket = io(socket_url);

// Приём с сервера
socket.on('message', function(data) {
  alert(data.otvet);
});
