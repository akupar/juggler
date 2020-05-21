import store from "./store";
import { symbol } from "../types";

/* store.addEquation({
 *     oper: "->",
 *     0: symbol("π"),
 *     1: {
 *         oper: '(summary)',
 *         approx: "3.14",
 *         display: "π",
 *         0: symbol("π")        // Exact value is the symbol it self!
 *     }
 * },
 *         "Show exact value"
 * ); */


store.addEquation({
    oper: "=",
    0: symbol("π"),
    1: {
        item: "(sym)",
        0: "?π",
        _approx: 3.14
    }
},
"Show exact value"
);


store.addEquation2({
    0: "a",
    1: function exact({ a }) {
        return {
            ...a,
            display: "exact"
        };
    },
    where: ({ a }) => {
        return ("_approx" in a) && (!("display" in a) || a.display === "approx");
    },
    desc: "Show exact value"
});



store.addEquation2({
    0: "a",
    1: function approx({ a }) {
        return {
            ...a,
            display: "approx"
        };
    },
    where: ({ a }) => {
        return ("_approx" in a) && (!("display" in a) || a.display === "exact");
    },
    desc: "Display as approximate value OOO"
});



console.log("constants LOADED");
