import store from "./store";
import { setDisplayTextAndReturn } from "../util/functions";
import { chomp, suppressRepeatingDigits } from "../util/number";
import { auto, int } from "../types";

// a/(a/b) = b
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: "a",
        1: {
            oper: "/",
            0: "a",
            1: "b"
        }
    },
    1: "b"
});

// (a/b)/c = a/(b*c)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "/",
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "/",
        0: "a",
        1: {
            oper: "×",
            0: "b",
            1: "c"
        }
    }
});

// a × (b / c) = (a × b) / c
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: "a",
        1: {
            oper: "/",
            0: "b",
            1: "c"
        }
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: "a",
            1: "b"
        },
        1: "c"
    }
});

// a : b = a / b
store.addEquation({
    oper: "=",
    0: {
        oper: ":",
        0: "a",
        1: "b"
    },
    1: {
        oper: "/",
        0: "a",
        1: "b"
    }
}, "Vaihtoehtoinen muoto");


// a/a = 1
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: "a",
        1: "a"
    },
    1: auto(1)
});

// a:a = 1
store.addEquation({
    oper: "=",
    0: {
        oper: ":",
        0: "a",
        1: "a"
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
            0: int("a"),
            1: int("c")
        },
        1: {
            oper: "/",
            0: int("b"),
            1: int("c")
        }
    },
    1: {
        oper: "/",
        0: {
            oper: "+",
            0: "a",
            1: "b"
        },
        1: "c"
    }
}, "Yhdistä samannimiset", "Erota samannimisiksi");

// (a×b)/b = a
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "×",
            0: "a",
            1: "b"
        },
        1: "b"
    },
    1: "a"
});

// b×a/b = a
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: {
            oper: "×",
            0: "b",
            1: "a"
        },
        1: "b"
    },
    1: "a"
});

// a / b = (a / b)[sup](c
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: "a",
        1: "b"
    },
    1: {
        oper: "(supistaminen)",
        0: {
            oper: "/",
            0: "a",
            1: "b"
        },
        1: "c"
    }
}, "Supista c:llä", "Poista supistus");

// a / b = (a / b)[sup](c)
store.addEquation({
    oper: "=",
    0: {
        oper: "(supistaminen)",
        0: {
            oper: "/",
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "/",
        0: {
            oper: ":",
            0: "a",
            1: "c"
        },
        1: {
            oper: ":",
            0: "b",
            1: "c"
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
        0: "a",
        1: "b"
    },
    1: {
        oper: "(laventaminen)",
        0: {
            oper: "/",
            0: "a",
            1: "b"
        },
        1: "c"
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
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: "c",
            1: "a"
        },
        1: {
            oper: "×",
            0: "c",
            1: "b"
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
        0: "a",
        1: auto(1)
    },
    1: "a",
},
"Poista identiteetillä jakaminen",
"Jaa identiteetillä"
);

// a/b = (c*a) / (c*b)
store.addEquation({
    oper: "=",
    0: {
        oper: "/",
        0: "a",
        1: "b"
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: "c",
            1: "a"
        },
        1: {
            oper: "×",
            0: "c",
            1: "b"
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
            0: "a",
            1: "b"
        },
        1: {
            oper: "/",
            0: "c",
            1: "d"
        }
    },
    1: {
        oper: "/",
        0: {
            oper: "×",
            0: "a",
            1: "c"
        },
        1: {
            oper: "×",
            0: "b",
            1: "d"
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
            0: "a",
            1: "b"
        },
        1: {
            oper: "/",
            0: "c",
            1: "d"
        }
    },
    1: {
        oper: "×",
        0: {
            oper: "/",
            0: "a",
            1: "b"
        },
        1: {
            oper: "/",
            0: "d",
            1: "c"
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
            0: "a",
            1: "b"
        },
        1: {
            oper: "/",
            0: "c",
            1: "d"
        }
    },
    1: {
        oper: "×",
        0: {
            oper: "/",
            0: "a",
            1: "b"
        },
        1: {
            oper: "/",
            0: "d",
            1: "c"
        }
    },
},
"Kerro ristiin",
"Takaperin: kerro ristiin"
);

// a / b = c
store.addEquation({
    oper: "->",
    0: {
        oper: "/",
        0: int("a"),
        1: int("b")
    },
    1: setDisplayTextAndReturn("c or approx(c)", function c(vars) {

        const r = vars["a"] / vars["b"];
        console.log("R:", r, r * vars["b"], vars["a"]);
        if ( chomp(r) * vars["b"] === vars["a"] ) {
            return {
                item: "(val)",
                0: r
            };
        }
        
        return {
            oper: "(summary)",
            _approx: r,
            display: suppressRepeatingDigits(r.toString()),
            0: {
                oper: "/",
                0: {
                    item: "(val)",
                    0: vars["a"]
                },
                1: {
                    item: "(val)",
                    0: vars["b"]
                }
            }
        };
    })
}, "Evaluoi jakolasku a / b");

// a : b = c
store.addEquation({
    oper: "->",
    0: {
        oper: ":",
        0: int("a"),
        1: int("b")
    },
    1: function c(vars) {
        const r = vars["a"] / vars["b"];
        console.log("R:", r, r * vars["b"], vars["a"]);
        if ( r * vars["b"] === vars["a"] && r.toString().length < 17 ) {
            return {
                item: "(val)",
                0: r
            };
        }
        
        return {
            oper: "(summary)",
            _approx: r,
            display: suppressRepeatingDigits(r.toString()),
            0: {
                oper: ":",
                0: int(vars["a"]),
                1: int(vars["b"])
            }
        };
    }
}, "Evaluoi jakolasku a : b");




// a / summary(b) = summary(a / b)
/* store.addEquation({
 *     oper: "->",
 *     0: {
 *         oper: "/",
 *         0: int("a"),
 *         1: {
 *             oper: "(summary)",
 *             _approx: "approx",
 *             display: "approx",
 *             0: "b"
 *         }
 *     },
 *     1: function c (vars) {
 *         return {
 *             oper: "(summary)",
 *             0: {
 *                 oper: "/",
 *                 0: int(vars["a"]),
 *                 1: vars["b"]
 *             },
 *             _approx: (vars["a"] / vars["approx"]),
 *             display: (vars["a"] / vars["approx"]) + "..."
 *         };
 *     }
 * },
 * "Jaa luku ja yhteenvetoluvulla"
 * );
 *  */


store.addEquation2({
    0: {
        oper: "/",
        0: int("a"),
        1: "b",
        "?_approx": "approx"
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
