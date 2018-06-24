//jshint esversion: 6
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let socket = io(window.location.host);
        let buyNowBtn;
        let makeBidBtn;
        let url = document.URL;
        let itemId = url.substr(url.lastIndexOf('/') + 1);
        console.log(itemId);
        if (document.getElementById('buy-now-btn')) {
            buyNowBtn = document.getElementById('buy-now-btn');
            buyNowBtn.addEventListener('click', () => {
                socket.emit('buy now', {itemId});
            });
        }

        if (document.getElementById('make-bid-btn')) {
            makeBidBtn = document.getElementById('make-bid-btn');
            makeBidBtn.addEventListener('click', () => {
                price = document.getElementById('price-input').value;
                socket.emit('make bid',{price, itemId});
            });
        }
    }
};