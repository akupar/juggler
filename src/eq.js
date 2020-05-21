/**
 * Helper utils to use in equations.
 **/


/**
 * Matches any content inside __match_up pragma.
 **/
//export const any = "";

/**
 * Adds the __match_up pragma to object `obj` with name `variableName`.
 **/
export function contains(variableName, obj) {
    return {
        ...obj,
        __match_up: variableName
    };
}

