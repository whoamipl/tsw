// jshint esversion: 6
function createImage(input, imageContainer) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('image').setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        imageContainer.hidden = false;
    }
}
document.onreadystatechange = () => {
    let thumbs = [];
    if (document.readyState === "interactive") {
        let buyNow = document.getElementById('buy-now');
        let auction = document.getElementById('auction');
        let datePicker = document.getElementById('date-picker');
        let datePickerLabel = document.getElementById('date-picker-lbl');
        let pictureInput = document.getElementById('picture-input');
        let pictureDropbox = document.getElementById('picture-dropbox');
        let imageContainer = document.getElementById('image');
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
            }   
        });
        pictureInput.addEventListener('change', (e) => {
            createImage(e.target, imageContainer);
        });
    }
}
