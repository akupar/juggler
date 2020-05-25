const any = "";

/**
 * Returns elements of A that are not in B.
 **/
function difference(setA, setB) {
    let _difference = new Set(setA);
    for ( let elem of setB ) {
        _difference.delete(elem);
    }
    return _difference;
}

/* function symmetricDifference(setA, setB) {
 *     let _difference = new Set(setA);
 *     for (let elem of setB) {
 *         if (_difference.has(elem)) {
 *             _difference.delete(elem);
 *         } else {
 *             _difference.add(elem);
 *         }
 *     }
 *     return _difference;
 * }
 *  */
function setsAreEqual(a, b) {
    return a.size === b.size && [...a].every(value => b.has(value));
}

/**
 * Replace old value `oldRef` with `newRef` everywhere in `expr` recursively.
 **/
export function replaceValue(expr, oldRef, newRef) {
    var copy = {};
    
    for ( let key of getKeys(expr) ) {
        if ( expr[key] === oldRef ) {
            copy[key] = newRef;
            ////console.log('replaced ', oldRef, 'with', newRef);
        } else if ( typeof(expr[key]) === "object" ) {
            copy[key] = replaceValue(expr[key], oldRef, newRef);
        } else {
            copy[key] = expr[key];
        }
    }
    return copy;
}


/**
 * Palauttaa muuttujat jotka on oikealla [1] puolella muttei vasemmalla [0] puolella.
 **/
export function getUnboundVariables(equation) {
    const varsLeft  = new Set(getVariables(equation[0])),
          varsRight = new Set(getVariables(equation[1]));
    
    //console.log(JSON.stringify(equation), "VARS:", varsLeft, varsRight, "DIFF:", difference(varsRight, varsLeft));
    
    return [...difference(varsRight, varsLeft)];
}


export function getKeys(item) {
    if ( typeof(item) === "string" || typeof(item) === "number" || typeof(item) === "function" ) {
        return [];
    }
    
    return Object.keys(item);
}

export function isVariable(elem) {
    if ( elem && elem[0] === "$" ) {
        return true;
    }
    
    //if ( elem && elem.match && elem.match(/^[a-zA-Zθ]/u)  && elem !== "i" /* TODO */ ) {
    //return true;
    //}
    
    return false;
}

export function getBasenameOfVariable(variableName) {
    return variableName.substr(1);
}


function isExpression(elem) {
    if ( typeof(elem) === "object" ) {
        return true;
    }
    
    return false;
}

export function listsEqual(list1, list2) {
    var i;

    if ( !list1 || typeof(list1) !== "object" || list1.length === undefined
      || !list2 || typeof(list2) !== "object" || list2.length === undefined ) {
        throw new TypeError("Value must be array");
    }
    
    if ( list1.length !== list2.length ) {
        return false;
    }

    list1 = list1.sort();
    list2 = list2.sort();
    
    for ( i = 0; i < list1.length; i++ ) {
        if ( list1[i] !== list2[i] ) {
            return false;
        }
    }

    return true;
}


export function hasRequiredKeysOf(listF, listE) {


    const Eall = new Set(listE);
    const Fall = new Set(listF.map(elem => elem.replace(/^\?/, "")));
    const Freq = new Set(listF.filter(elem => !elem.startsWith("?")));

    //console.log("expr:", Eall, "eq_all:", Fall, "eq_req:", Freq);

    // If E has all the required keys of F and no extra than all possible keys of F.
    if ( setsAreEqual(difference(Freq, Eall), difference(Eall, Fall)) ) {
        return true;
    }

    return false;
}

export function hasRequiredKeysOf2(listF, listE) {
    const Freq = new Set(listF);
    const Eall = new Set(listE);
    
    const debug = false;
    if ( debug ) {
        console.log("Freq:", Freq, "Eall:", Eall);
    }

    if ( difference(Freq, Eall).size > 0 ) {
        return false;
    }
    
    const diff = difference(Eall, Freq);
    
    if ( ![...diff].every(elem => elem.startsWith("_")) ) {
        return false;
    }

    return true;
}


