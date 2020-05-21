import { auto, im, int, symbol } from "../types";
import store from "./store";

// i^2 = -1
store.addEquation({
    oper: "=",
    0: {
        oper: "^",
        0: im("i"),
        1: auto(2)
    },
    1: {
        oper: "-",
        0: auto(1),
    }
});

// a = a + 0i
store.addEquation({
    oper: "->",
    0: "a",
    1: {
        item: "(complex)",
        0: "a",
        1: auto(0)
    }
},
"Express as complex number",
"Simplify to non-complex number"
);

// complex(a + bi) = a + (bi)
store.addEquation({
    oper: "=",
    0: {
        item: "(complex)",
        0: "a",
        1: int("b")
    },
    1: {
        oper: "+",
        0: "a",
        1: {
            oper: "×",
            0: int("b"),
            1: im("i")
        }
    }
},
"Turn to addition operation",
"Turn to complex number representation"
);

// Re(a + bi) = a
store.addEquation({
    oper: "->",
    0: {
        oper: "Re",
        0: {
            item: "(complex)",
            0: "a",
            1: "b"
        }
    },
    1: "a"
},
"Get real part"
);

// Im(a + bi) = b
store.addEquation({
    oper: "->",
    0: {
        oper: "Im",
        0: {
            item: "(complex)",
            0: "a",
            1: "b"
        }
    },
    1:  "b"
},
"Get imaginary part"
);



// a + bi =  √(a2 + b2) ∠ tan^{-1} (b/a) 
store.addEquation({
    oper: "=",
    0: {
        item: "(complex)",
        0: "a",
        1: "b"
    },
    1: {
        oper: "∠",
        0: {
            oper: "(root)",
            0: {
                oper: "+",
                0: {
                    oper: "^",
                    0: "a",
                    1: auto(2)
                },
                1: {
                    oper: "^",
                    0: "b",
                    1: auto(2)
                }
            },
            1: auto(2)
        },
        1: {
            oper: {
                oper: "(function power)",
                0: symbol("tan"),
                1: {
                    oper: "-",
                    0: auto(1)
                }
            },
            0: {
                oper: "/",
                0: "a",
                1: "b"
            }
        }
    }
},
"Switch to polar form",
"Switch to complex number form"
);



// a + bi =  r (cos θ + i sin θ)
store.addEquation({
    oper: "=",
    0: {
        item: "(complex)",
        0: "a",
        1: "b"
    },
    1: {
        oper: "×",
        0: {
            oper: "(root)",
            0: {
                oper: "+",
                0: {
                    oper: "^",
                    0: "a",
                    1: auto(2)
                },
                1: {
                    oper: "^",
                    0: "b",
                    1: auto(2)
                }
            },
            1: auto(2)
        },
        1: {
            oper: "+",
            0: {
                oper: "(cos)",
                0: {
                    oper: {
                        oper: "(function power)",
                        0: symbol("tan"),
                        1: {
                            oper: "-",
                            0: auto(1)
                        }
                    },
                    0: {
                        oper: "/",
                        0: "a",
                        1: "b"
                    }
                }
            },
            1: {
                oper: "×",
                0: im("i"),
                1: {
                    oper: "(sin)",
                    0: {
                        oper: {
                            oper: "(function power)",
                            0: symbol("tan"),
                            1: {
                                oper: "-",
                                0: auto(1)
                            }
                        },
                        0: {
                            oper: "/",
                            0: "a",
                            1: "b"
                        }
                    }
                }
            }
        }
    }
},
"Switch to polar form",
"Switch to complex number form"
);


// a + bi =  √(a2 + b2) ∠ tan-1 (b/a) 
store.addEquation({
    oper: "=",
    0: {
        oper: "∠",
        0: "r",
        1: "θ"
    },
    1: {
        item: "(complex)",
        0: {
            oper: "×",
            0: "r",
            1: {
                oper: "(cos)",
                0: "θ"
            }
        },
        1: {
            oper: "×",
            0: "r",
            1: {
                oper: "(sin)",
                0: "θ"
            }
        }
    }
},
"Switch to complex number form",
"Switch to polar form"
);


// |a + bi| = (a^2 + b^2) [root] 2
store.addEquation({
    oper: "=",
    0: {
        oper: "(abs)",
        0: {
            item: "(complex)",
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
    1: {
        oper: "(root)",
        0: {
            oper: "+",
            0: {
                oper: "^",
                0: {
                    item: "(val)",
                    0: "a"
                },
                1: auto(2)
            },
            1: {
                oper: "^",
                0: {
                    item: "(val)",
                    0: "b"
                },
                1: auto(2)
            }
        },
        1: auto(2)
    }
},
"Turn to absolute value expression",
"Turn to absolute value of complex number"
);


// (a + bi)(c + di) = ac + adi + bci + bdi^2
store.addEquation({
    oper: "=",
    0: {
        oper: "×",
        0: {
            item: "(complex)",
            0: {
                item: "(val)",
                0: "a"
            },
            1: {
                item: "(val)",
                0: "b"
            }
        },
        1: {
            item: "(complex)",
            0: {
                item: "(val)",
                0: "c"
            },
            1: {
                item: "(val)",
                0: "d"
            }
        }
    },
    1: {
        oper: "+",
        0: {
            oper: "+",
            0: {
                oper: "+",
                0: {
                    oper: "×",
                    0: {
                        item: "(val)",
                        0: "a"
                    },
                    1: {
                        item: "(val)",
                        0: "c"
                    }
                },
                1: {
                    oper: "×",
                    0: {
                        item: "(val)",
                        0: "a"
                    },
                    1: {
                        oper: "×",
                        0: {
                            item: "(val)",
                            0: "d"
                        },
                        1: im("i")
                    }
                }
            },
            1: {
                oper: "×",
                0: {
                    item: "(val)",
                    0: "b"
                },
                1: {
                    oper: "×",
                    0: {
                        item: "(val)",
                        0: "c"
                    },
                    1: im("i")
                }
            }
        },
        1: {
            oper: "×",
            0: {
                item: "(val)",
                0: "b"
            },
            1: {
                oper: "×",
                0: {
                    item: "(val)",
                    0: "d"
                },
                1: {
                    oper: "^",
                    0: im("i"),
                    1: auto(2)
                }
            }
        }
    }
},
"Multiply complex numbers",
"Turn to complex number multiplication"
);
