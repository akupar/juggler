/**
 * Yhtälöt, jotka palauttavat kyselylomakkeen annetulle yhtälölle.
 * Yhtälön 0 on yhtälö, 1 on funktio, joka ottaa muuttujat ja syötelausekkeen parametrina ja palauttaa 
 * muuttujien arvot. Funktiota kutsutaan jos syötelauseke mätsää 0-lausekkeeseen.
 **/

import EquationStore from "../equationStore";

import fromTwoThirdDialog from "../ui/fromTwoThirdDialog";
import oneNumberDialog from "../ui/oneNumberDialog";

const prompters = new EquationStore("oper", 0);


prompters.addEquation({
    oper: "=>",
    0: {
        oper: "&rarr;",
        0: "expression",
        1: {
            item: "(sym)",
            0: "symbol"
        }
    },
    1: (vars) => {
        console.log("Prompter c = a + b; vars =", vars);
        
        return oneNumberDialog.createDialog("Input symbol", vars, "X", true);
    }
});



prompters.addEquation({
    oper: "=>",
    0: {
        oper: "&rarr;",
        0: {
            item: "(val)",
            0: "c"
        },
        1: {
            oper: "+",
            0: {
                item: "(val)",
                0: "a"
            },
            1: {
                item: "(val)",
                0: "b"
            }
        }
    },
    1: (vars) => {
        console.log("Prompter c = a + b; vars =", vars);
        
        return fromTwoThirdDialog.createDialog("+", vars, "a", "b", "c", (r, o) => r - o, (r, o) => r - o);
    }
});


prompters.addEquation({
    oper: "=>",
    0: {
        oper: "&rarr;",
        0: {
            item: "(val)",
            0: "c"
        },
        1: {
            oper: "-",
            0: {
                item: "(val)",
                0: "a"
            },
            1: {
                item: "(val)",
                0: "b"
            }
        }
    },
    1: (vars) => {
        console.log("Prompter c = a - b; vars =", vars);
        
        return fromTwoThirdDialog.createDialog("+", vars, "a", "b", "c", (r, o) => r + o, (r, o) => r + o);
    }
});


prompters.addEquation({
    oper: "=>",
    0: {
        oper: "&rarr;",
        0: {
            item: "(val)",
            0: "c"
        },
        1: {
            oper: "×",
            0: {
                item: "(val)",
                0: "a"
            },
            1: {
                item: "(val)",
                0: "b"
            }
        }
    },
    1: (vars) => {
        console.log("Prompter c = a × b; vars =", vars);
        
        return fromTwoThirdDialog.createDialog("&middot;", vars, "a", "b", "c", (r, o) => r / o, (r, o) => r / o);
    }
});

prompters.addEquation({
    oper: "=>",
    0: {
        oper: "&rarr;",
        0: {
            item: "(val)",
            0: "c"
        },
        1: {
            oper: "/",
            0: {
                item: "(val)",
                0: "a"
            },
            1: {
                item: "(val)",
                0: "b"
            }
        }
    },
    1: (vars) => {
        console.log("Prompter c = a / b; vars =", vars);
        
        return fromTwoThirdDialog.createDialog("&middot;", vars, "a", "b", "c", (r, o) => r * o, (r, o) => r * o);
    }
});

prompters.addEquation({
    oper: "=>",
    0: {
        oper: "&rarr;",
        0: {
            item: "(val)",
            0: "c"
        },
        1: {
            oper: "^",
            0: {
                item: "(val)",
                0: "a"
            },
            1: {
                item: "(val)",
                0: "b"
            }
        }
    },
    1: (vars) => {
        console.log("Prompter c = a ^ b; vars =", vars);
        
        return fromTwoThirdDialog.createDialog("^", vars, "a", "b", "c", (r, o) => Math.pow(r, 1 / o), (r, o) => Math.log(r) / Math.log(o));
    }
});

prompters.addEquation({
    oper: "=>",
    0: {
        oper: "&rarr;",
        0: {
            item: "(val)",
            0: "c"
        },
        1: {
            oper: "(root)",
            0: {
                item: "(val)",
                0: "a"
            },
            1: {
                item: "(val)",
                0: "b"
            }
        }
    },
    1: (vars) => {
        console.log("Prompter c = a ^ b; vars =", vars);
        
        return fromTwoThirdDialog.createDialog("&middot;", vars, "a", "b", "c", (r, o) => Math.pow(r, o), (r, o) => Math.pow(r, o));
    }
});

export default prompters;
