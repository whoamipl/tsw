//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);
const currentUser = '';
const socketio = require('socket.io');
const io = socketio.listen(httpServer);
const cache = [];
app.use(serveStatic('public'));

io.sockets.on('connect', (socket) => {
    socket.on('login', (data) => {
        cache.push({username: currentUser, message: 'Podłączył się'});
        socket.emit('echo', data.username+':'+data.message);
        console.log(cache);
    });
    socket.on('message', (data) => {
        data.array.forEach(e => {
            socket.broadcast.emit('echo', e.username+':'+e.message); 
        });
        cache.push(data);

    });
    socket.on('disconnect', () => {
        console.log('Socket.io: rozłączono.');
    });
    socket.on('error', (err) => {
        console.dir(err);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
