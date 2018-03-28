/* jshint esversion: 6 */
function defFun(fun, types) {
    if (typeof fun !== 'function' && !Array.isArray(types) && types.every(element => String.isString(element))) return;
    fun.typeConstr = types;
    return fun;
}

function appFun(fun, args) {
    if(typeof fun === 'function' && Array.isArray(args) && fun.typeConstr) {
        Array.from(args).
            map((element, index) => {
                if (typeof element === fun.typeConstr[index]) {
                    return;
                } else {
                    throw new Error('Invalid arguments types!');
                }
            });
    } else {
        throw new Error("Invalid arguments.");
    }
    console.log(fun.apply(null, args));
}

const myFun = defFun((a,b) => a + b, ['number', 'number']);


appFun(myFun, 1 , 2);
