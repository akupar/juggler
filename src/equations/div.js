import store from "./store";
import { setDisplayTextAndReturn } from "../util/functions";
import { chomp } from "../util/number";
import { auto, int, variable } from "../types";

// a/(a/b) = b
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: variable("a"),
        1: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        }
    },
    1: variable("b")
});

// (a/b)/c = a/(b*c)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "/",
        0: variable("a"),
        1: {
            oper: "×",
            0: variable("b"),
            1: variable("c")
        }
    }
});

// a × (b / c) = (a × b) / c
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: variable("a"),
        1: {
            oper: "/",
            0: variable("b"),
            1: variable("c")
        }
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    }
});

// a : b = a / b
store.addEquation({
    oper: "=",
    0: {
        oper: ":",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "/",
        0: variable("a"),
        1: variable("b")
    }
}, "Vaihtoehtoinen muoto");


// a/a = 1
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: variable("a"),
        1: variable("a")
    },
    1: auto(1)
});

// a:a = 1
store.addEquation({
    oper: "=",
    0: {
        oper: ":",
        0: variable("a"),
        1: variable("a")
    },
    1: auto(1)
});

// a + b/c = (a * c)/c + b/c
// Pois??
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: int("a"),
        1: {
            oper: "/",
            0: int("b"),
            1: int("c")
        }
    },
    1: {
        oper: "+",
        0: {
            oper: "/",
            0: {
                oper: "×",
                0: int("a"),
                1: int("c")
            },
            1: int("c")
        },
        1: {
            oper: "/",
            0: int("b"),
            1: int("c")
        }
    }
});


// a/c + b/c = (a + b) / c
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "/",
            0: variable("b"),
            1: variable("c")
        }
    },
    1: {
        oper: "/",
        0: {
            oper: "+",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    }
}, "Yhdistä samannimiset", "Erota samannimisiksi");

// (a×b)/b = a
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("b")
    },
    1: variable("a")
});

// b×a/b = a
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "×",
            0: variable("b"),
            1: variable("a")
        },
        1: variable("b")
    },
    1: variable("a")
});

// a / b = (a / b)[sup](c
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "(supistaminen)",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    }
}, "Supista c:llä", "Poista supistus");

// a / b = (a / b)[sup](c)
store.addEquation({
    oper: "=",
    0: {
        oper: "(supistaminen)",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "/",
        0: {
            oper: ":",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: ":",
            0: variable("b"),
            1: variable("c")
        }
    }
},
"Jaa supistajalla",
"Erota supistaja"
);

// a / b = c)[lav](a / b)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "(laventaminen)",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    }
},
"Lavenna c:llä",
"Erota laventaja"
);


// c[lav](a / b) = (ca) / (cb)
store.addEquation({
    oper: "=",
    0: {
        oper: "(laventaminen)",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: variable("c"),
            1: variable("a")
        },
        1: {
            oper: "×",
            0: variable("c"),
            1: variable("b")
        }
    }
},
"Kerro laventajalla",
"Erota laventaja"
);

// a/1 = a
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: variable("a"),
        1: auto(1)
    },
    1: variable("a"),
},
"Poista identiteetillä jakaminen",
"Jaa identiteetillä"
);

// a/b = (c*a) / (c*b)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: variable("c"),
            1: variable("a")
        },
        1: {
            oper: "×",
            0: variable("c"),
            1: variable("b")
        }
    },
},
"Kerro nimittäjä ja osoittaja samalla luvulla c.",
"Jaa c:llä."
);



// (a/b) * (c/d) = (a*c) / (b*d)
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "/",
            0: variable("c"),
            1: variable("d")
        }
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "×",
            0: variable("b"),
            1: variable("d")
        }
    },
},
"Kerro osoittajat ja nimittäjät keskenään",
"Erota osoittajat ja nimittäjät"
);

// (a/b) / (c/d) = (a/b) * (d/c)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "/",
            0: variable("c"),
            1: variable("d")
        }
    },
    1: {
        oper: "×",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "/",
            0: variable("d"),
            1: variable("c")
        }
    },
},
"Kerro ristiin",
"Takaperin: kerro ristiin"
);

// (a/b) : (c/d) = (a/b) * (d/c)
store.addEquation({
    oper: "=",
    0: {
        oper: ":",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "/",
            0: variable("c"),
            1: variable("d")
        }
    },
    1: {
        oper: "×",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "/",
            0: variable("d"),
            1: variable("c")
        }
    },
},
"Kerro ristiin",
"Takaperin: kerro ristiin"
);

// a / b = c | c.approx
store.addEquation2({
    0: {
        oper: "/",
        0: int("a"),
        1: int("b"),
        "?_approx": variable("approx")
    },
    1: setDisplayTextAndReturn("c or approx(c)", function c({ a, b }) {
        const r = a / b;
        console.log("R:", r, r * b, a);
        if ( chomp(r) * b === a ) {
            return {
                item: "(val)",
                0: r
            };
        }

        return {
            oper: "/",
            0: int(a),
            1: int(b),
            _approx: a / b,
            display: ":approx"
        };
    }),
    where: ({ approx }) => {
        return !approx;
    },
    desc: "Calculate approximate value"
});

// a : b = c | c.approx
store.addEquation2({
    0: {
        oper: ":",
        0: int("a"),
        1: int("b"),
        "?_approx": variable("approx")
    },
    1: setDisplayTextAndReturn("c | ~c", function c({ a, b }) {
        const r = a / b;
        console.log("R:", r, r * b, a);
        if ( chomp(r) * b === a ) {
            return {
                item: "(val)",
                0: r
            };
        }

        return {
            oper: ":",
            0: int(a),
            1: int(b),
            _approx: r,
            display: ":approx"
        };
    }),
    where: ({ approx }) => {
        return !approx;
    },
    desc: "Calculate approximate value"
});





// a / ~b = ~c
store.addEquation2({
    0: {
        oper: "/",
        0: int(variable("a")),
        1: variable("b"),
        "?_approx": variable("approx")
    },
    1: function c({ a, b }) {
        return {
            oper: "/",
            0: int(a),
            1: b,
            _approx: a / b._approx,
            display: ":approx"
        };
    },
    where: ({ b, approx }) => {
        return !approx && ("_approx" in b);
    },
    desc: "Calculate approximate value"
});
