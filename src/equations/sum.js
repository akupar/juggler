import store from "./store";
import { symbol, variable } from "../types";

store.addEquation({
    oper: "=",
    0: {
        oper: "...",
        expr: variable("expr"),
        start: variable("start"),
        end: variable("end"),
        concat: "+",
        vble: symbol("i")
    },
    1: {
        oper: "(sum)",
        expr: variable("expr"),
        vble: symbol("i"),
        start: variable("start"),
        end: variable("end"),
    }
},
"Muuta summalausekkeeksi",
"Muuta lukujonoksi"
);


