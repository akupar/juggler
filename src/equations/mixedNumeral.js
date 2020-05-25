import store from "./store";
import { setDisplayTextAndReturn } from "../util/functions";

// epämurtoluku => sekaluku
store.addEquation({
    oper: "->",
    0: {
        oper: "/",
        0: int(variable("a"),
        1: int(variable("b")
    },
    1: setDisplayTextAndReturn("whole + (a - whole * b) / b", function ({ a, b }) {
        const whole = Math.floor(a / b);

        return {
            oper: "(mixed)",
            0: int(whole),
            1: int(a - whole * b),
            2: int(b)
        };
    })
}, "Epämurtoluvusta sekaluvuksi");

// sekaluku => epämurtoluku
store.addEquation({
    oper: "->",
    0: {
        oper: "(mixed)",
        0: int(variable("whole")),
        1: int(variable("nom")),
        2: int(variable("denom"))
    },
    1: setDisplayTextAndReturn("(whole × denom + nom) / denom", function fraction({ whole, denom, nom }) {
        return {
            oper: "/",
            0: int(whole * denom + nom),
            1: int(denom)
        };
    })
}, "Sekaluvusta epämurtoluvuksi");


            
// sekaluku => kokonaiset + murtoluku
store.addEquation({
    oper: "=",
    0: {
        oper: "(mixed)",
        0: int(variable("whole")),
        1: int(variable("nom")),
        2: int(variable("denom"))
    },
    1: {
        oper: "+",
        0: int(variable("whole")),
        1: {
            oper: "/",
            0: int(variable("nom")),
            1: int(variable("denom"))
        }
    }
}, "Muuta yhteenlaskuksi", "Muuta sekaluvuksi");

