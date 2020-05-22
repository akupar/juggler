import store from "./store";
import { auto, int } from "../types";

// +a = a
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: "x",
    },
    1: "x",
},
                  "Toggle plus sign"
);

// a + 0 = a
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: "a",
        1: auto(0)
    },
    1: "a"
},
                  "Yksinkertaista nollan lisäys",
                  "Lisää 0"
);

// 0 + a = 0
store.addEquation({
    oper: "->",
    0: {
        oper: "+",
        0: auto(0),
        1: "x"
    },
    1: "a"
},
                  "Yksinkertaista nollan lisäys",
                  "Lisää 0"
);

//(a + b) + c = b + (a + c)
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: {
            oper: "+",
            0: "a",
            1: "b"
        },
        1: "c" 
    },
    1: {
        oper: "+",
        0: "a",
        1: {
            oper: "+",
            0: "b",
            1: "c"
        }
    }
}, "Liitäntälaki");

//a + b = b + a
store.addEquation({
    oper: "->",
    0: {
        oper: "+",
        0: "a",
        1: "b"
    },
    1: {
        oper: "+",
        0: "b",
        1: "a"
    }
}, "Vaihda paikkoja");

//a + b = c
/* store.addEquation({
 *     oper: "=",
 *     0: {
 *         oper: "+",
 *         0: "a",
 *         1: "b" 
 *     },
 *     1: "c"
 * }); */


// val(a) + val(b) = val(a + b)
store.addEquation({
    oper: "->",
    0: {
        oper: "+",
        0: {
            item: "(val)",
            0: "a"
        },
        1: {
            item: "(val)",
            0: "b"
        }
    },
    1: function c(vars) {
        return {
            item: "(val)",
            0: vars["a"] + vars["b"]
        };
    }
}, "Evaluoi a + b");

// val(c) = val(a) + val(b)
store.addEquation({
    oper: "->",
    0: {
        item: "(val)",
        0: "c"
    },
    1: {
        oper: "+",
        0: {
            item: "(val)",
            0: "a"
        },
        1: {
            item: "(val)",
            0: "b"
        }
    }
}, "Erota a:ksi ja b:ksi");


// a + summary(b) = summary(a + b) ??
store.addEquation({
    oper: "->",
    0: {
        oper: "+",
        0: {
            item: "(val)",
            0: "a"
        },
        1: {
            oper: "(summary)",
            _approx: "approx",
            display: "approximation",
            0: "b"
        }
    },
    1: function c (vars) {
        return {
            oper: "(summary)",
            0: {
                oper: "+",
                0: {
                    item: "(val)",
                    0: vars["a"]
                },
                1: vars["b"]
            },
            _approx: (vars["a"] + vars["approx"]),
            display: (vars["a"] + vars["approx"]) + "..."
        };
    }
},
                  "Laske yhteen luku ja yhteenvetoluku"
);


// a + b.approx = (a + b).approx
store.addEquation2({
    0: {
        oper: "+",
        0: int("a"),
        1: "b",
        "?_approx": "approx"
    },
    1: function c({ a, b }) {
        return {
            oper: "+",
            0: int(a),
            1: b,
            _approx: a + b._approx,
            display: ":approx"
        };
    },
    where: ({ b, approx }) => {
        return !approx && ("_approx" in b);
    },
    desc: "Aseta display-jäsen +"
});


