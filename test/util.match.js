const assert = require("assert");
const util   = require("../src/util");
const types  = require("../src/types");

describe("util.match", function() {
    describe("simple variable", function() {
        it("should match integer zero", function() {
            const vars = {};
            assert.equal(util.match("a", 0, vars), 1);
            assert.deepEqual(vars, { "a": 0 });
        });

        it("should match integers", function() {
            const vars = {};
            assert.equal(util.match("a", 3, vars), 1);
            assert.deepEqual(vars, { "a": 3 });
        });

        it("should match symbols", function() {
            const vars = {};
            assert.equal(util.match("a", "a", vars), 1);
            // TODO pitääkö tulla muuttujaksi?
            assert.deepEqual(vars, { "a": "a" });
        });
        
        it("should match val expressions", function() {
            const vars = {};
            assert.equal(util.match("a", { oper: "(val)", 0: 3 }, vars), 1);
            assert.deepEqual(vars, { "a": { oper: "(val)", 0: 3 } });
        });
        
        it("should match complex expressions", function() {
            const vars = {};
            assert.equal(util.match("a", { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 3 } }, vars), 1);
            assert.deepEqual(vars, { "a": { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 3 } } });
        });
    });

    describe("simple object", function() {
        it("should match similar", function() {
            const vars = {};
            const score = util.match({ oper: "(val)", 0: "a" }, { oper: "(val)", 0: 3 }, vars);
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { "a": 3 });
        });
        
        it("shouldn't match object with different operator", function() {
            const vars = {};
            assert.equal(util.match({ oper: "(val)", 0: "a" }, { oper: "(xxx)", 0: 3 }, vars), 0);
        });
    });

    describe("complex object", function() {
        it("should match similar", function() {
            const vars = {};
            const score = util.match(
                { oper: "+", 0: { oper: "(val)", 0: "a" }, 1: "b" },
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: 4 },
                vars);
            
            assert.equal(score > 0, true);
            
            assert.deepEqual(vars, { "a": 3, "b": 4 });
        });
        
        it("shouldn't match object with different operator", function() {
            const vars = {};
            assert.equal(util.match({ oper: "+", 0: "a", 1: "b" }, { oper: "-", 0: 3, 1: 4 }, vars), 0);
        });

        it("should match variables on different levels", function() {
            const vars = {};
            const score = util.match(
                { oper: "+", 0: { oper: "(val)", 0: "a" }, 1: "b" },
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 4 } },
                vars
            );
            
            assert.equal(score > 0, true);
            
            assert.deepEqual(vars, { "a": 3, "b": { oper: "(val)", 0: 4 } });
        });

        it("should accept matching variables", function() {
            const vars = {};
            const score = util.match(
                { oper: "+", 0: { oper: "(val)", 0: "a" }, 1: "a" },
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: 3 },
                vars
            );
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { "a": 3 });
        });

        it("should accept matching complex variables", function() {
            const vars = {};
            const score = util.match(
                { oper: "+", 0: "a", 1: "a" },
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 3 } },
                vars
            );
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { "a": { oper: "(val)", 0: 3 } });
        });
        
        it("should reject non matching variables", function() {
            const vars = {};
            assert.equal(
                util.match(
                    { oper: "+", 0: { oper: "(val)", 0: "a" }, 1: "a" },
                    { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: 4 },
                    vars
                ),
                0
            );
        });

        it("should reject non matching variables", function() {
            const vars = { "a": "b" };
            assert.equal(
                util.match(
                    "a",
                    { oper: "(val)", 0: 1 },
                    vars
                ),
                0
            );
        });

        it("should reject non matching complex variables", function() {
            const vars = {};
            assert.equal(
                util.match(
                    { oper: "+", 0: "a", 1: "a" },
                    { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 4 } },
                    vars
                ),
                0
            );
        });

        it("should match this", function() {
            const vars = {};
            const score = util.match(
                "a",
                {
                    "0": {
                        "0": 3,
                        "item": "(val)"
                    },
                    "1": {
                        "0": "?π",
                        "item": "(sym)",
                        "_approx": 3.14,
                        "display": "exact"
                    },
                    "oper": "/",
                    "_approx": 0.9554140127388535,
                    "display": "approx"
                },
                vars
            );
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, {
                "a": {
                    "0": {
                        "0": 3,
                        "item": "(val)"
                    },
                    "1": {
                        "0": "?π",
                        "item": "(sym)",
                        "_approx": 3.14,
                        "display": "exact"
                    },
                    "oper": "/",
                    "_approx": 0.9554140127388535,
                    "display": "approx"
                }
            });
        });
        

    });

    describe("partial matches", function() {
        it("shouldn't match if second has all the fields of first and extra and no __match_up pragma is used", function() {
            const vars = {};

            const score = util.match(
                { oper: "+", 0: "a", 1: "b" },
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 4 }, extra: { oper: "(val)", 0: 3 } },
                vars
            );
            
            assert.equal(score, 0);
        });

        /* it("should match whole object if __match_up pragma is used and object contains all values", function() {
         *     const vars = {};

         *     const score = util.match(
         *         {
         *             oper: "+",
         *             0: {
         *                 __match_up: "a",
         *                 value: 3
         *             },
         *             1: {
         *                 __match_up: "b",
         *                 value: 3.14
         *             }
         *         },
         *         {
         *             oper: "+",
         *             0: {
         *                 oper: "(val)",
         *                 0: 3,
         *                 value: 3
         *             },
         *             1: {
         *                 oper: "(symbol)",
         *                 0: "pi",
         *                 value: 3.14
         *             }
         *         },
         *         vars
         *     );
         *     
         *     assert.equal(score > 0, true);
         *     assert.deepEqual(vars, {
         *         "a": {
         *             oper: "(val)",
         *             0: 3,
         *             value: 3
         *         },
         *         "b": {
         *             oper: "(symbol)",
         *             0: "pi",
         *             value: 3.14
         *         }
         *     });
         * });
         * 
         * it("shouldn't match whole object if __match_up pragma is used and object doesn't contain all values", function() {
         *     const vars = {};

         *     const score = util.match(
         *         {
         *             oper: "+",
         *             0: {
         *                 __match_up: "a",
         *                 value: 3,
         *                 nonexistent: 3
         *             },
         *             1: {
         *                 __match_up: "b",
         *                 value: 3.14
         *             }
         *         },
         *         {
         *             oper: "+",
         *             0: {
         *                 oper: "(val)",
         *                 0: 3,
         *                 value: 3
         *             },
         *             1: {
         *                 oper: "(symbol)",
         *                 0: "pi",
         *                 value: 3.14
         *             }
         *         },
         *         vars
         *     );

         *     assert.equal(score, 0);
         * }); */
        
        /* it("shouldn't match object if __match_up pragma is used and object doesn't contain all values", function() {
         *     const vars = {};

         *     const score = util.match(
         *         {
         *             oper: "+",
         *             0: types.int("a"),
         *             1: eq.contains("b", {
         *                 _approx: eq.any
         *             })
         *         },
         *         {
         *             oper: "+",
         *             0: types.int(13),
         *             1: {
         *                 item: "(sym)",
         *                 0: "?π",
         *                 display: "π"
         *             }
         *         },
         *         vars
         *     );

         *     assert.equal(score, 0);
         * });
         * 
         * it("empty string can be used as a match all inside __match_up pragmas", function() {
         *     const vars = {};

         *     const score = util.match(
         *         {
         *             oper: "+",
         *             0: {
         *                 __match_up: "a",
         *                 value: eq.any
         *             },
         *             1: {
         *                 __match_up: "b",
         *                 value: eq.any
         *             }
         *         },
         *         {
         *             oper: "+",
         *             0: {
         *                 oper: "(val)",
         *                 0: 3,
         *                 value: 3
         *             },
         *             1: {
         *                 oper: "(symbol)",
         *                 0: "pi",
         *                 value: 3.14
         *             }
         *         },
         *         vars
         *     );
         *     
         *     assert.equal(score > 0, true);
         *     assert.deepEqual(vars, {
         *         "a": {
         *             oper: "(val)",
         *             0: 3,
         *             value: 3
         *         },
         *         "b": {
         *             oper: "(symbol)",
         *             0: "pi",
         *             value: 3.14
         *         }
         *     });
         * });

         * it("contains function can be used to inject __match_up pragma", function() {
         *     const vars = {};

         *     const score = util.match(
         *         {
         *             oper: "+",
         *             0: eq.contains("a", {
         *                 value: eq.any
         *             }),
         *             1: eq.contains("b", {
         *                 value: eq.any
         *             })
         *         },
         *         {
         *             oper: "+",
         *             0: {
         *                 oper: "(val)",
         *                 0: 3,
         *                 value: 3
         *             },
         *             1: {
         *                 oper: "(symbol)",
         *                 0: "pi",
         *                 value: 3.14
         *             }
         *         },
         *         vars
         *     );
         *     
         *     assert.equal(score > 0, true);
         *     assert.deepEqual(vars, {
         *         "a": {
         *             oper: "(val)",
         *             0: 3,
         *             value: 3
         *         },
         *         "b": {
         *             oper: "(symbol)",
         *             0: "pi",
         *             value: 3.14
         *         }
         *     });
         * });
         */
        
        it("shouldn't match if first has all the fields of second and extra", function() {
            const vars = {};

            const score = util.match(
                { oper: "+", 0: "a", 1: "b", extra: { oper: "(val)", 0: 3 } },
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 4 } },
                vars
            );
            
            assert.equal(score, 0);
        });

        
    });

    describe("optional fields", function() {
        it("should match if optional field is missing", function() {
            const vars = {};
            const score = util.match({
                oper: "/",
                0: "a",
                1: "b",
                "?_approx": "approx"
            },
                                     {
                                         oper: "/",
                                         0: types.int(3),
                                         1: types.int(5)
                                     },
                                     vars);
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { a: types.int(3), b: types.int(5) });
        });

        it("should match if optional field is present", function() {
            const vars = {};
            const score = util.match({
                oper: "/",
                0: "a",
                1: "b",
                "?_approx": "approx"
            },
                                     {
                                         oper: "/",
                                         0: types.int(3),
                                         1: types.int(5),
                                         _approx: 0.6
                                     },
                                     vars);
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { a: types.int(3), b: types.int(5), approx: 0.6 });
        });
        

    });

    describe("optional fields 2", function() {
        
        it("should match if optional field is present", function() {
            const vars = {};
            const score = util.match({
                oper: "/",
                0: "a",
                1: "b",
            },
                                     {
                                         oper: "/",
                                         0: types.int(3),
                                         1: types.int(5),
                                         _approx: 0.6
                                     },
                                     vars);
            
            assert.equal(score > 0, true);
            assert.deepEqual(vars, { a: types.int(3), b: types.int(5), approx: 0.6 });
        });
        

    });

    
});    

