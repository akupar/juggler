/**
 * Equations with function composition operator ∘.
 **/

import { auto } from "../types";

import store from "./store";

// convert an operator into function
store.addEquation({
    oper: "->",
    0: {
        oper: "o",
        0: "x"
    },
    1: function func(vars) {
        return {
            oper: {
                item: "(func)",
                0: "?(" + vars["o"] + ")"
            },
            0: vars["x"]
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
            0: "g"
        },
        0: {
            oper: {
                item: "(func)",
                0: "f"
            },
            0: "x"
        }
    },
    1: {
        oper: {
            oper: "∘",
            0: {
                item: "(func)",
                0: "g"
            },
            1: {
                item: "(func)",
                0: "f"
            }
        },
        0: "x"
    }
});

// h((g ∘ f)(x)) = (h ∘ (g ∘ f))(x)
store.addEquation({
    oper: "=",
    0: {
        oper: {
            item: "(func)",
            0: "h"
        },
        0: {
            oper: {
                oper: "∘",
                0: {
                    item: "(func)",
                    0: "g"
                },
                1: {
                    item: "(func)",
                    0: "f"
                }
            },
            0: "x"
        }
    },
    1: {
        oper: {
            oper: "∘",
            0: {
                item: "(func)",
                0: "h"
            },
            1: {
                oper: "∘",
                0: {
                    item: "(func)",
                    0: "g"
                },
                1: {
                    item: "(func)",
                    0: "f"
                }
            }
        },
        0: "x"
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
                0: "f"
            },
            1: {
                item: "(func)",
                0: "g"
            }
        },
        1: {
            item: "(func)",
            0: "h"
        }

    },
    1: {
        oper: "∘",
        0: {
            item: "(func)",
            0: "f"
        },
        1: {
            oper: "∘",
            0: {
                item: "(func)",
                0: "g"
            },
            1: {
                item: "(func)",
                0: "h"
            }
        }
    }
});


// f [function power] 2 = f ∘ f
store.addEquation({
    oper: "=",
    0: {
        oper: "(function power)",
        0: "f",
        1: auto(2)
    },
    1: {
        oper: "∘",
        0: "f",
        1: "f" 
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
            0: "f",
            1: "x"
        },
        1: "f"
    },
    1: {
        oper: "(function power)",
        0: "f",
        1: {
            oper: "+",
            0: "x",
            1: auto(1)
        }
    }
},
"Yhdistä potenssiin",
"Erota pallo-operaatio potenssista"
);
