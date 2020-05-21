import store from "./store";
import { setDisplayTextAndReturn } from "../util/functions";
import { chomp, suppressRepeatingDigits } from "../util/number";
import { auto } from "../types";

// a^(1/b) = r[b](a)
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: "a",
        1: {
            oper: "/",
            0: auto(1),
            1: "b"
        }
    },
    1: {
        oper: "(root)",
        0: "a",
        1: "b"
    }
},
"Muuta juureksi",
"Muuta potenssiksi"
);


// (a [root] c)^c = a
store.addEquation({
    oper: "->",
    0: {
        oper: "^",
        0: {
            oper: "(root)",
            0: "a",
            1: "c"
        },
        1: "c"
    },
    1: {
        oper: ";",
        0: "a",
        1: {
            oper: "≥",
            0: "a",
            1: {
                item: "(val)",
                0: 0
            }
        }
    }
},
"Eliminoi juuri ja potenssi",
);



// a [root] 2 = c
store.addEquation({
    oper: "->",
    0: {
        oper: "(root)",
        0: {
            item: "(val)",
            0: "a"
        },
        1: auto(2)
    },
    1: setDisplayTextAndReturn("c or approx(c)", function c(vars) {
        
        const r = Math.sqrt(vars["a"]);

        if ( Math.pow(chomp(r), 2) === vars["a"] ) {
            return {
                item: "(val)",
                0: r
            };
        }
        
        return {
            oper: "(summary)",
            approx: r,
            display: suppressRepeatingDigits(r.toString()),
            0: {
                oper: "(root)",
                0: {
                    item: "(val)",
                    0: vars["a"]
                },
                1: auto(2)
            }
        };
    })
}, "Evaluoi neliöjuuri sqrt(a)");

