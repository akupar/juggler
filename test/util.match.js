const assert = require("assert");
const util   = require("../src/util");
const { auto, variable } = require("../src/types");



describe("util.match", function() {
    describe("simple variable", function() {
        it("should match integer zero", function() {
            const vars = {};
            assert.equal(util.match(variable("a"), auto(0), vars), 1);
            assert.deepEqual(vars, { "$a": auto(0) });
        });

        it("should match integers", function() {
            const vars = {};
            assert.equal(util.match(variable("a"), auto(3), vars), 1);
            assert.deepEqual(vars, {
                "$a": auto(3)
            });
        });

        it("should match symbols", function() {
            const vars = {};
            assert.equal(util.match(variable("a"), variable("a"), vars), 1);
            // TODO pitääkö tulla muuttujaksi?
            assert.deepEqual(vars, { "$a": variable("a") });
        });
        
        it("should match val expressions", function() {
            const vars = {};
            assert.equal(util.match(variable("a"), auto(3), vars), 1);
            assert.deepEqual(vars, { "$a": auto(3) });
        });
        
        it("should match complex expressions", function() {
            const vars = {};
            assert.equal(util.match(variable("a"), { oper: "+", 0: auto(3), 1: auto(3) }, vars), 1);
            assert.deepEqual(vars, { "$a": { oper: "+", 0: auto(3), 1: auto(3) } });
        });
    });

    describe("simple object", function() {
        it("should match similar", function() {
            const vars = {};
            const score = util.match({
                item: "(val)",
                0: variable("a")
            }, auto(3), vars);
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, {
                "$a": 3
            });
        });

        
        it("shouldn't match object with different operator", function() {
            const vars = {};
            assert.equal(util.match(
                {
                    item: "(val)",
                    0: variable("a")
                },
                {
                    oper: "(xxx)",
                    0: auto(3)
                }, vars), 0);
        });
    });
    

    describe("complex object", function() {
        it("should match similar", function() {
            const vars = {};
            const score = util.match(
                {
                    oper: "+",
                    0: {
                        item: "(val)",
                        0: variable("a")
                    },
                    1: variable("b")
                },
                {
                    oper: "+",
                    0: auto(3),
                    1: auto(4)
                },
                vars);
            
            assert.equal(score > 0, true);
            
            assert.deepEqual(vars, {
                "$a": 3,
                "$b": auto(4)
            });
        });

        
        it("shouldn't match object with different operator", function() {
            const vars = {};
            assert.equal(util.match(
                {
                    oper: "+",
                    0: variable("a"),
                    1: variable("b")
                },
                {
                    oper: "-",
                    0: auto(3),
                    1: auto(4)
                }, vars), 0);
        });

        it("should match variables on different levels", function() {
            const vars = {};
            const score = util.match(
                {
                    oper: "+",
                    0: {
                        item: "(val)",
                        0: variable("a")
                    },
                    1: variable("b")
                },
                {
                    oper: "+",
                    0: auto(3),
                    1: auto(4)
                },
                vars
            );
            
            assert.equal(score > 0, true);
            
            assert.deepEqual(vars, { "$a": 3, "$b": auto(4) });
        });

        it("should accept matching variables", function() {
            const vars = {};
            const score = util.match(
                {
                    oper: "+",
                    0: {
                        item: "(val)",
                        0: variable("a")
                    },
                    1: variable("a")
                },
                {
                    oper: "+",
                    0: auto(3),
                    1: 3
                },
                vars
            );
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { "$a": 3 });
        });

        it("should accept matching complex variables", function() {
            const vars = {};
            const score = util.match(
                {
                    oper: "+",
                    0: variable("a"),
                    1: variable("a")
                },
                {
                    oper: "+",
                    0: auto(3),
                    1: auto(3)
                },
                vars
            );
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { "$a": auto(3) });
        });
        
        it("should reject non matching variables", function() {
            const vars = {};
            assert.equal(
                util.match(
                    {
                        oper: "+",
                        0: {
                            item: "(val)",
                            0: variable("a")
                        },
                        1: variable("a")
                    },
                    {
                        oper: "+",
                        0: auto(3),
                        1: auto(4)
                    },
                    vars
                ),
                0
            );
        });

        it("should reject non matching variables", function() {
            const vars = {
                "$a": auto(3)
            };
            
            assert.equal(
                util.match(
                    variable("a"),
                    auto(1),
                    vars
                ),
                0
            );
        });

        it("should reject non matching complex variables", function() {
            const vars = {};
            assert.equal(
                util.match(
                    {
                        oper: "+",
                        0: variable("a"),
                        1: variable("a")
                    },
                    {
                        oper: "+",
                        0: auto(3),
                        1: auto(4)
                    },
                    vars
                ),
                0
            );
        });

        it("should match this", function() {
            const vars = {};
            const score = util.match(
                variable("a"),
                {
                    0: {
                        item: "(val)",
                        0: auto(3)
                    },
                    1: {
                        item: "(sym)",
                        0: "?π",
                        _approx: 3.14,
                        display: "exact"
                    },
                    oper: "/",
                    _approx: 0.9554140127388535,
                    display: "approx"
                },
                vars
            );
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, {
                "$a": {
                    0: {
                        0: auto(3),
                        "item": "(val)"
                    },
                    1: {
                        0: "?π",
                        item: "(sym)",
                        _approx: 3.14,
                        display: "exact"
                    },
                    oper: "/",
                    _approx: 0.9554140127388535,
                    display: "approx"
                }
            });
        });
        

    });


    describe("optional fields", function() {
        it("should match if optional field is missing", function() {
            const vars = {};
            const score = util.match({
                oper: "/",
                0: variable("a"),
                1: variable("b"),
                "?_approx": "approx"
            },
                                     {
                                         oper: "/",
                                         0: auto(3),
                                         1: auto(5)
                                     },
                                     vars);
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, {"$a": auto(3),"$b": auto(5) });
        });

        it("should match if optional field is present", function() {
            const vars = {};
            const score = util.match({
                oper: "/",
                0: variable("a"),
                1: variable("b"),
                "?_approx": variable("approx")
            },
                                     {
                                         oper: "/",
                                         0: auto(3),
                                         1: auto(5),
                                         _approx: 0.6
                                     },
                                     vars);
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, {
                $a: auto(3),
                $b: auto(5),
                $approx: 0.6
            });
        });
        

    });

    describe("optional fields 2", function() {
        
        it("should match if optional field is present", function() {
            const vars = {};
            const score = util.match({
                oper: "/",
                0: variable("a"),
                1: variable("b"),
            },
                                     {
                                         oper: "/",
                                         0: auto(3),
                                         1: auto(5),
                                         _approx: 0.6
                                     },
                                     vars);
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { "$a": auto(3), "$b": auto(5) });
        });
        

    });

    
});    

