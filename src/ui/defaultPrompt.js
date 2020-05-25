export function defaultPrompt(vars, unbound) {
    for ( let unboundVariable of unbound ) {
        let val = prompt("Anna arvo muuttujalle " + unboundVariable, vars[unboundVariable]);
        if ( val === null ) {
            return false;
        }

        if ( val === "" ) {
            val = unboundVariable;
        }

        const num = parseInt(val);
        if ( num.toString() === val ) {
            vars[unboundVariable] = {
                item: "(val)",
                0: val
            };
        } else {
            vars[unboundVariable] = {
                item: "(sym)",
                0: val
            };
        }
    }

    return true;
}

