import store from "./store";
import { int, variable } from "../types";

// |a| = a
store.addEquation({
    oper: "->",
    0: {
        oper: "(abs)",
        0: int(variable("a"))
    },
    1: int(variable("a"))
},
                  "Evaluate absolute value"
);

// |-a| = a
store.addEquation({
    oper: "->",
    0: {
        oper: "(abs)",
        0: {
            oper: "-",
            0: int(variable("a"))
        }
    },
    1: int(variable("a"))
},
"Evaluate absolute value"
);

