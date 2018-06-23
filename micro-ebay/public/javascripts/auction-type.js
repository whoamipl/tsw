// jshint esversion: 6
function createImage(input, imageContainer) {
    let infoDiv = document.getElementById('info');
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        infoDiv.hidden = true;
        reader.onload = (e) => {
            document.getElementById('image').setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        imageContainer.hidden = false;
    }
    if (!input.files && !input.files[0]) {
        infoDiv.hidden = false;
    }
}

document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let buyNow = document.getElementById('buy-now');
        let auction = document.getElementById('auction');
        let datePicker = document.getElementById('date-picker');
        let datePickerLabel = document.getElementById('date-picker-lbl');
        let pictureInput = document.getElementById('picture-input');
        let pictureDropbox = document.getElementById('picture-dropbox');
        let imageContainer = document.getElementById('image');
        let priceInput = document.getElementById('price-input');
        imageContainer.hidden = true;
        buyNow.addEventListener('click',(e) => {
            if (e.target.checked) {
                auction.checked = false;
                datePicker.hidden = true;
                datePickerLabel.hidden = true;
            }   
        });
        auction.addEventListener('click',(e) => {
            if (e.target.checked) {
                buyNow.checked = false;
                datePicker.hidden = false;
                datePickerLabel.hidden =false;
                priceInput.hidden = true;
            }   
        });
        pictureInput.addEventListener('change', (e) => {
            createImage(e.target, imageContainer);
        });
    }
};
