import store from "./store";
import { setDisplayTextAndReturn } from "../util/functions";
import { chomp } from "../util/number";
import { auto, int, variable } from "../types";

// a^(1/b) = r[b](a)
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: variable("a"),
        1: {
            oper: "/",
            0: auto(1),
            1: variable("b")
        }
    },
    1: {
        oper: "(root)",
        0: variable("a"),
        1: variable("b")
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
            0: variable("a"),
            1: variable("c")
        },
        1: variable("c")
    },
    1: {
        oper: ";",
        0: variable("a"),
        1: {
            oper: "≥",
            0: variable("a"),
            1: auto(0)
        }
    }
},
"Eliminoi juuri ja potenssi",
);



// a [root] b = c | c.approx
store.addEquation2({
    0: {
        oper: "(root)",
        0: int(variable("a")),
        1: int(variable("b")),
        "?_approx": variable("approx")
    },
    1: setDisplayTextAndReturn("c | ~c", function c({ $a, $b }) {
        let rootfunc;
        if ( $b === 2 ) {
            rootfunc = x => Math.sqrt(x);
        } else if ( $b === 3 ) {
            rootfunc = x => Math.cbrt(x);
        } else {
            rootfunc = x => Math.pow(x, 1/$b);
        }
        
        const r = rootfunc($a);
        
        if ( Math.pow(chomp(r), $b) === $a ) {
                return {
                    item: "(val)",
                    0: r
            };
        }

        return {
            oper: "(root)",
            0: int($a),
            1: int($b),
            _approx: r,
            display: ":approx"
        };
    }),
    where: ({ $approx }) => {
        return !$approx;
    },
    desc: "Calculate approximate value of root"
});



