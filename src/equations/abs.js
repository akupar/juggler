import store from "./store";

// |a| = a
store.addEquation({
    oper: "->",
    0: {
        oper: "(abs)",
        0: {
            item: "(val)",
            0: "a"
        }
    },
    1: "a"
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
            0: {
                item: "(val)",
                0: "a"
            }
        }
    },
    1: {
        item: "(val)",
        0: "a"
    }
},
"Evaluate absolute value"
);

