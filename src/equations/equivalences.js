import store from "./store";
import { auto, int, variable } from "../types";

// a = b <=> b = a
store.addEquivalence({
    oper: "->",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: variable("b"),
        1: variable("a")
    }
},
"Vaihda paikkoja"
);

// a = b <=> a + c = b + c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "+",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "+",
            0: variable("b"),
            1: variable("c")
        }
    }
});


// a = b <=> a - c = b - c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "-",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "-",
            0: variable("b"),
            1: variable("c")
        }
    }
});

// a = b <=> a - b = 0
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "-",
            0: variable("a"),
            1: variable("b")
        },
        1: auto(0)
    }
});

// a = b <=> a × c = b × c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "×",
            0: variable("b"),
            1: variable("c")
        }
    }
});

// a = b <=> a / c = b / c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "/",
            0: variable("b"),
            1: variable("c")
        }
    }
});

// a = b <=> a / b = 0
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "/",
            0: variable("a"),
            1: variable("b")
        },
        1: auto(0)
    }
});

// a = b <=> a^c = b^c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "^",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "^",
            0: variable("b"),
            1: variable("c")
        }
    }
});

// a = b <=> root(c, a) = root(c, a)
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b")
    },
    1: {
        oper: "=",
        0: {
            oper: "(root)",
            0: variable("a"),
            1: variable("c")
        },
        1: {
            oper: "(root)",
            0: variable("b"),
            1: variable("c")
        }
    }
});




// a + b = c <=> a = c - b
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: "+",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "=",
        0: variable("a"),
        1: {
            oper: "-",
            0: variable("c"),
            1: variable("b")
        }
    }
});


// a + b = c <=> b = c - a
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: "+",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "=",
        0: variable("b"),
        1: {
            oper: "-",
            0: variable("c"),
            1: variable("a")
        }
    }
});





// a × b = c <=> a = c/b
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: "×",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "=",
        0: variable("a"),
        1: {
            oper: "/",
            0: variable("c"),
            1: variable("b")
        }
    }
});

// a ^ b = c <=> a = c ^ (-b)
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: "^",
            0: variable("a"),
            1: int(1)
        },
        1: variable("c")
    },
    1: {
        oper: "=",
        0: variable("a"),
        1: {
            oper: "^",
            0: variable("c"),
            1: {
                oper: "-",
                0: int(1)
            }
        }
    }
});

// a ^ b = c <=> a = c (root) b
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: "^",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "=",
        0: variable("a"),
        1: {
            oper: "±",
            0: {
                oper: "(root)",
                0: variable("c"),
                1: variable("b")
            }
        }
    }
});

// a (root) b = c <=> (a (root) b) ^ b = c^b
store.addEquivalence({
    oper: "->",
    0: {
        oper: "=",
        0: {
            oper: "(root)",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: "=",
        0: {
            oper: "^",
            0: {
                oper: "(root)",
                0: variable("a"),
                1: variable("b")
            },
            1: variable("b")
        },
        1: {
            oper: "^",
            0: variable("c"),
            1: variable("b")
        }
    }
},
"Korota molemmat puolet juuren potenssiin"
);


// a = ±b <=> a = +b; a = -b
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: variable("a"),
        1: {
            oper: "±",
            0: variable("b")
        }
    },
    1: {
        oper: ";",
        0: {
            oper: "=",
            0: variable("a"),
            1: {
                oper: "+",
                0: variable("b")
            }
        },
        1: {
            oper: "=",
            0: variable("a"),
            1: {
                oper: "-",
                0: variable("b")
            }
        }
    }
});


// a; b = c <=> a = c; b
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: {
            oper: ";",
            0: variable("a"),
            1: variable("b")
        },
        1: variable("c")
    },
    1: {
        oper: ";",
        0: {
            oper: "=",
            0: variable("a"),
            1: variable("c")
        },
        1: variable("b")
    }
});


