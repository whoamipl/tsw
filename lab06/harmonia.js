// jshint esversion: 6
function toggleDiv(event) {
    let box = event.target.nextElementSibling;
    box.isOpen = !box.isOpen;
    console.log('Click on header');
}

function openDivOnMouseOver(event) {
    let box = event.target.nextElementSibling;
    box.style.display = '';
    console.log('Mouse over...');
}

function closeDivOnMouseOut(event) {
    let box = event.target.nextElementSibling;
    if(!box.isOpen)
        box.style.display = 'none';
    console.log('Mouse out...');
}

function initHarmony() {
    console.log("Harmony initalization...");
    let contentBoxs = document.querySelectorAll('.bd');
    let headers = document.querySelectorAll('.hd');
    Array.from(contentBoxs).forEach(box => {
             box.style.display = 'none';
             box.isOpen = false;
            });
    Array.from(headers)
         .forEach(header => header.addEventListener('click', toggleDiv, false));
    Array.from(headers)
         .forEach(header => header.addEventListener('mouseover', openDivOnMouseOver, false));
    Array.from(headers)
         .forEach(header => header.addEventListener('mouseout', closeDivOnMouseOut, false));
}

