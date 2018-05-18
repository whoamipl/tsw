// jshint esversion: 6
function getById(id) {
    return document.getElementById(id);
}
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let socket = io();
        let form = getById('chat-form');
        let message = getById('m');
        let messages = getById('messages');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('From submitted');
            socket.emit('chat message', message.value);
            message.value = '';
        });

        socket.on('chat message', (msg) => {
            let listElement = document.createElement('li');
            listElement.innerText = msg;
            messages.appendChild(listElement);
        });
    }
};
