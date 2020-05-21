import store from "./store";
import { auto } from "../types";

// (a + b) × (c + d) = ((a × c) + (a × d)) + ((b × c) + (b × d))
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            oper: "+",
            0: "a",
            1: "b"
        },
        1: {
            oper: "+",
            0: "c",
            1: "d"
        }
    },
    1: {
        oper: "+",
        0: {
            oper: "+",
            0: {
                oper: "×",
                0: "a",
                1: "c"
            },
            1: {
                oper: "×",
                0: "a",
                1: "d"
            }
        },
        1: {
            oper: "+",
            0: {
                oper: "×",
                0: "b",
                1: "c"
            },
            1: {
                oper: "×",
                0: "b",
                1: "d"
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
            0: "a",
            1: "b"
        },
        1: {
            oper: "+",
            0: "a",
            1: "b"
        }
    },
    1: {
        oper: "-",
        0: {
            oper: "^",
            0: "a",
            1: auto(2)
        },
        1: {
            oper: "^",
            0: "b",
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
            0: "a",
            1: "b"
        },
        1: auto(2)
    },
    1: {
        oper: "+",
        0: {
            oper: "+",
            0: {
                oper: "^",
                0: "a",
                1: auto(2)
            },
            1: {
                oper: "×",
                0: {
                    oper: "×",
                    0: auto(2),
                    1: "a"
                },
                1: "b"
            }
        },
        1: {
            oper: "^",
            0: "b",
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
            0: "a",
            1: "b"
        },
        1: auto(2)
    },
    1: {
        oper: "+",
        0: {
            oper: "-",
            0: {
                oper: "^",
                0: "a",
                1: auto(2)
            },
            1: {
                oper: "×",
                0: {
                    oper: "×",
                    0: auto(2),
                    1: "a"
                },
                1: "b"
            }
        },
        1: {
            oper: "^",
            0: "b",
            1: auto(2)
        }
    }
});
