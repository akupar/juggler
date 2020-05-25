import store from "./store";
import { int, symbol, variable } from "../types";
import { setDisplayTextAndReturn } from "../util/functions";
import { chomp } from "../util/number";


// k^x = a <=> x = log_k a
store.addEquation2({
    0: {
        oper: "=",
        0: {
            oper: "^",
            0: variable("k"),
            1: variable("x")
        },
        1: variable("a")
    },
    1: {
        oper: "=",
        0: variable("x"),
        1: {
            oper: "log",
            0: variable("k"),
            1: variable("a")
        }
    },
    desc: {
        0: "Take k base logarithm on both sides",
        1:  ""
    }
});



// log_k k^x = x
store.addEquation2({
    0: {
        oper: "log",
        0: variable("k"),
        1: {
            oper: "^",
            0: variable("k"),
            1: variable("x")
        }
    },
    1: variable("x"),
    desc: "Eliminate logarithm and exponent"
});


// ln a = log_e a
store.addEquation2({
    0: {
        oper: "ln",
        0: variable("a")
    },
    1: {
        oper: "log",
        0: symbol("e"),
        1: variable("a")
    },
    desc: "Eliminate logarithm and exponent"
});



// log_x (a × b) = log_x a + log_x b
store.addEquation2({
    0: {
        oper: "log",
        0: variable("k"),
        1: {
            oper: "×",
            0: variable("a"),
            1: variable("b")            
        },
    },
    1: {
        oper: "+",
        0: {
            oper: "log",
            0: variable("k"),
            1: variable("a")            
        },
        1: {
            oper: "log",
            0: variable("k"),
            1: variable("b")            
        }
    },
    desc: {
        0: "Turn to addition of logarithms",
        1: "Turn to multiplication of arguments"
    }
});


// log_x (a / b) = log_x a - log_x b
store.addEquation2({
    0: {
        oper: "log",
        0: variable("k"),
        1: {
            oper: "/",
            0: variable("a"),
            1: variable("b")            
        },
    },
    1: {
        oper: "-",
        0: {
            oper: "log",
            0: variable("k"),
            1: variable("a")            
        },
        1: {
            oper: "log",
            0: variable("k"),
            1: variable("b")            
        }
    },
    desc: {
        0: "Turn to addition of logarithms",
        1: "Turn to multiplication of arguments"
    }
});


// log_x a ^ n = n × log_x a
store.addEquation2({
    0: {
        oper: "log",
        0: variable("k"),
        1: {
            oper: "^",
            0: variable("a"),
            1: variable("n")
        },
    },
    1: {
        oper: "×",
        0: variable("n"),
        1: {
            oper: "log",
            0: variable("k"),
            1: variable("a")            
        }
    },
    desc: {
        0: "Turn to multiplication by exponent",
        1: "Move multiplyer to exponent"
    }
});



// log_k a = (log_y a / log_y k)
store.addEquation2({
    0: {
        oper: "log",
        0: variable("k"),
        1: variable("a")
    },
    1: {
        oper: "/",
        0: {
            oper: "log",
            0: variable("y"),
            1: variable("a")            
        },
        1: {
            oper: "log",
            0: variable("y"),
            1: variable("k")            
        }
    },
    desc: {
        0: "Turn to division of logarithms",
        1: "Turn to k based logarithm"
    }
});




// log_k a = ~x
store.addEquation2({
    0: {
        oper: "log",
        0: int(variable("k")),
        1: int(variable("a")),
        "?_approx": variable("approx")
    },
    1: setDisplayTextAndReturn("c | ~c", function c({ $a, $k }) {
        const r = Math.log($a) / Math.log($k);
        
        console.log("R:", r, r ^ $k, $a);
        if ( chomp(r) ^ $k === $a ) {
            return int(r);
        }

        return {
            oper: "log",
            0: int($k),
            1: int($a),
            _approx: r,
            display: ":approx"
        };
    }),
    where: ({ approx }) => {
        return !approx;
    },
    desc: "Calculate approximate value"
});

