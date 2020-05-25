import store from "./store";
import { auto, int, variable } from "../types";

// a^2 = a×a
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: variable("a"),
        1: auto(2)
    },
    1: {
        oper: "×",
        0: variable("a"),
        1: variable("a") 
    }
},
"Muuta kertolaskuksi",
"Muuta toiseksi potenssiksi"
);

// a^-1 = 1/a
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: variable("a"),
        1: {
            oper: "-",
            0: auto(1)
        }
    },
    1: {
        oper: "/",
        0: auto(1),
        1: variable("a") 
    }
}, "Muuta kertolaskuksi", "Muuta toiseksi potenssiksi");

// a^x / a^y = a ^ (x - y)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "^",
            0: variable("a"),
            1: variable("x")
        },
        1: {
            oper: "^",
            0: variable("a"),
            1: variable("y")
        }
    },
    1: {
        oper: "^",
        0: variable("a"),
        1: {
            oper: "-",
            0: variable("x"),
            1: variable("y")
        }
    }
},
"Yhdistä samankantaiset",
"Erota samankantaisiksi"
);

// a^b -> val(a) ^ val(b)
store.addEquation({
    oper: "->",
    0: {
        oper: "^",
        0: int(variable("a")),
        1: int(variable("b"))
    },
    1: function c ({ a, b }) {
        return int(Math.pow(a, b));
    }
}, "Evaluoi potenssilasku");


// (-a)^b -> val(a) ^ val(b)
store.addEquation({
    oper: "->",
    0: {
        oper: "^",
        0: {
            oper: "-",
            0: int(variable("a"))
        },
        1: int(variable("b"))
    },
    1: function c ({ a, b }) {
        const r = Math.pow(a, b);

        if ( r < 0 ) {
            return {
                    oper: "-",
                    0: int(-r)
            };
        } else {
            return int(r);
        }
    }
}, "Evaluoi potenssilasku");


// val(c) -> val(a) ^ val(b)
store.addEquation({
    oper: "->",
    0: int(variable("c")),
    1: {
        oper: "^",
        0: int(variable("a")),
        1: int(variable("b"))
    }
}, "Muuta a:n ja b:n potenssilaskuksi");


