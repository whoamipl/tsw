//jshint esversion: 6
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let socket = io(window.location.host);
        let buyNowBtn;
        let makeBidBtn;
        let url = document.URL;
        let itemId = url.substr(url.lastIndexOf('/') + 1);
        let priceInput = document.getElementById('price-input');

        if (document.getElementById('make-bid-btn')) {
            makeBidBtn = document.getElementById('make-bid-btn');
            makeBidBtn.addEventListener('click', () => {
                socket.emit('make bid',{price: priceInput.value, itemId});
            });
        }
        
        socket.on('too low price', (data) => {
            document.getElementById('too-low').hidden = false;
            priceInput.value = '';    
        });

        socket.on('offer made', () => {
            if (!document.getElementById('too-low').hidden)
                document.getElementById('too-low').hidden = true;
            document.getElementById('offer-made').hidden = false; 
            priceInput.disabled = true;
        });

        console.log(itemId);
        if (document.getElementById('buy-now-btn')) {
            buyNowBtn = document.getElementById('buy-now-btn');
            buyNowBtn.addEventListener('click', () => {
                socket.emit('buy now', {itemId});
            });
        }
    }
};