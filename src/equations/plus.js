import store from "./store";
import { auto, int, variable } from "../types";

// +a = a
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: variable("x"),
    },
    1: variable("x"),
},
                  "Toggle plus sign"
);

// a + 0 = a
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: variable("a"),
        1: auto(0)
    },
    1: variable("a")
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
        1: variable("a")
    },
    1: variable("a")
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
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c") 
    },
    1: {
        oper: "+",
        0: variable("a"),
        1: {
            oper: "+",
            0: variable("b"),
            1: variable("c")
        }
    }
}, "Liitäntälaki");

//a + b = b + a
store.addEquation({
    oper: "->",
    0: {
        oper: "+",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "+",
        0: variable("b"),
        1: variable("a")
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
            0: variable("a")
        },
        1: {
            item: "(val)",
            0: variable("b")
        }
    },
    1: function c({ a, b }) {
        return {
            item: "(val)",
            0: a + b
        };
    }
}, "Evaluoi a + b");

// val(c) = val(a) + val(b)
store.addEquation({
    oper: "->",
    0: {
        item: "(val)",
        0: variable("c")
    },
    1: {
        oper: "+",
        0: {
            item: "(val)",
            0: variable("a")
        },
        1: {
            item: "(val)",
            0: variable("b")
        }
    }
}, "Erota a:ksi ja b:ksi");




// a + b.approx = (a + b).approx
store.addEquation2({
    0: {
        oper: "+",
        0: int("a"),
        1: variable("b"),
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

