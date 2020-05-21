import store from "./store";
import { auto, int } from "../types";

// a × 0 = 0
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: "x",
        1: auto(0)
    },
    1: auto(0)
}, "Eliminate");

// 0 × a = 0
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: auto(0),
        1: "x"
    },
    1: auto(0)
}, "Eliminate");


// a * -b = -(a * b)
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: "a",
        1: {
            oper: "-",
            0: "b"
        }
    },
    1: {
        oper: "-",
        0: {
            oper: "×",
            0: "a",
            1: "b"
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
            0: "1",
        },
        1: "b"
    },
    1: {
        oper: "-",
        0: {
            oper: "×",
            0: "a",
            1: "b",
        }
    }
});

// a×2 = a+a
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: "a",
        1: auto(2)
    },
    1: {
        oper: "+",
        0: "a",
        1: "a" 
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
            0: "n",
            1: "a"
        },
        1: {
            oper: "×",
            0: "m",
            1: "a"
        }
    },
    1: {
        oper: "×",
        0: {
            oper: "+",
            0: "n",
            1: "m" 
        },
        1: "a"
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
        0: "a",
        1: "b" 
    },
    1: {
        oper: "×",
        0: "b",
        1: "a" 
    }
}, "Vaihda paikkoja");

//(a × b) × c = b × (a × c)
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            oper: "×",
            0: "a",
            1: "b"
        },
        1: "c" 
    },
    1: {
        oper: "×",
        0: "a",
        1: {
            oper: "×",
            0: "b",
            1: "c"
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
            0: "a",
            1: "b"
        },
        1: {
            oper: "×",
            0: "a",
            1: "c"
        } 
    },
    1: {
        oper: "×",
        0: "a",
        1: {
            oper: "+",
            0: "b",
            1: "c"
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
            0: "b",
            1: "a"
        },
        1: {
            oper: "×",
            0: "c",
            1: "a"
        } 
    },
    1: {
        oper: "×",
        0: {
            oper: "+",
            0: "b",
            1: "c"
        },
        1: "a"
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
        0: "a",
        1: {
            item: "(val)",
            0: 1
        }
    },
    1: "a"
},
"Poista yhdellä kertominen",
"Kerro yhdellä"

);

// a × b -> val(a) * val(b)
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: int("a"),
        1: int("b")
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
    0: int("c"),
    1: {
        oper: "×",
        0: int("a"),
        1: int("b")
    }
}, "Muuta a:n ja b:n kertolaskuksi");



// a × summary(b) = summary(a × b)
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: int("a"),
        1: {
            oper: "(summary)",
            approx: "approx",
            display: "approximation",
            0: "b"
        }
    },
    1: function c (vars) {
        return {
            oper: "(summary)",
            0: {
                oper: "×",
                0: int(vars["a"]),
                1: vars["b"]
            },
            approx: (vars["a"] * vars["approx"]),
            display: (vars["a"] * vars["approx"]) + "..."
        };
    }
},
"Multiply numbers"
);



// a × summary(b) = summary(a × b)
store.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: {
            oper: "(summary)",
            approx: "approx",
            display: "approximation",
            0: "b"
        },
        1: int("a")
    },
    1: function c (vars) {
        return {
            oper: "(summary)",
            0: {
                oper: "×",
                0: vars["b"],
                1: int(vars["a"])
            },
            approx: (vars["a"] * vars["approx"]),
            display: (vars["a"] * vars["approx"]) + "..."
        };
    }
},
"Multiply numbers"
);
