import store from "./store";
import { auto } from "../types";

// a^2 = a×a
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: "a",
        1: auto(2)
    },
    1: {
        oper: "×",
        0: "a",
        1: "a" 
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
        0: "a",
        1: {
            oper: "-",
            0: auto(1)
        }
    },
    1: {
        oper: "/",
        0: auto(1),
        1: "a" 
    }
}, "Muuta kertolaskuksi", "Muuta toiseksi potenssiksi");

// a^x / a^y = a ^ (x - y)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "^",
            0: "a",
            1: "x"
        },
        1: {
            oper: "^",
            0: "a",
            1: "y"
        }
    },
    1: {
        oper: "^",
        0: "a",
        1: {
            oper: "-",
            0: "x",
            1: "y"
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
        0: {
            item: "(val)",
            0: "a"
        },
        1: {
            item: "(val)",
            0: "b"
        }
    },
    1: function c (vars) {
        return {
            item: "(val)",
            0: Math.pow(vars["a"], vars["b"])
        };
    }
}, "Evaluoi potenssilasku");

// (-a)^b -> val(a) ^ val(b)
store.addEquation({
    oper: "->",
    0: {
        oper: "^",
        0: {
            oper: "-",
            0: {
                item: "(val)",
                0: "a"
            }
        },
        1: {
            item: "(val)",
            0: "b"
        }
    },
    1: function c (vars) {
        const r = Math.pow(vars["a"], vars["b"]);

        if ( r < 0 ) {
            return {
                item: "(val)",
                0: {
                    oper: "-",
                    0: {
                        item: "(val)",
                        0: -r
                    }
                }
            };
        } else {
            return {
                item: "(val)",
                0: r
            };
        }
    }
}, "Evaluoi potenssilasku");


// val(c) -> val(a) ^ val(b)
store.addEquation({
    oper: "->",
    0: {
        item: "(val)",
        0: "c"
    },
    1: {
        oper: "^",
        0: {
            item: "(val)",
            0: "a"
        },
        1: {
            item: "(val)",
            0: "b"
        }
    }
}, "Muuta a:n ja b:n potenssilaskuksi");


