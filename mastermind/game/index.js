//jshint node: true, esversion: 6
const newGame = (req, res) => {

    let size = req.body.size;
    let dim = req.body.dim;
    let max = req.body.max;
    
    req.session.colorsArray = ((length, max) => [...new Array(length)]
                              .map(() => Math.round(Math.random() * max) + 1))(size, dim);
    
    console.log(req.session.colorsArray);
    res.status(200);
    res.send();
};

const markAnswer = (req, res) => {
    const ocena = (code) => {
        return (move) => {
            let result = {
                black: 0,
                white: 0
            };
    
            if (!Array.isArray(move) || !Array.isArray(code)) {  
                throw new Error("Niepoprawne argumenty!");
            }
    
            if (move.length !== code.length) {
                throw new Error("Tablice muszą mieć taki sam rozmiar!");
            }
    
            let whiteArray = code
                .filter((color,index) => { 
                    let tmp = [];
                    if (!(move[index] === color)) {
                        tmp.push(move[index]);
                }
                return tmp;
            });
            result.black = code.length - whiteArray.length;
            result.white = code.filter( function(color) { return delete this[this.indexOf(color)]; }, whiteArray ).length;
            return result;
        };
    };

    res.status(200);
    res.send(game(req.body.move));
};

module.exports = {
    newGame,
    markAnswer
};