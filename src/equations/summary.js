import store from "./store";

// summary(a) = a
store.addEquation({
    oper: "->",
    0: {
        oper: "(summary)",
        approx: "approx",
        display: "approximation",
        0: "a"
    },
    1: "a"
}, "Display exact value");
