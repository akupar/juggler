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
    if ( elem && elem.match && elem.match(/^[a-zA-Zθ]/u)  && elem !== "i" /* TODO */ ) {
        return true;
    }
    
    return false;
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
    const isSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

    const Eall = new Set(listE);
    const Fall = new Set(listF.map(elem => elem.replace(/^\?/, "")));
    const Freq = new Set(listF.filter(elem => !elem.startsWith("?")));

    //console.log("expr:", Eall, "eq_all:", Fall, "eq_req:", Freq);

    // If E has all the required keys of F and no extra than all possible keys of F.
    if ( isSetsEqual(difference(Freq, Eall), difference(Eall, Fall)) ) {
        return true;
    }

    return false;
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
      && (formula.__match_up || formula.oper === "/" || formula === "approx") ) {
        //debug  = true;
    }
    
    if ( debug ) {
        console.log("formula:", formula, "keys:", getKeys(formula || []));
        console.log("input:", input, "keys:", getKeys(input || []));
    }

    if ( formula === any ) { // jokerimerkki __match_up-pragman sisällä, huom. muualla hävittää arvon!
        console.log(" any");
        return 1;
        
    } else if ( isVariable(formula) ) {
        if ( debug ) {
            console.log(" muuttuja");
        }
        

        const name = formula;
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
        
        if ( !formula.__match_up &&  !hasRequiredKeysOf(keys_f, keys_i) ) {
            if ( debug ) {
                console.log("ERI KEYS: ", keys_f, keys_i);
            }
            return 0;
        }

        for ( let keyDef of keys_f ) {
            const key = keyDef.replace(/^\?/, "");
            
            if ( debug ) {
                console.log("KEY:", keyDef, JSON.stringify(formula[keyDef]), JSON.stringify(input[key]), JSON.stringify(vars));
            }

            if ( keyDef[0] !== "?" && input[key] === undefined ) {
                continue;
            }
            const subScore = formula[keyDef] === any ? 1 : match(formula[keyDef], input[key], vars);
            console.assert(typeof(subScore) === "number");
            if ( subScore === 0 ) {
                return 0;
            }
            score += subScore;
        }
        if ( debug ) {
            console.log("score:", score);
        }

        const name = formula.__match_up;
        if ( name ) {
            //console.log("HAS __MATCH_UP:", name, "INPUT:", input);
            if ( vars[name] !== undefined ) {
                if ( ! deepEqual(vars[name], input) ) {
                    return 0;
                }
                score+=5;
            }
            vars[name] = input;
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

    if ( formula.__match_up ) {
        formula = formula.__match_up;
    }
    
    if ( typeof(formula) === "function" ) {
        return formula(vars);
    } else if ( typeof(formula) !== "object" ) {    // Vakio.
        if ( vars[formula] !== undefined ) {
            return vars[formula];
        }
        return formula;
    }

    for ( let key of keys ) {
        if ( isVariable(formula[key]) ) {
            let name = formula[key];
            if ( vars[name] !== undefined ) {
                out[key] = vars[name];
            } else {
                out[key] = formula[key];
            }
        } else {
            out[key] = apply(formula[key], vars) || formula[key];
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
        vars[expression] = true;
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
    if ( JSON.stringify(equationIn).indexOf("__match_up") >= 0 || equationIn.oper === "/" ) {
        //debug = false;
        //console.log("TR2:", JSON.stringify(equationIn));
    }

    if ( ! match(equationIn, expression, vars) ) {
        if ( debug ) {
            console.log("NO MATCH");
        }
        throw new Error("Not matching");
    }
    if ( debug ) {
        console.log("MATCH");
    }

    return apply(equationOut, vars);
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