export function hasRequiredKeysOf3(listF, listE) {
    const Eall = new Set(listE);
    const Fall = new Set(listF.map(elem => elem[0] === "?" ? elem.substr(1) : elem));
    const Freq = new Set(listF.filter(elem => !elem.startsWith("?")));
    
    
    const debug = false;
    if ( debug ) {
        console.log("Freq:", Freq, "Eall:", Eall);
    }

    // See if E is missing any required keys
    if ( difference(Freq, Eall).size > 0 ) {
        return false;
    }

    // See if E has any extra keys that do not start with _
    const diff = difference(Eall, Fall);
    if ( ![...diff].every(elem => elem.startsWith("_")) ) {
        return false;
    }

    return true;
}


export function deepEqual(expr1, expr2) {
    if ( typeof(expr1) !== typeof(expr2) ) {
        return false;
    }
    
    if ( typeof(expr1) === "string" ) {
        return (expr1 === expr2);
    } else if ( typeof(expr1) === "number" ) {
        return (expr1 === expr2);
    }

    const keys1 = getKeys(expr1).filter((key) => ! key.startsWith("__")),
          keys2 = getKeys(expr2).filter((key) => ! key.startsWith("__"));

    if ( ! listsEqual(keys1, keys2) ) {
        return (expr1 === expr2);
    }
    
    var i;
    for ( i = 0; i < keys1.length; i++ ) {
        const key = keys1[i];
        if ( ! deepEqual(expr1[key], expr2[key]) ) {
            return false;
        }
    }
    
    return true;
}



/**
 * Vertaa vastaako `input` `formulaa` ja kirjoittaa muuttujat `varsiin`, jos annettu.
 * Palauttaa 0, jos lausekkeet eivät mätsää, muuten arvon joka kertoo kuinka paljon mätsäävää oli.
 **/
export function match(formula, input, vars = {}) {
    let score = 1;
    let debug = false;

    //if ( JSON.stringify(input||"").indexOf("(xxx)") > -1 ) {
    //        debug = true;
    //    }
    if ( formula
      && (formula.oper === "/" || formula === "approx") ) {
        //debug  = true;
    }
    
    if ( debug ) {
        console.log("formula:", formula, "keys:", getKeys(formula || []));
        console.log("input:", input, "keys:", getKeys(input || []));
    }

    if ( isVariable(formula) ) {
        if ( debug ) {
            console.log(" muuttuja");
        }
        

        const name = getBasenameOfVariable(formula);
        // Jos samanniminen muuttuja on jo tullut vastaan, tarkistetaan, että
        // niiden arvot täsmäävät.
        if ( vars[name] !== undefined ) {
            //console.log('Muutuja', name, 'on jo', vars[name], 'nyt:', input);
        }
        
        if ( vars[name] !== undefined ) {
            if ( ! deepEqual(vars[name], input) ) {
                return 0;
            }
            score+=5;
        }

        // Input can be undefined if key is optional.
        if ( input !== undefined ) { 
            vars[name] = input;
        }

    } else if ( formula === input ) {
        if ( debug ) { console.log("samat"); }
        return 1;

    } else if ( formula === undefined || input === undefined ) {
        if ( debug ) {
            console.log("  undefined");
        }
        
        return 0;
        
    } else if ( isExpression(formula) ) {
        if ( debug ) {
            console.log("EXPRSSION");
        }
        const keys_f = getKeys(formula).filter((key) => ! key.startsWith("__")),
              keys_i = getKeys(input).filter((key) => ! key.startsWith("__"));
        
        if ( !hasRequiredKeysOf3(keys_f, keys_i) ) {
            if ( debug ) {
                console.log("ERI KEYS: ", keys_f, keys_i);
            }
            return 0;
        }

        for ( let key of keys_i ) {

            const member = formula[key] || formula["?" + key];
            
            if ( debug ) {
                console.log("KEY:", key, JSON.stringify(member), JSON.stringify(input[key]), JSON.stringify(vars));
            }

            if ( key[0] === "_" && member === undefined ) {
                continue;
            }
            if ( key[0] !== "?" && input[key] === undefined ) {
                continue;
            }
            const subScore = member === any ? 1 : match(member, input[key], vars);
            console.assert(typeof(subScore) === "number");
            if ( subScore === 0 ) {
                return 0;
            }
            score += subScore;
        }
        if ( debug ) {
            console.log("score:", score);
        }


    } else if ( typeof(formula) === typeof(input) ) {
        if ( debug ) {
            console.log(" eri tyyppi");
        }
        
        return 0;
        
    } 

    if ( debug ) {
        console.log("match out, score", score);
    }
    return score;
}

