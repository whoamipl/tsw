//jshint browser: true, esversion: 6, devel: true
const lista = [
    { no: 1, name: 'Wiga' },
    { no: 2, name: 'Paterna' },
    { no: 3, name: 'Etira' },
    { no: 4, name: 'Emandorissa' },
    { no: 5, name: 'Patria' },
    { no: 6, name: 'Galacja' },
    { no: 7, name: 'Paeksa' },
    { no: 8, name: 'Pilastra' },
    { no: 9, name: 'Elfira' },
    { no: 10, name: 'Fanabella' },
    { no: 11, name: 'Pustynna Noc' },
    { no: 12, name: 'Gratena' },
    { no: 13, name: 'Matahna' },
    { no: 14, name: 'Panetta' },
    { no: 15, name: 'Baklava' },
    { no: 16, name: 'Piera' },
    { no: 17, name: 'Wersa' },
    { no: 18, name: 'Atanda' },
    { no: 19, name: 'Escalada' },
    { no: 20, name: 'Faworyta' },
    { no: 21, name: 'Angelina' },
    { no: 22, name: 'Kalahari' },
    { no: 23, name: 'Godaiva' },
    { no: 24, name: 'Alamina' },
    { no: 25, name: 'Piacolla' },
    { no: 26, name: 'Wieża Bajek' }
];
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        console.log("Document is ready");
        init();
    }
};

function preparePlayers() {
    
}

function clearHighligt() {
    document.querySelectorAll('li')
    .forEach((elem) => {
        elem.classList.remove('highlight'); 
    });
    document.querySelectorAll('input')
    .forEach((elem) => {
        elem.classList.remove('highlight'); 
    });
}

function toggle(e) {
    console.log(e.target);
    if (e.target.isPlayer) {
        document.getElementById('zawodnik').innerText = e.target.innerHTML;
        document.querySelectorAll('li')
        .forEach((elem) => {
            elem.classList.remove('highlight'); 
        });
    } else {
        document.querySelectorAll('input')
        .forEach((elem) => {
            elem.classList.remove('highlight'); 
        });
    }
    if (e.target.classList.contains('highlight'))
        e.target.classList.remove('highlight');
    else    
        e.target.classList.add('highlight');
   
}

function init() {
    let list = document.getElementById('lista');
    let avg = document.createElement('div');
    avg.id = 'srednia';
    document.getElementById('wyniki').appendChild(avg);
    lista
		.forEach((obj) => {
            let listElement = document.createElement('li');
            listElement.id = obj.no;
            listElement.innerHTML = obj.name;
            listElement.isPlayer = true;
            listElement.addEventListener('click', toggle);
            list.appendChild(listElement);
            obj.avg = [];
        });

    document.querySelectorAll('input')
            .forEach((elem) => { elem.addEventListener('click', toggle); });
    document.querySelectorAll('input')
            .forEach(elem => { elem.setAttribute('maxlength','2');});
    document.querySelectorAll('input')
            .forEach((elem) => { elem.addEventListener('keypress', validate); });
    document.getElementById('wyniki').addEventListener('keydown', calcAvg);     
}

function validate(e) {
    let key = e.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      e.returnValue = false;
    } 
}

function calcAvg(e) {
    console.log(e);
    if (9 == e.keyCode) {
        let player = lista
            .find((element) => element.name === document.getElementById('zawodnik').innerHTML);
        player.avg.push();
    }
    document.getElementById('srednia').innerText = player.avg.reduce( ( p, c ) => p + c, 0 ) / player.avg.length;
} 

