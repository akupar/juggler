import store from "./store";
import { symbol } from "../types";
//import { contains } from "../eq";
import { deepCopy } from "../util";
// 
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
        approx: 3.14
    }
},
"Show exact value"
);


store.addEquation({
    oper: "=",
    0: "b",
    1: function ex(vars) {
        let b2 = deepCopy(vars["b"]);
        b2.approx = null; 
        return b2;
    }
},
"Show exact value"
);

