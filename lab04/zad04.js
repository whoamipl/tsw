/*jshint strict: global, esversion: 6 */
'use strict';
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
                if (!(move[index] == color)) {
                    tmp.push(move[index]);
            }
            return tmp;
        });
        result.black = code.length - whiteArray.length;
        result.white = code.filter( function(color) { return delete this[this.indexOf(color)]; }, whiteArray ).length;
    };
};