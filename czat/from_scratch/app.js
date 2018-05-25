// jshint esversion: 6
const app = require('express')();
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const activeUsers = [];
const user = {name : '', room : ''};

let roomList = ['Room1'];

app.use(serveStatic('public'));

// set default room
user.room = 'Room1';

io.on('connection', (socket) => {
    io.emit('setRooms', roomList);
    socket.on('newUserConnected', (newUser) => {
        if (activeUsers.includes(newUser.name)) {
            socket.emit('userExist');
        } else {
            activeUsers.push(newUser.name);
        }
        console.log(newUser);
        user.room = newUser.room;
        user.name = newUser.name;
        console.log(user);
        socket.room = user.room;
        socket.join(user.room);

        io.in(user.room).emit('setRoom', user.room);
        io.in(user.room).emit('updateUserList', activeUsers);
        console.log('New user conected to room: ' + user.room);
    });

    socket.on('chat message', (msg) => {
        console.log('Room: ' + user.room);
        console.log('message: ' + user.name + ":" + msg);
        io.in(user.room).emit('chat message', user.name + ": " + msg);
    });

    socket.on('disconnect', () => {
        io.emit('updateUsersList', activeUsers);
        activeUsers.pop(user.name);
        user.name = '';
        user.room = '';
        io.emit('updateUserList', activeUsers);
        console.log('user disconected');
    });
});

http.listen(3000, () => {
    console.log('Listening on *:3000');
});