export function apply(formula, vars) {
    const keys = Object.keys(formula);
    const out = {};

    if ( typeof(formula) === "function" ) {
        return formula(vars);
    } else if ( typeof(formula) === "string" ) {    // Vakio.
        const name = getBasenameOfVariable(formula);
        if ( vars[name] !== undefined ) {
            return vars[name];
        }
        return formula;
    } else if ( typeof(formula) !== "object" ) {    // Vakio.
        return formula;
    }

    for ( let keyDef of keys ) {
        const key = keyDef.replace(/^\?/, "");
        
        if ( isVariable(formula[keyDef]) ) {
            const name = getBasenameOfVariable(formula[keyDef]);
            if ( vars[name] !== undefined ) {
                out[key] = vars[name];
            } else if ( keyDef[0] !== "?" ) { // ei valinnainen kenttä
                out[key] = formula[keyDef];
            }
        } else {
            out[key] = apply(formula[keyDef], vars) || formula[keyDef];
        }
        ////console.log("APPLY -> key:", out[key]);
    }

    return out;
}

/**
 * Palauttaa lausekkeen `expr` sitomattomat muuttujat parametrissa `vars`.
 **/
function findVars(expression, vars) {
    
    if ( isVariable(expression) ) {
        const name = getBasenameOfVariable(expression);
        vars[name] = true;
        return;
    } else if ( expression === any || typeof(expression) !== "object" ) {
        return;
    }

    const keys = getKeys(expression);

    for ( let key of keys ) {
        findVars(expression[key], vars);
    }
}

/**
 * Palauttaa lausekkeen `expr` sitomattomat muuttujat parametrissa `vars`.
 **/
export function getVariables(expression) {
    const vars = {};
    
    findVars(expression, vars);

    return Object.keys(vars);
}

export function transform2(equationIn, equationOut, expression, vars = {}) {
    let debug = false;

    if ( ! match(equationIn, expression, vars) ) {
        if ( debug ) {
            console.log("NO MATCH");
        }
        throw new Error("Not matching");
    }

    if ( debug ) {
        console.log("VARS:", vars);
        console.log("MATCH");
    }

    const sticky = Object.keys(expression).filter(elem => elem.startsWith("_"));

    const copy =  apply(equationOut, vars);

    sticky.forEach(elem => copy[elem] = expression[elem]);
    return copy;
}

export function transform(equation, expression, vars = {}) {
    return transform2(equation[0], equation[1], expression, vars);
}


export function bind(symbols, expr) {
    var symbols2 = [];
    if ( typeof(symbols) !== "object" ) {
        symbols2[0] = symbols;
    } else {
        symbols2 = symbols;
    }

    var vars = {};
    
    for ( let item of symbols2 ) {
        vars[item.symbol] = item.val;
    }
    
    var n = apply(expr, vars);
    
    return n;
}


export function deepCopy(obj) {
    if ( obj === null
      || typeof(obj) === "string"
      || typeof(obj) === "number"
      || typeof(obj) === "function" ) {
        return obj;
    }
    
    const copy = {};
    for ( let key of getKeys(obj) ) {
        copy[key] = deepCopy(obj[key]);
    }
    
    return copy;
}

