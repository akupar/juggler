require('esm');

const assert = require('assert');
const util   = require('../src/util');

describe('util.apply', function() {
    
    describe('when variables is empty', function() {
        
        it('should return integers untouched', function() {
            assert.deepEqual(util.apply(1, {}), 1);
        });
        
        it('should return symbols untouched', function() {
            assert.deepEqual(util.apply("a", {}), "a");
        });
        
        it('should return val expressions untouched', function() {
            assert.deepEqual(
                util.apply({ oper: "(val)", 0: 3 }, {}),
                { oper: "(val)", 0: 3 }
            );
        });
        
        it('should return complex expressions untouched', function() {
            assert.deepEqual(
                util.apply({ oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 3 } }, {}),
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 3 } }
            );
        });
    });
    
    describe('when given variables not found in expression', function() {
        
        it('should return integers untouched', function() {
            assert.deepEqual(util.apply(1, { "b": 5 }), 1);
        });

        it('should return symbols untouched', function() {
            assert.deepEqual(util.apply("a", { "b": 5 }), "a");
        });
        
        it('should return val expressions untouched', function() {
            assert.deepEqual(
                util.apply({ oper: "(val)", 0: 3 }, { "b": 5 }),
                { oper: "(val)", 0: 3 }
            );
        });
        
        it('should return complex expressions untouched', function() {
            assert.deepEqual(
                util.apply({ oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 3 } }, { "b": 5 }),
                { oper: "+", 0: { oper: "(val)", 0: 3 }, 1: { oper: "(val)", 0: 3 } }
            );
        });
        
    });

    describe('when given variables found in expression', function() {
        
        it('should replace simple symbols', function() {
            assert.deepEqual(util.apply("a", { "a": 5 }), 5);
        });
        
        it('should replace variables in val expressions', function() {
            assert.deepEqual(
                util.apply({ oper: "(val)", 0: "a" }, { "a": 5 }),
                { oper: "(val)", 0: 5 }
            );
        });
        
        it('should replace symbols in complex expressions', function() {
            assert.deepEqual(
                util.apply(
                    { oper: "+", 0: { oper: "(val)", 0: "a" }, 1: { oper: "(val)", 0: "b" } },
                    { "a": 5, "b": 3 }
                ),
                { oper: "+", 0: { oper: "(val)", 0: 5 }, 1: { oper: "(val)", 0: 3 } }
            );
        });

        
        it('should replace symbols in complex expressions when they have same value, but different name', function() {
            assert.deepEqual(
                util.apply(
                    { oper: "+", 0: { oper: "(val)", 0: "a" }, 1: { oper: "(val)", 0: "b" } },
                    { "a": 5, "b": 5 }
                ),
                { oper: "+", 0: { oper: "(val)", 0: 5 }, 1: { oper: "(val)", 0: 5 } }
            );
        });

        it('should replace symbols in complex expressions with complex expressions', function() {
            assert.deepEqual(
                util.apply(
                    { oper: "+", 0: "a", 1: "b" },
                    {
                        "a": { oper: "(val)", 0: 5 },
                        "b": { oper: "(val)", 0: 3 }
                    }
                ),
                { oper: "+", 0: { oper: "(val)", 0: 5 }, 1: { oper: "(val)", 0: 3 } }
            );
        });

        it('should replace symbols in complex expressions when they are zeroes', function() {
            assert.deepEqual(
                util.apply(
                    { oper: "+", 0: "a", 1: "a" },
                    {
                        "a": { oper: "(val)", 0: 0 },
                    }
                ),
                { oper: "+", 0: { oper: "(val)", 0: 0 }, 1: { oper: "(val)", 0: 0 } }
            );
        });
    });

    describe('when given expression with __match_up pragma', function() {
        
        it('should replace it with corresponding variable', function() {
            const result = util.apply({
                oper: "+",
                0: {
                    __match_up: "a",
                    value: "c"
                },
                1: {
                    __match_up: "b",
                    value: null
                }
            }, { "a": { type: "int", val: 5 }, "b": 6 });
            
            assert.deepEqual(result, {
                oper: "+",
                0: { type: "int", val: 5 },
                1: 6
            });
        });

    });
    
});    

