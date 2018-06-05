/*jshint jquery: true, devel: true, esversion: 6*/
function createGameBoard(len, selector) {
    let div = $('<div>', { 'id' : 'inputs'});
    for (let i = 0; i < len; ++i)      
        $('<input>', {'id' : 'input-' + i}).appendTo(div);
    let sendAnswerBtn = $('<button>',{'id': 'send-answer', 'text' : 'Wyślij'});
    
    sendAnswerBtn.click(e => {
            let inputs = $('input[id^=input-]');
            let answers = [];
            
            inputs.each(function() {
                if (!this.value) {
                     alert('Nie podałeś wszystkich wartości');
                     return false;
                }
                answers.push(parseInt(this.value));
            });

            let request = $.ajax({
                method: 'POST',
                url: 'http://localhost:3000/mark',
                data: JSON.stringify({answer : answers}),
                dataType: 'json',
                contentType: "application/json"
            });

            request.done(data => {
                console.log(data);
                prependResult(data, answers);
            });

            request.fail( (jqXHR, statusText) => {
                console.log(statusText);
            });
    }); 

    sendAnswerBtn.appendTo(div);
    $(selector).html(div);
}

function prependResult(result, answers) {
    let lastTurn = answers.join(" ");
    $("<span>Black Points: " + result.black +", White Points: " + result.white+ "</span><span> Last turn: " + lastTurn + "</span></br>").insertAfter($('#game-board')).hide().show('slow');
    $('input').val('');

}

$(function () {
    let gameParams = $('#game-params');
    let size = $('#size');
    let dim = $('#dim');
    let playBtn = $('#new-game');

    let maxMoves = 5;
    let gameBorad = $('#game-board');
    let gameData = {
        size: 0,
        dim: 0,
        max: maxMoves
    };

    let detachedGameBoard = gameBorad.detach();

    playBtn.click(e => {
        let detachedGameParams;

        if (size.val() && dim.val()) {
            gameData.size = parseInt(size.val());
            gameData.dim = parseInt(dim.val());
            
            let request = $.ajax({
                method: 'POST',
                url: 'http://localhost:3000/play',
                data: JSON.stringify(gameData),
                dataType: "json",
                contentType: "application/json"
            });
            
            request.done((data) => {
                $('body').append(detachedGameBoard);
                detachedGameParams = gameParams.detach();  
                createGameBoard(data.colors.length,'#game-board');
            });

            request.fail((jqXHR, textStatus) => {
                alert('Coś poszło nie tak! :(');
                console.log(textStatus);
            });
        } 
        else {
            alert('Nie podałeś wszystkich parametrów gry!');
        }
    });
    

});
