// jshint esversion: 6
function getById(id) {
    return document.getElementById(id);
}

document.onreadystatechange = () => {
    let messageHistory = new Map();
    if (document.readyState === "interactive") {
        let socket;
        let form = getById('chat-form');
        let message = getById('m');
        let messages = getById('messages');
        let username = getById('username');
        let loginBtn = getById('login-btn');
        let logoutBtn = getById('logout-btn');
        let sendBtn = getById('send');
        let usersList = getById('active-users');
        let roomList = getById('room-list');
        let addRoomBtn = getById('add-room');
        let roomInput = getById('room');
        let defaultRoom = 'Room1';
        let user = {name: '', room: ''};
        let visitedRooms = [];

        sendBtn.disabled = true;
        loginBtn.disabled = false;
        logoutBtn.disabled = true;

        let setMessage = (msg) =>  {
            let listElement = document.createElement('li');
            listElement.innerText = msg;
            messages.appendChild(listElement);
            if (messageHistory.get(user.room))
                messageHistory.get(user.room).push(msg);
        };

        loginBtn.addEventListener('click', () => {
           
            if (!username.value) {
                alert("Username cannot by empty!");
                return;
            } 

            user.name = username.value;
            console.log("Set username to: " + user.name);

            if (roomInput.value) {
                user.room = roomInput.value;
                console.log("Set user room to: " + user.room);
            } else {
                user.room = "Room1";
                alert('Joining to default room!');
                console.log("Set user room to: " + user.room);
            } 
            
            loginBtn.disabled = true;
            sendBtn.disabled = false;
            logoutBtn.disabled = false;

            socket = io();
            socket.emit('newUserConnected', user);
            
            logoutBtn.addEventListener('click', () => {
                socket.emit('userDisconnected', user);
            });

            socket.on('setRooms', rooms => {
                if (!visitedRooms.includes(user.room)) {
                    socket.emit('newInThisRoom', user.room);
                    visitedRooms.push(user.room);
                }

                while(roomList.firstChild) {
                    roomList.removeChild(roomList.firstChild);
                }
                
                rooms.forEach( r => {
                    let listElement = document.createElement('li');
                    let roomButton = document.createElement('button');
                    roomButton.innerText = r;
                    roomButton.addEventListener('click', e => {
                        socket.emit('changeRoom', e.target.innerText);
                    });
                    listElement.appendChild(roomButton);
                    roomList.appendChild(listElement); 
                });
            });
            
            socket.on('chat message', (msg) => {
                if (messages.childElementCount > 20) {
                    console.log(messages.firstChild);
                }
                setMessage(msg);
            });

            socket.on('updateUserList', (activeUsers) => {
                console.log(activeUsers);
                while(usersList.firstChild) {
                    usersList.removeChild(usersList.firstChild);
                }

                activeUsers.forEach((user) => {
                    let listElement = document.createElement('li');
                    listElement.innerText = user ;
                    usersList.appendChild(listElement);
                });
            });

            socket.on('userExist', () => {
                alert('Taki użytkownik istnieje!');
                socket.disconnect();
            });

            socket.on('updateMeassageHistory', (history) => {
                history.forEach( msg => setMessage(msg));
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('From submitted');
            socket.emit('chat message', message.value);
            message.value = '';
        });


    }
};
