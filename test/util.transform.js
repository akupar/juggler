
const assert = require('assert');
const util   = require('../src/util');
const eq     = require('../src/eq');

describe('util.transform', function() {
    describe('simple variable', function() {
        it('should transform integers', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=", 0: "a", 1: { oper: "+", 0: "a", 1: "0" } },
                    1
                ),
                { oper: "+", 0: "1", 1: "0" }
            );
        });

        it('should transform symbols', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=", 0: "a", 1: { oper: "+", 0: "a", 1: "0" } },
                    "b"
                ),
                { oper: "+", 0: "b", 1: "0" }
            );
        });

        it('should transform symbols even if same symbol on both equations', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=", 0: "a", 1: { oper: "+", 0: "a", 1: "0" } },
                    "a"
                ),
                { oper: "+", 0: "a", 1: "0" }
            );
        });
        
        it('should transform expressions', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=",
                      0: { oper: "+", 0: "a", 1: "a" },
                      1: { oper: "×", 0: 2,   1: "a" }
                    },
                    { oper: "+", 0: 5, 1: 5 }
                ),
                { oper: "×", 0: 2, 1: 5 }
            );
        });

        it('should transform complex expressions', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=",
                      0: { oper: "+", 0: "a", 1: "a" },
                      1: { oper: "×", 0: 2,   1: "a" }
                    },
                    { oper: "+", 0: { oper: "(val)", 0: 5 }, 1: { oper: "(val)", 0: 5 } }
                ),
                { oper: "×", 0: 2, 1: { oper: "(val)", 0: 5 } }
            );
        });

        it('x', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=",
                      0: "a",
                      1: { oper: "+", 0: "a",   1: 0 }
                    },
                    0
                ),
                { oper: "+", 0: 0,   1: 0 }
            );
        });

    });

    describe('__match_up pragma', function() {
        it('should apply operation to higher level object', function() {
            const equation = {
                oper: "=",
                0: {
                    oper: "+",
                    0: {
                        __match_up: "a",
                        value: null
                    },
                    1: {
                        __match_up: "b",
                        value: null
                    }
                },
                1: {
                    oper: "/",
                    0: "a",
                    1: "b"
                }
            };
            
            const input = {
                oper: "+",
                0: {
                    oper: "(val)",
                    0: 3,
                    value: 3
                },
                1: {
                    oper: "(symbol)",
                    0: 'pi',
                    value: 3.14
                }
            };
                
            const result = util.transform(equation, input);

            assert.deepEqual(result, {
                oper: "/",
                0: {
                    oper: "(val)",
                    0: 3,
                    value: 3
                },
                1: {
                    oper: "(symbol)",
                    0: 'pi',
                    value: 3.14
                }
            });
            
        });

        it('should work with util.contains function and any keyword', function() {
            const equation = {
                oper: "=",
                0: {
                    oper: "+",
                    0: eq.contains("a", {
                        value: eq.any
                    }),
                    1: eq.contains("b", {
                        value: eq.any
                    })
                },
                1: {
                    oper: "/",
                    0: "a",
                    1: "b"
                }
            };
            
            const input = {
                oper: "+",
                0: {
                    oper: "(val)",
                    0: 3,
                    value: 3
                },
                1: {
                    oper: "(symbol)",
                    0: 'pi',
                    value: 3.14
                }
            };
            
            const result = util.transform(equation, input);

            assert.deepEqual(result, {
                oper: "/",
                0: {
                    oper: "(val)",
                    0: 3,
                    value: 3
                },
                1: {
                    oper: "(symbol)",
                    0: 'pi',
                    value: 3.14
                }
            });
            
        });
    });
});    

