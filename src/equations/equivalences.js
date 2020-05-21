import store from "./store";
import { auto } from "../types";

// a = b <=> b = a
store.addEquivalence({
    oper: "->",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: "b",
        1: "a"
    }
},
"Vaihda paikkoja"
);

// a = b <=> a + c = b + c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "+",
            0: "a",
            1: "c"
        },
        1: {
            oper: "+",
            0: "b",
            1: "c"
        }
    }
});


// a = b <=> a - c = b - c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "-",
            0: "a",
            1: "c"
        },
        1: {
            oper: "-",
            0: "b",
            1: "c"
        }
    }
});

// a = b <=> a - b = 0
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "-",
            0: "a",
            1: "b"
        },
        1: auto(0)
    }
});

// a = b <=> a × c = b × c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "×",
            0: "a",
            1: "c"
        },
        1: {
            oper: "×",
            0: "b",
            1: "c"
        }
    }
});

// a = b <=> a / c = b / c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "/",
            0: "a",
            1: "c"
        },
        1: {
            oper: "/",
            0: "b",
            1: "c"
        }
    }
});

// a = b <=> a / b = 0
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "/",
            0: "a",
            1: "b"
        },
        1: auto(0)
    }
});

// a = b <=> a^c = b^c
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "^",
            0: "a",
            1: "c"
        },
        1: {
            oper: "^",
            0: "b",
            1: "c"
        }
    }
});

// a = b <=> root(c, a) = root(c, a)
store.addEquivalence({
    oper: "<=>",
    0: {
        oper: "=",
        0: "a",
        1: "b"
    },
    1: {
        oper: "=",
        0: {
            oper: "(root)",
            0: "a",
            1: "c"
        },
        1: {
            oper: "(root)",
            0: "b",
            1: "c"
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
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "=",
        0: "a",
        1: {
            oper: "-",
            0: "c",
            1: "b"
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
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "=",
        0: "b",
        1: {
            oper: "-",
            0: "c",
            1: "a"
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
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "=",
        0: "a",
        1: {
            oper: "/",
            0: "c",
            1: "b"
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
            0: "a",
            1: {
                item: "(val)",
                0: 1
            }
        },
        1: "c"
    },
    1: {
        oper: "=",
        0: "a",
        1: {
            oper: "^",
            0: "c",
            1: {
                oper: "-",
                0: {
                    item: "(val)",
                    0: 1
                }
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
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "=",
        0: "a",
        1: {
            oper: "±",
            0: {
                oper: "(root)",
                0: "c",
                1: "b"
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
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: "=",
        0: {
            oper: "^",
            0: {
                oper: "(root)",
                0: "a",
                1: "b"
            },
            1: "b"
        },
        1: {
            oper: "^",
            0: "c",
            1: "b"
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
        0: "a",
        1: {
            oper: "±",
            0: "b"
        }
    },
    1: {
        oper: ";",
        0: {
            oper: "=",
            0: "a",
            1: {
                oper: "+",
                0: "b"
            }
        },
        1: {
            oper: "=",
            0: "a",
            1: {
                oper: "-",
                0: "b"
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
            0: "a",
            1: "b"
        },
        1: "c"
    },
    1: {
        oper: ";",
        0: {
            oper: "=",
            0: "a",
            1: "c"
        },
        1: "b"
    }
});


