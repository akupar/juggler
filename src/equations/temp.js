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
}, "Poista yhteenveto");


store.addEquation({
    oper: "=",
    0: {
        oper: "...",
        expr: "expr",
        start: "start",
        end: "end",
        concat: "+",
        vble: "i"
    },
    1: {
        oper: "(sum)",
        expr: "expr",
        vble: "i",
        start: "start",
        end: "end",
    }
},
"Muuta summalausekkeeksi",
"Muuta lukujonoksi"
);


