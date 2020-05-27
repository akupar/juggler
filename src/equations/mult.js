import store from "./store";
import { auto, int, variable } from "../types";

// a × 0 = 0
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: variable("x"),
        1: auto(0)
    },
    1: auto(0)
}, "Eliminate");

// 0 × a = 0
store.addEquation({
    oper: "->",
    0: {
        oper: variable("×"),
        0: auto(0),
        1: variable("x")
    },
    1: auto(0)
}, "Eliminate");


// a * -b = -(a * b)
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: variable("a"),
        1: {
            oper: "-",
            0: variable("b")
        }
    },
    1: {
        oper: "-",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("b")
        }
    }
});

// -a * b = -(a * b)
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            oper: "-",
            0: variable("a"),
        },
        1: variable("b")
    },
    1: {
        oper: "-",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("b"),
        }
    }
});

// a×2 = a+a
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: variable("a"),
        1: auto(2)
    },
    1: {
        oper: "+",
        0: variable("a"),
        1: variable("a") 
    }
},
                  "Muuta yhteenlaskuksi",
                  "Muuta 2:lla kertomiseksi"
);

// n×a + m×a = (n + m)×a
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: {
            oper: "×",
            0: variable("n"),
            1: variable("a")
        },
        1: {
            oper: "×",
            0: variable("m"),
            1: variable("a")
        }
    },
    1: {
        oper: "×",
        0: {
            oper: "+",
            0: variable("n"),
            1: variable("m") 
        },
        1: variable("a")
    }
},
                  "Muuta yhteenlaskuksi",
                  "Muuta 2:lla kertomiseksi"
);


// a×b = b×a
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: variable("a"),
        1: variable("b") 
    },
    1: {
        oper: "×",
        0: variable("b"),
        1: variable("a") 
    }
}, "Vaihda paikkoja");

//(a × b) × c = b × (a × c)
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c") 
    },
    1: {
        oper: "×",
        0: variable("a"),
        1: {
            oper: "×",
            0: variable("b"),
            1: variable("c")
        }
    }
}, "Liitäntälaki");

//(a × b) + (a × c) = a × (b + c)
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "×",
            0: variable("a"),
            1: variable("c")
        } 
    },
    1: {
        oper: "×",
        0: variable("a"),
        1: {
            oper: "+",
            0: variable("b"),
            1: variable("c")
        }
    }
},
                  "Yhteinen tekijä ulos",
                  "Kerro molemmat"
);

//(a × b) + (a × c) = a × (b + c)
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: {
            oper: "×",
            0: variable("b"),
            1: variable("a")
        },
        1: {
            oper: "×",
            0: variable("c"),
            1: variable("a")
        } 
    },
    1: {
        oper: "×",
        0: {
            oper: "+",
            0: variable("b"),
            1: variable("c")
        },
        1: variable("a")
    }
},
                  "Yhteinen tekijä ulos",
                  "Kerro molemmat"
);

// a×1 = a
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: variable("a"),
        1: auto(1)
    },
    1: variable("a")
},
                  "Poista yhdellä kertominen",
                  "Kerro yhdellä"

);

// a × b -> val(a) * val(b)
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: int(variable("a")),
        1: int(variable("b"))
    },
    1: function c (vars) {
        return {
            item: "(val)",
            0: vars["a"] * vars["b"]
        };
    }
}, "Kerro");

// val(c) -> val(a) × val(b)
store.addEquation({
    oper: "->",
    0: int(variable("c")),
    1: {
        oper: "×",
        0: int(variable("a")),
        1: int(variable("b"))
    }
}, "Muuta a:n ja b:n kertolaskuksi");




store.addEquation2({
    0: {
        oper: "×",
        0: int(variable("a")),
        1: variable("b"),
        "?_approx": variable("approx")
    },
    1: function c({ a, b }) {
        return {
            oper: "×",
            0: int(a),
            1: b,
            _approx: a * b._approx,
            display: ":approx"
        };
    },
    where: ({ b, approx }) => {
        // Match only if parent doesnt already have an approx so to not display
        // both the show approximate value and calculate approximate value.
        return !approx && ("_approx" in b);
    },
    desc: "Display approximate value"
});
