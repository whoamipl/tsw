// jshint esversion: 6
const app = require('express')();
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(serveStatic('public'));

io.on('connection', (socket) => {
    console.log('New user conected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconected');
    });
});

http.listen(3000, () => {
    console.log('Listening on *:3000');
});