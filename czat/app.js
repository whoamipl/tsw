// jshint esversion: 6
const app = require('express')();
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(serveStatic('public'));
let usersInRooms = new Map();
let messagesHistory = new Map();
let roomList = ['Room1'];

roomList.forEach((room) => {
    usersInRooms.set(room, []);
});

roomList.forEach(room => {
    messagesHistory.set(room, ['null']);
});

io.on('connection', (socket) => {
    socket.on('newUserConnected', (newUser) => {
        let user = {name : '', room : ''};
        
        user.room = newUser.room;
        user.name = newUser.name;

        if (usersInRooms.get(user.room)) {
            if (usersInRooms.get(user.room).includes(newUser.name)) {
                socket.emit('userExist');
            } else {
                usersInRooms.get(user.room).push(newUser.name);
                if (!messagesHistory.get(user.room))
                    messagesHistory.set(user.room, []);
            }
        } else {
            usersInRooms.set(user.room, [user.room]);
        }

        if (roomList.includes(user.room)) {
            socket.room = user.room;
            socket.join(user.room);
        } else {
            roomList.push(user.room);
            socket.room = user.room;
            socket.join(user.room);
        }

        io.emit('setRooms', roomList);
        io.in(user.room).emit('setRoom', user.room);
        io.in(user.room).emit('updateUserList', usersInRooms.get(user.room));
        console.log('New user conected to room: ' + user.room);

        socket.on('newInThisRoom', () => {
            if (messagesHistory.get(user.room).length <= 10) {
                socket.emit('updateMeassageHistory', messagesHistory.get(user.room));
            } else {
                let startFrom = messagesHistory.get(user.room).length - 10;
                console.log(messagesHistory.get(user.room).filter( (e,i) => i >= startFrom));
                socket.emit('updateMeassageHistory',
                messagesHistory.get(user.roomName).filter( (e,i) => i >= startFrom) );
            }
        });

        socket.on('chat message', (msg) => {
            let message = user.name + ": " + msg;
            messagesHistory.get(user.room).push(message);
            console.log('Message history: ' + messagesHistory.get(user.room));
            io.in(user.room).emit('chat message', message);
        });
    
        socket.on('disconnect', () => {
            usersInRooms.get(user.room).pop(user.name);
            io.in(user.room).emit('updateUserList', usersInRooms.get(user.room));
            user.name = '';
            user.room = '';
            console.log('user disconected');
        });
    
        socket.on('userDisconnected', (user) => {
            console.log(`User ${user.name} disconnected!`);
        });

        socket.on('changeRoom', roomName => {
            usersInRooms.get(user.room).pop(user.name);
            socket.leave(user.room); 
            user.room = roomName;
            socket.join(user.room);
            usersInRooms.get(user.room).push(user.name);
            io.in(user.room).emit('updateUserList', usersInRooms.get(user.room));
            console.log(`User ${user.name} joined ${user.room}`);
        });
    });
});

http.listen(3000, () => {
    console.log('Listening on *:3000');
});