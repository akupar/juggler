import store from "./store";
import { auto, int } from "../types";

// -(-a) = a
store.addEquation({
    oper: "->",
    0: {
        oper: "-",
        0: {
            oper: "-",
            0: "a",
        }
    },
    1: "a"
});

// a + -a = 0
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: "a",
        1: {
            oper: "-",
            0: "a",
        }
    },
    1: auto(0)
});



// -a + b = b - a
store.addEquation({
    oper: "=",
    0: {
        oper: "+",
        0: {
            oper: "-",
            0: "a",
        },
        1: "b"
    },
    1: {
        oper: "-",
        0: "b",
        1: "a"
    }
},
                  "Switch places",
);


// 0 - a = -a
store.addEquation({
    oper: "=",
    0: {
        oper: "-",
        0: auto(0),
        1: "a"
    },
    1: {
        oper: "-",
        0: "a"
    }
},
                  "Muuta negatiiviseksi luvuksi",
                  "Muuta nollasta vähentämiseksi"
);

// a - b = a + -b
store.addEquation({
    oper: "=",
    0: {
        oper: "-",
        0: "a",
        1: "b"
    },
    1: {
        oper: "+",
        0: "a",
        1: {
            oper: "-",
            0: "b"
        }
    }
});

// (a + b) - b = a
store.addEquation({
    oper: "->",
    0: {
        oper: "-",
        0: {
            oper: "+",
            0: "a",
            1: "b"
        },
        1: "b"
    },
    1: "a"
});


// a - b = val(a) - val(b)
store.addEquation({
    oper: "->",
    0: {
        oper: "-",
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
            0: vars["a"] - vars["b"]
        };
    }
},
                  "Vähennä");


// -(a + b) = -a - b
store.addEquation({
    oper: "=",
    0: {
        oper: "-",
        0: {
            oper: "+",
            0: "a",
            1: "b"
        }
    },
    1: {
        oper: "-",
        0: {
            oper: "-",
            0: "a"
        },
        1: "b"
    }
},
                  "Apply minus to members",
                  "Take minus out"
);


// a - b = -(-a + b)
store.addEquation({
    oper: "=",
    0: {
        oper: "-",
        0: "a",
        1: "b"
    },
    1: {
        oper: "-",
        0: {
            oper: "+",
            0: {
                oper: "-",
                0: "a"
            },
            1: "b"
        }
    }
},
                  "Apply minus to members",
                  "Take minus out"
);


// a - b.approx = (a - b).approx
store.addEquation2({
    0: {
        oper: "-",
        0: int("a"),
        1: "b",
        "?_approx": "approx"
    },
    1: function c({ a, b }) {
        return {
            oper: "-",
            0: int(a),
            1: b,
            _approx: a - b._approx,
            display: ":approx"
        };
    },
    where: ({ b, approx }) => {
        return !approx && ("_approx" in b);
    },
    desc: "Show approximate value"
});

