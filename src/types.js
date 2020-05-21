
export function func(name) {
    return {
        item: "(func)",
        0: "?" + name
    };
}

export function int(val) {
    if ( val < 0 ) {
        return {
            oper: "-",
            0: {
                item: "(val)",
                0: Math.abs(val)
            }
        };
    }

    
    return {
        item: "(val)",
        0: val
    };
}

export function symbol(sym) {
    return {
        item: "(sym)",
        0: sym
    };
}

export function im(sym) {
    return {
        item: "(imaginary)",
        0: "?" + sym
    };
}

export function variable(val) {
    if ( typeof(val) !== "string" ) {
        throw new Error("Error: uknown value " + val);
    }
    
    return val;
}

export function auto(val) {
    if ( Number.isInteger(val) ) {
        return int(val);
    } else if ( typeof(val) === "string" ) {
        return variable(val);
    } 

    throw new Error("Error: uknown value " + val);
}

