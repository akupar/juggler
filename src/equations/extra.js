import store from "./store";
import { auto } from "../types";

// (a + b) × (c + d) = ((a × c) + (a × d)) + ((b × c) + (b × d))
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            oper: "+",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "+",
            0: variable("c"),
            1: variable("d")
        }
    },
    1: {
        oper: "+",
        0: {
            oper: "+",
            0: {
                oper: "×",
                0: variable("a"),
                1: variable("c")
            },
            1: {
                oper: "×",
                0: variable("a"),
                1: variable("d")
            }
        },
        1: {
            oper: "+",
            0: {
                oper: "×",
                0: variable("b"),
                1: variable("c")
            },
            1: {
                oper: "×",
                0: variable("b"),
                1: variable("d")
            }
        }
    }
});


// (a - b) × (a + b) = a^2 - b^2
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            oper: "-",
            0: variable("a"),
            1: variable("b")
        },
        1: {
            oper: "+",
            0: variable("a"),
            1: variable("b")
        }
    },
    1: {
        oper: "-",
        0: {
            oper: "^",
            0: variable("a"),
            1: auto(2)
        },
        1: {
            oper: "^",
            0: variable("b"),
            1: auto(2)
        }
    }
});

// (a + b)^2 = a^2 + 2ab + b^2
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: {
            oper: "+",
            0: variable("a"),
            1: variable("b")
        },
        1: auto(2)
    },
    1: {
        oper: "+",
        0: {
            oper: "+",
            0: {
                oper: "^",
                0: variable("a"),
                1: auto(2)
            },
            1: {
                oper: "×",
                0: {
                    oper: "×",
                    0: auto(2),
                    1: variable("a")
                },
                1: variable("b")
            }
        },
        1: {
            oper: "^",
            0: variable("b"),
            1: auto(2)
        }
    }
});


// (a - b)^2 = a^2 - 2ab + b^2
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: {
            oper: "-",
            0: variable("a"),
            1: variable("b")
        },
        1: auto(2)
    },
    1: {
        oper: "+",
        0: {
            oper: "-",
            0: {
                oper: "^",
                0: variable("a"),
                1: auto(2)
            },
            1: {
                oper: "×",
                0: {
                    oper: "×",
                    0: auto(2),
                    1: variable("a")
                },
                1: variable("b")
            }
        },
        1: {
            oper: "^",
            0: variable("b"),
            1: auto(2)
        }
    }
});
