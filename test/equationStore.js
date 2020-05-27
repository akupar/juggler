const assert = require('assert');
const EquationStore = require('../src/equationStore');
const { auto, symbol, variable } = require("../src/types");




describe('equationStore', function() {
    describe('adding equations', function() {
        let store;
        before(function () {
            store = new EquationStore.default("oper", 0);
        });
        
        it('Can add equations', function() {
            const eq = {
                oper: "=",
                0: {
                    oper: "+",
                    0: variable("x"),
                },
                1: variable("x"),
            };
            
            store.addEquation(
                eq,
                "Toggle plus sign"
            );

            const expected = { ...eq };
            expected.__description = "Toggle plus sign";
            expected.__where = undefined;
            
            assert.deepEqual(expected, store.buckets["0.+"][0]);
        });


        it('Can add complex equations', function() {
            const eq = {
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
                1: {
                    oper: "...",
                    expr: variable("expr"),
                    start: variable("start"),
                    end: variable("end"),
                    concat: "+",
                    vble: symbol("i")
                }
            };
            
            store.addEquation2({
                0: eq[0],
                1: eq[1],
                desc: {
                    0: "Muuta summalausekkeeksi",
                    1: "Muuta lukujonoksi"
                }
            });

            const expected1 = {
                oper: "=",
                0: eq[0],
                1: eq[1]
            };
            expected1.__description = "Muuta summalausekkeeksi";
            expected1.__where = undefined;

            const expected2 = {
                oper: "=",
                0: eq[1],
                1: eq[0]
            };
            expected2.__description = "Muuta lukujonoksi";
            expected2.__where = undefined;

            assert.deepEqual(expected1, store.buckets["0.+.+.+"][0]);
            assert.deepEqual(expected2, store.buckets["1...."][0]);            
        });

    });


    describe('finding equations', function() {
        let  store;
        before(function () {
            store = new EquationStore.default("oper", 0);
            const eq = {
                oper: "=",
                0: {
                    oper: "+",
                    0: variable("x"),
                },
                1: variable("x"),
            };
            
            store.addEquation(
                eq,
                "Toggle plus sign"
            );

            const eq2 = {
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
                1: {
                    oper: "...",
                    expr: variable("expr"),
                    start: variable("start"),
                    end: variable("end"),
                    concat: "+",
                    vble: symbol("i")
                }
            };
            
            store.addEquation2({
                0: eq2[0],
                1: eq2[1],
                desc: {
                    0: "Muuta summalausekkeeksi",
                    1: "Muuta ellipsiksi"
                }
            });
            

        });

        it('Can find simple equations', function() {
            const expr = {
                oper: "+",
                0: auto(5)
            };

            const matches = store.allMatches(expr);

            assert.equal(matches.length, 2);
            
            
            assert.deepEqual(matches[0], {
                equation: store.buckets["0.+"][0],
                vars: {
                    "x": auto(5)
                },
                score: 3,
                description: "Toggle plus sign"
            });

            assert.deepEqual(matches[1], {
                equation: store.buckets[""][0],
                vars: {
                    "x": {
                        oper: "+",
                        0: auto(5)
                    }
                },
                score: 1,
                description: "Toggle plus sign"
            });
            
        });

        
        it('Can find complex equations', function() {
            const expr = {
                oper: "+",
                0: {
                    oper: "+",
                    0: {
                        oper: "+",
                        0: auto(1),
                        1: auto(2)
                    },
                    1: auto(3)
                },
                1: auto(4)
            };

            const matches = store.allMatches(expr);

            assert.equal(matches.length, 2);

            //console.log("BUCKETS:", store.buckets);
            assert.deepEqual(matches[0], {
                equation: store.buckets["+.+.+"][0],
                vars: {
                    "a": auto(1),
                    "b": auto(2),
                    "c": auto(3),
                    "d": auto(4)                    
                },
                score: 10,
                description: "Muuta summalausekkeeksi"
            });

            
        });
        
    });    
});    
