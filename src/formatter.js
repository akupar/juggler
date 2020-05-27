import formatters from "./formatters/index";
import { getBasenameOfVariable, getKeys, isVariable } from "./util";
import {
    createBlock,
    getEq
} from "./ui/block";



/**
 * Oletusmuotoilija muotoilee JavaScript-objektista.
 **/
function defaultFormatter(_, expr) {
    const content = ["{ "];
    for ( let key in expr ) {
        if ( typeof(key) === "number" ) {
            content.push("" + key + " = ");
        } else if ( typeof(key) === "string" ) {
            content.push("\"" + key + "\" = ");
        } else {
            throw new Error("Outo tyyppi: " + typeof(key));
        }
        
        if ( typeof(expr[key]) === "object" ) {
            content.push(format(expr[key]));
        } else if ( typeof(key) === "string" ) {
            content.push("\"" + expr[key] + "\"");
        } else {
            throw new Error("Outo tyyppi: " + typeof(key));
        }
        
        content.push(", ");
    }
    if ( content[content.length - 1] === ", " ) {
        content[content.length - 1] = " }";
    } else {
        content.push(" }");        
    }

    return createBlock("mtext", content, expr);
}




/**
 * Palauttaa jqueryksi muutetun lauseke-elementin takaisin.
 **/
export function deformat(elem) {
    //console.log("DEFORMAT:", elem, (elem instanceof Node));
    if ( !(elem instanceof Node) ) {
        if ( elem === parseInt(elem).toString() ) {
            return parseInt(elem);
        }
        return elem;
    }
    
    var struct = getEq(elem);
    console.assert(struct !== undefined, "UNDEFINED data:", elem);
    var keys = getKeys(struct);
    if ( keys.length === 0 ) {
        return struct;
    }
    
    var obj = {};
    for ( let key of keys ) {
        if ( typeof(struct[key]) === "string" && struct[key].startsWith("#") ) {
            let id = struct[key].replace("#", "");
            obj[key] = deformat(document.getElementById(id));
        } else {
            obj[key] = deformat(struct[key]);
        }
    }

    return obj;
}

/**
 * Block representing variable.
 **/
export function createVariableBlock(expr) {
    const block = createBlock("mi", expr.replace(/^\((.*)\)$/, "$1"), expr);
    block.classList.add("variable");

    return block;
}

export function format(expr) {
    if ( typeof(expr) === "function" ) {
        return createBlock("mtext", expr.displayText || expr.name, null);
    } else if ( typeof(expr) === "string" && isVariable(expr) ) {
        return createVariableBlock(getBasenameOfVariable(expr));
    } else if ( typeof(expr) === "string" ) {
        return createBlock((Number.isInteger(expr) ? "mn" : "mi"), expr, expr);
    } else if ( typeof(expr) !== "object" ) {
        return createBlock((Number.isInteger(expr) ? "mn" : "mi"), expr, expr);
    }


    const { equation, vars } = formatters.bestMatch(expr);

    const formatter = equation ? equation[1] : defaultFormatter;

    const elem = formatter(vars, expr);

    return elem;
}


console.log("formatter loaded");
