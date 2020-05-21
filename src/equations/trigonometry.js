import store from "./store";
import { auto, func, symbol } from "../types";

// a = a rad
store.addEquation({
    oper: "=",
    0: "a",
    1: {
        oper: "(rad)",
        0: "a"
    }
},
"Flag as radians",
"Remove radians flag"
);

// a° = (a × (π/180)) rad
store.addEquation({
    oper: "->",
    0: {
        oper: "°",
        0: "a"
    },
    1: {
        oper: "(rad)",
        0: {
            oper: "×",
            0: "a",
            1: {
                oper: "/",
                0: symbol("π"),
                1: auto(180)
            }
        }
    }
}, "Convert to radians");

// a rad = (a × (180/π))°
store.addEquation({
    oper: "->",
    0: {
        oper: "(rad)",
        0: "a"
    },
    1: {
        oper: "°",
        0: {
            oper: "×",
            0: "a",
            1: {
                oper: "/",
                0: auto(180),
                1: symbol("π")
            }
        }
    }
}, "Convert to degrees");


// tan a = b <=> a = tan^-1 b
store.addEquation({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: func("tan"),
            0: "a"
        },
        1: "b"
    },
    1: {
        oper: "=",
        0: "a",
        1: {
            oper: {
                oper: "(function power)",
                0: func("tan"),
                1: auto(-1)
            },
            0: "b"
        }
    }
});


// cos a = b <=> a = cos^-1 b
store.addEquation({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: func("cos"),
            0: "a"
        },
        1: "b"
    },
    1: {
        oper: "=",
        0: "a",
        1: {
            oper: {
                oper: "(function power)",
                0: func("cos"),
                1: auto(-1)
            },
            0: "b"
        }
    }
});
