import store from "./store";
import { setDisplayTextAndReturn } from "../util/functions";

// epämurtoluku => sekaluku
store.addEquation({
    oper: "->",
    0: {
        oper: "/",
        0: {
            item: "(val)",
            0: "a"
        },
        1: {
            item: "(val)",
            0: "b"
        }
    },
    1: setDisplayTextAndReturn("whole + (a - whole * b) / b", function (vars) {
        const whole = Math.floor(vars["a"] / vars["b"]);

        return {
            oper: "(mixed)",
            0: {
                item: "(val)",
                0: whole
            },
            1: {
                item: "(val)",
                0: vars["a"] - whole * vars["b"]
            },
            2: {
                item: "(val)",
                0: vars["b"]
            }
        };
    })
}, "Epämurtoluvusta sekaluvuksi");

// sekaluku => epämurtoluku
store.addEquation({
    oper: "->",
    0: {
        oper: "(mixed)",
        0: {
            item: "(val)",
            0: "whole"
        },
        1: {
            item: "(val)",
            0: "nom"
        },
        2: {
            item: "(val)",
            0: "denom"
        }
    },
    1: setDisplayTextAndReturn("(whole × denom + nom) / denom", function fraction(vars) {
        return {
            oper: "/",
            0: {
                item: "(val)",
                0: vars["whole"] * vars["denom"] + vars["nom"]
            },
            1: {
                item: "(val)",
                0: vars["denom"]
            }
        };
    })
}, "Sekaluvusta epämurtoluvuksi");


// sekaluku => kokonaiset + murtoluku
store.addEquation({
    oper: "=",
    0: {
        oper: "(mixed)",
        0: {
            item: "(val)",
            0: "whole"
        },
        1: {
            item: "(val)",
            0: "nom"
        },
        2: {
            item: "(val)",
            0: "denom"
        }
    },
    1: {
        oper: "+",
        0: {
            item: "(val)",
            0: "whole"
        },
        1: {
            oper: "/",
            0: {
                item: "(val)",
                0: "nom"
            },
            1: {
                item: "(val)",
                0: "denom"
            }
        }
    }
}, "Muuta yhteenlaskuksi", "Muuta sekaluvuksi");

