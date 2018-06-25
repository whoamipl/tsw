//jshint esversion: 6
const getById = (element) => {
    return document.getElementById(element);
};
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let first = getById('passwordFirst'); 
        let second = getById('passwordSecond');

        second.addEventListener('keyup',(e) => {
            if (e.target.value !== first.value) {
                second.classList.add('border', 'border-danger');
            }   
            else {
                second.classList.remove('border-danger');
                second.classList.add('border-success');
            }
        });
    }
}