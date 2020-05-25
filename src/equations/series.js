import store from "./store";
import { int, symbol, variable } from "../types";

// store.addEquation2({
//     0: {
//         oper: "+",
//         0: {
//             oper: "+",
//             0: {
//                 oper: "+",
//                 0: variable("a"),
//                 1: variable("b")
//             },
//             1: variable("c")
//         },
//         1: variable("d")
//     },
//     1: {
//         oper: "...",
//         expr: variable("expr"),
//         start: variable("start"),
//         end: variable("end"),
//         concat: "+",
//         vble: symbol("i")
//     },
//     desc: {
//         0: "Muuta summalausekkeeksi",
//         1: "Muuta lukujonoksi"
//     }
// });


store.addEquation2({
    0: {
        oper: "+",
        0: {
            oper: "+",
            0: {
                oper: "+",
                0: {
                    oper: "+",
                    0: variable("a"),
                    1: variable("b")
                },
                1: variable("c")
            },
            1: variable("d")
        },
        1: variable("e")
    },
    1: function series({ a, b, c, e }) {
        return {
            oper: "+",
            0: {
                oper: "+",
                0: {
                    oper: "×",
                    0: int(1),
                    1: a
                },
                1: {
                    oper: "×",
                    0: int(1),
                    1: b
                }
            },
            1: {
                oper: "...",
                expr: {
                    oper: "×",
                    0: int(1),
                    1: symbol("i")
                },
                start: c,
                end: e,
                concat: "+",
                vble: symbol("i")
            }
        };

    },
    desc: {
        0: "Muuta summalausekkeeksi",
        1: "Muuta lukujonoksi"
    }
});



store.addEquation2({
    0: {
        oper: "+",
        0: variable("preexp"),
        1: {
            oper: "...",
            expr: {
                oper: "×",
                0: variable("expr"),
                1: symbol("i")
            },
            start: variable("start"),
            end: variable("end"),
            concat: "+",
            vble: symbol("i")
        }
    },
    1: function eekOut({ preexp, expr, start, end }) {

        return {
            oper: "+",
            0: {
                oper: "+",
                0: preexp,
                1: {
                    oper: "×",
                    0: expr,
                    1: start,
                }
            },
            1: {
                oper: "...",
                expr: {
                    oper: "×",
                    0: int(1),
                    1: symbol("i")
                },
                start: { item: "(val)", 0: start[0] + 1 },
                end: end,
                concat: "+",
                vble: symbol("i")
            }
        };
    },
    desc: {
        0: "Muuta summalausekkeeksi",
        1: "Muuta lukujonoksi"
    }
});



console.log("series loaded");
