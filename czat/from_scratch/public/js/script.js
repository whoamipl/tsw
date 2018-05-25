// jshint esversion: 6
function getById(id) {
    return document.getElementById(id);
}
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let socket;
        let form = getById('chat-form');
        let message = getById('m');
        let messages = getById('messages');
        let username = getById('username');
        let loginBtn = getById('login');
        let sendBtn = getById('send');
        let usersList = getById('active-users');
        let roomList = getById('room-list');
        let addRoomBtn = getById('add-room');
        let roomInput = getById('room');
        let defaultRoom = 'Room1';
        let user = {name: '', room: ''};
        
        sendBtn.disabled = true;
        loginBtn.disabled = false;

        loginBtn.addEventListener('click', () => {
            if (!username.value) {
                alert("Username cannot by empty!");
                return;
            } else {
                user.name = username.value;
                console.log("Set username to: " + user.name);
            }

            if (roomInput.value) {
                user.room = roomInput.value;
                console.log("Set user room to: " + user.room);
            } else {
                user.room = "Room1";
                console.log("Set user room to: " + user.room);
            }

            loginBtn.disabled = true;
            sendBtn.disabled = false;

            socket = io();
            socket.emit('newUserConnected', user);

            socket.on('setRooms', (rooms) => {
                rooms.forEach( r => {
                    let listElement = document.createElement('li');
                    let roomButton = document.createElement('button');
                    roomButton.innerText = r;
                    listElement.appendChild(roomButton);
                    roomList.appendChild(listElement); 
                });
            });

            socket.on('chat message', (msg) => {
                let listElement = document.createElement('li');
                listElement.innerText = msg;
                messages.appendChild(listElement);
            });

            socket.on('updateUserList', (activeUsers) => {
                while(usersList.firstChild) {
                    usersList.removeChild(usersList.firstChild);
                }

                activeUsers.forEach((activeUsers) => {
                    let listElement = document.createElement('li');
                    listElement.innerText = user.name;
                    usersList.appendChild(listElement);
                });
            });

            socket.on('userExist', () => {
                alert('Taki użytkownik istnieje!');
                socket.disconnect();
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
