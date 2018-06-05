//jshint node: true, esversion: 6
const newGame = (req, res) => {
    let size = req.body.size;
    let dim = req.body.dim;
    let max = req.body.max;
    console.log(req.body);
    req.session.colorsArray = ((length, max) => [...new Array(length)]
                              .map(() => Math.round(Math.random() * max) + 1))(size, dim);

    console.log(req.session.colorsArray);
    res.status(200);
    res.send(JSON.stringify({colors: req.session.colorsArray}));
};

const markAnswer = (req, res) => {
    const ocena = (code) => {
        return (move) => {
            let marked = [];
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

            code.forEach((el,index) => {
                if (el == move[index]) {
                    result.black++;
                    marked.push(el);
                }
                else if (move.includes(el) && !marked.includes(el)) 
                    result.white++;
            });
            console.log(result);
            return JSON.stringify({ black: result.black, white: result.white});
        };
    };
    res.status(200);
    let result = ocena(req.session.colorsArray)(req.body.answer);
    res.send(result);
};

module.exports = {
    newGame,
    markAnswer
};