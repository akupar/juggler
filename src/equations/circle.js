/**
 * Equations with function composition operator ∘.
 **/

import { auto, variable } from "../types";

import store from "./store";

// convert an operator into function
store.addEquation({
    oper: "->",
    0: {
        oper: variable("o"),
        0: variable("x")
    },
    1: function func({ o, x }) {
        return {
            oper: {
                item: "(func)",
                0: variable(o)
            },
            0: x
        };
    }
},
"Convert operator into function",
"Convert function into operator");


// g(f(x)) = (g ∘ f)(x)
store.addEquation({
    oper: "=",
    0: {
        oper: {
            item: "(func)",
            0: variable("g")
        },
        0: {
            oper: {
                item: "(func)",
                0: variable("f")
            },
            0: variable("x")
        }
    },
    1: {
        oper: {
            oper: "∘",
            0: {
                item: "(func)",
                0: variable("g")
            },
            1: {
                item: "(func)",
                0: variable("f")
            }
        },
        0: variable("x")
    }
});

// h((g ∘ f)(x)) = (h ∘ (g ∘ f))(x)
store.addEquation({
    oper: "=",
    0: {
        oper: {
            item: "(func)",
            0: variable("h")
        },
        0: {
            oper: {
                oper: "∘",
                0: {
                    item: "(func)",
                    0: variable("g")
                },
                1: {
                    item: "(func)",
                    0: variable("f")
                }
            },
            0: variable("x")
        }
    },
    1: {
        oper: {
            oper: "∘",
            0: {
                item: "(func)",
                0: variable("h")
            },
            1: {
                oper: "∘",
                0: {
                    item: "(func)",
                    0: variable("g")
                },
                1: {
                    item: "(func)",
                    0: variable("f")
                }
            }
        },
        0: variable("x")
    }
});

// ((f ∘ g) ∘ h) = (f ∘ (g ∘ h))
store.addEquation({
    oper: "=",
    0: {
        oper: "∘",
        0: {
            oper: "∘",
            0: {
                item: "(func)",
                0: variable("f")
            },
            1: {
                item: "(func)",
                0: variable("g")
            }
        },
        1: {
            item: "(func)",
            0: variable("h")
        }

    },
    1: {
        oper: "∘",
        0: {
            item: "(func)",
            0: variable("f")
        },
        1: {
            oper: "∘",
            0: {
                item: "(func)",
                0: variable("g")
            },
            1: {
                item: "(func)",
                0: variable("h")
            }
        }
    }
});


// f [function power] 2 = f ∘ f
store.addEquation({
    oper: "=",
    0: {
        oper: "(function power)",
        0: variable("f"),
        1: auto(2)
    },
    1: {
        oper: "∘",
        0: variable("f"),
        1: variable("f") 
    }
},
"Muuta pallo-operaatioksi",
"Muuta pallo-operaation toiseksi potenssiksi"
);

// (f [function power] x) ∘ f = f [function power] (x + 1)
store.addEquation({
    oper: "=",
    0: {
        oper: "∘",
        0: {
            oper: "(function power)",
            0: variable("f"),
            1: variable("x")
        },
        1: variable("f")
    },
    1: {
        oper: "(function power)",
        0: variable("f"),
        1: {
            oper: "+",
            0: variable("x"),
            1: auto(1)
        }
    }
},
"Yhdistä potenssiin",
"Erota pallo-operaatio potenssista"
);
