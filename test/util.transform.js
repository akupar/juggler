
const assert = require('assert');
const util   = require('../src/util');
const { auto, variable } = require("../src/types");

describe('util.transform', function() {
    describe('simple variable', function() {
        it('should transform integers', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=", 0: variable("a"), 1: { oper: "+", 0: variable("a"), 1: auto(0) } },
                    1
                ),
                { oper: "+", 0: "1", 1: auto(0) }
            );
        });

        it('should transform symbols', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=", 0: variable("a"), 1: { oper: "+", 0: variable("a"), 1: auto(0) } },
                    variable("b")
                ),
                { oper: "+", 0: variable("b"), 1: auto(0) }
            );
        });

        it('should transform symbols even if same symbol on both equations', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=", 0: variable("a"), 1: { oper: "+", 0: variable("a"), 1: auto(0) } },
                    variable("a")
                ),
                { oper: "+", 0: variable("a"), 1: auto(0) }
            );
        });
        
        it('should transform expressions', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=",
                      0: { oper: "+", 0: variable("a"), 1: variable("a") },
                      1: { oper: "×", 0: auto(2),   1: variable("a") }
                    },
                    { oper: "+", 0: auto(5), 1: auto(5) }
                ),
                { oper: "×", 0: auto(2), 1: auto(5) }
            );
        });

        it('should transform complex expressions', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=",
                      0: { oper: "+", 0: variable("a"), 1: variable("a") },
                      1: { oper: "×", 0: auto(2),   1: variable("a") }
                    },
                    { oper: "+", 0: auto(5), 1: auto(5) }
                ),
                { oper: "×", 0: auto(2), 1: auto(5) }
            );
        });

        it('x', function() {
            assert.deepEqual(
                util.transform(
                    { oper: "=",
                      0: variable("a"),
                      1: { oper: "+", 0: variable("a"),   1: auto(0) }
                    },
                    auto(0)
                ),
                { oper: "+", 0: auto(0),   1: auto(0) }
            );
        });

    });



    describe('optional keys', function() {
        it('optional keys should be ignored if not given', function() {
            assert.deepEqual(
                util.transform(
                    {
                        oper: "=",
                        0: {
                            oper: "/",
                            0: variable("a"),
                            1: variable("b"),
                            "?_approx": variable("approx")
                        },
                        1: {
                            oper: "/",
                            0: variable("b"),
                            1: variable("a"),
                            "?_approx": variable("approx")
                        }
                    },
                    {
                        oper: "/",
                        0: auto(9),
                        1: auto(8)
                    }
                ),
                {
                    oper: "/",
                    0: auto(8),
                    1: auto(9)
                }
            );
        });

        it('optional keys should be copied if given', function() {
            assert.deepEqual(
                util.transform(
                    {
                        oper: "=",
                        0: {
                            oper: "/",
                            0: variable("a"),
                            1: variable("b"),
                            "?_approx": "approx"
                        },
                        1: {
                            oper: "/",
                            0: variable("b"),
                            1: variable("a"),
                            "?_approx": "approx"
                        }
                    },
                    {
                        oper: "/",
                        0: auto(9),
                        1: auto(8),
                        _approx: 1.125
                    }
                ),
                {
                    oper: "/",
                    0: auto(8),
                    1: auto(9),
                    _approx: 1.125
                }
            );
        });
    });

    describe('optional keys 2', function() {
        it('optional keys should be mandatory if in equation', function() {
            assert.throws(() =>
                util.transform(
                    {
                        oper: "=",
                        0: {
                            oper: "/",
                            0: variable("a"),
                            1: variable("b"),
                            _approx: "approx"                            
                        },
                        1: {
                            oper: "/",
                            0: variable("b"),
                            1: variable("a"),
                            _approx: "approx"                            
                        }
                    },
                    {
                        oper: "/",
                        0: auto(9),
                        1: auto(8)
                    }
                ),
                          "Not matching"
            );
        });
        
        it('optional keys should be copied also when mandatory', function() {
            assert.deepEqual(
                util.transform(
                    {
                        oper: "=",
                        0: {
                            oper: "/",
                            0: variable("a"),
                            1: variable("b"),
                            _approx: "approx"
                        },
                        1: {
                            oper: "/",
                            0: variable("b"),
                            1: variable("a"),
                            _approx: "approx"                            
                        }
                    },
                    {
                        oper: "/",
                        0: auto(9),
                        1: auto(8),
                        _approx: 1.125
                    }
                ),
                {
                    oper: "/",
                    0: auto(8),
                    1: auto(9),
                    _approx: 1.125                        
                }
            );
        });
        
        it('optional keys should be copied if given', function() {
            assert.deepEqual(
                util.transform(
                    {
                        oper: "=",
                        0: {
                            oper: "/",
                            0: variable("a"),
                            1: variable("b"),
                        },
                        1: {
                            oper: "/",
                            0: variable("b"),
                            1: variable("a"),
                        }
                    },
                    {
                        oper: "/",
                        0: auto(9),
                        1: auto(8),
                        _approx: 1.125
                    }
                ),
                {
                    oper: "/",
                    0: auto(8),
                    1: auto(9),
                    _approx: 1.125
                }
            );
        });
    });
    
    describe('dumdi', function() {
        it('should move _approx', function() {
            assert.deepEqual(
                util.transform(
                    {
                        oper: "=",
                        0: {
                            oper: "/",
                            0: variable("a"),
                            1: variable("b"),
                        },
                        1: {
                            oper: "/",
                            0: variable("b"),
                            1: variable("a"),
                        }
                    },
                    {
                        oper: "/",
                        0: auto(9),
                        1: auto(8),
                        _approx: 1.125
                    }
                ),
                {
                    oper: "/",
                    0: auto(8),
                    1: auto(9),
                    _approx: 1.125
                }
            );
        });

    });
});        

