const assert = require('assert');
const util   = require('../src/util');
const { auto, variable } = require("../src/types");

describe('util.apply', function() {
    
    describe('when variables is empty', function() {
        
        it('should return integers untouched', function() {
            assert.deepEqual(util.apply(1, {}), 1);
        });
        
        it('should return symbols untouched', function() {
            assert.deepEqual(util.apply(variable("a"), {}), variable("a"));
        });
        
        it('should return val expressions untouched', function() {
            assert.deepEqual(
                util.apply(auto(3), {}),
                auto(3)
            );
        });
        
        it('should return complex expressions untouched', function() {
            assert.deepEqual(
                util.apply({
                    oper: "+",
                    0: auto(3),
                    1: auto(3)
                }, {}),
                {
                    oper: "+",
                    0: auto(3),
                    1: auto(3)
                }
            );
        });
    });
    
    describe('when given variables not found in expression', function() {
        
        it('should return integers untouched', function() {
            assert.deepEqual(util.apply(1, { "$b": auto(5) }), 1);
        });

        it('should return symbols untouched', function() {
            assert.deepEqual(util.apply(variable("a"), { "$b": auto(5) }), variable("a"));
        });
        
        it('should return val expressions untouched', function() {
            assert.deepEqual(
                util.apply(auto(3), { "$b": auto(5) }),
                auto(3)
            );
        });
        
        it('should return complex expressions untouched', function() {
            assert.deepEqual(
                util.apply(
                    {
                        oper: "+",
                        0: auto(3),
                        1: auto(3)
                    },
                    {
                        "$b": auto(5)
                    }
                ),
                {
                    oper: "+",
                    0: auto(3),
                    1: auto(3)
                }
            );
        });
        
    });

    describe('when given variables found in expression', function() {
        
        it('should replace simple symbols', function() {
            assert.deepEqual(
                util.apply(
                    variable("a"),
                    {
                        "$a": auto(5)
                    }
                ),
                auto(5)
            );
        });
        
        it('should replace variables in val expressions', function() {
            assert.deepEqual(
                util.apply(
                    {
                        item: "(val)",
                        0: variable("a")
                    },
                    {
                        "$a": 5
                    }
                ),
                auto(5)
            );
        });
        
        it('should replace symbols in complex expressions', function() {
            assert.deepEqual(
                util.apply(
                    {
                        oper: "+",
                        0: {
                            item: "(val)",
                            0: variable("a")
                        },
                        1: {
                            item: "(val)",
                            0: variable("b")
                        }
                    },
                    {
                        "$a": 5,
                        "$b": 3
                    }
                ),
                { oper: "+",
                  0: auto(5),
                  1: auto(3)
                }
            );
        });

        
        it('should replace symbols in complex expressions when they have same value, but different name', function() {
            assert.deepEqual(
                util.apply(
                    {
                        oper: "+",
                        0: {
                            item: "(val)",
                            0: variable("a")
                        },
                        1: {
                            item: "(val)",
                            0: variable("b")
                        }
                    },
                    {
                        "$a": 5,
                        "$b": 5
                    }
                ),
                {
                    oper: "+",
                    0: auto(5),
                    1: auto(5)
                }
            );
        });

        it('should replace symbols in complex expressions with complex expressions', function() {
            assert.deepEqual(
                util.apply(
                    { oper: "+", 0: variable("a"), 1: variable("b") },
                    {
                        "$a": auto(5),
                        "$b": auto(3)
                    }
                ),
                { oper: "+", 0: auto(5), 1: auto(3) }
            );
        });

        it('should replace symbols in complex expressions when they are zeroes', function() {
            assert.deepEqual(
                util.apply(
                    { oper: "+", 0: variable("a"), 1: variable("a") },
                    {
                        "$a": auto(0),
                    }
                ),
                { oper: "+", 0: auto(0), 1: auto(0) }
            );
        });
    });
    
});    

