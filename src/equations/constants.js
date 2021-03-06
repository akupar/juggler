import store from "./store";
import { variable } from "../types";

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



store.addEquation2({
    0: variable("a"),
    1: function exact({ a }) {
        console.log("sho exact:", JSON.stringify(a));
        const copy =  {
            ...a
        };

        delete copy.display;
        return copy;
    },
    where: ({ a }) => {
        return (("display" in a) && a.display === ":approx");
    },
    desc: "Show exact value"
});



store.addEquation2({
    0: variable("a"),
    1: function approx({ a }) {
        return {
            ...a,
            display: ":approx"
        };
    },
    where: ({ a }) => {
        return ("_approx" in a) && !("display" in a);
    },
    desc: "Display as approximate value"
});



console.log("constants LOADED");
