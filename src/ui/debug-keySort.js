/**
 * Dirty hack to sort oper before other members.
 * Used only in debug module.
 **/

function replaceHelper(data) {
    const copy = {};
    
    for ( let key in data ) {
        copy["00000" + key] = typeof(data[key]) === "object"
                            ? replaceHelper(data[key])
                            : data[key];
    }
    
    return copy;
}

function replaceHelper2(copy) {
    const copy2 = {};

    for ( let key in copy ) {
        if ( key === "00000oper" ) {
            copy2[0] = typeof(copy[key]) === "object"
                     ? replaceHelper2(copy[key])
                     : copy[key];
        } else {
            copy2[key] = typeof(copy[key]) === "object"
                       ? replaceHelper2(copy[key])
                       : copy[key];
        }
    }

    return copy2;
}

function replaceKey00000(data) {
    const copy = replaceHelper(data);
    const copy2 = replaceHelper2(copy);
    
    return copy2;
}

export function expressionToString(expression) {
    const elemData = replaceKey00000(expression);
    const str = JSON.stringify(elemData, null, 2);
    
    const text = str.replace(/"0":/g, "\"oper\":").replace(/"00000/g, "\"");
    
    return text;
}
