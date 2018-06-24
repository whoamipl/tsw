//jshint esversion: 6
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let socket = io('//localhost:3000');
        socket.on('test', () => {
            console.log('Test');
        });
    }
};