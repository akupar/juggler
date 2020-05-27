import { symbol } from "./types";

const constants = {
    "π" : {
        ...symbol("π"),
        _approx: 3.14
    }
};

export function constant(symbol) {
    return constants[symbol];
}
