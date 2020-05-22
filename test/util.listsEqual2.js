const assert = require('assert');
const util   = require('../src/util');

describe('util.hasRequiredKeysOf', function() {
    /* it('does not equal nulls', function() {
     *     assert.throws(() => util.hasRequiredKeysOf(null, null), { name: 'TypeError', message: 'Value must be array' });
     * }); */
    
    it('equals empty lists', function() {
        assert.ok(util.hasRequiredKeysOf([], []));
    });

    it('equals lists with multiple items', function() {
        assert.ok(util.hasRequiredKeysOf(["a", "b"], ["a", "b"]));
    });

    it('equals lists with items in different order', function() {
        assert.ok(util.hasRequiredKeysOf(["a", "b"], ["b", "a"]));
    });

    describe('without optional keys', function () {
        
        it('returns true if lists equal exactly', function() {
            assert.ok(
                util.hasRequiredKeysOf(
                    [ "a", "b", "c" ],
                    [ "a", "b", "c" ]
                )
            );
        });


        it('returns false if required key is missing', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "b", "c" ],
                    [ "a" ]
                ),
                false
            );
        });

        it('returns false if required key is missing', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "b", "c" ],
                    [ "a", "b" ]
                ),
                false
            );
        });


        it('returns false if required key is missing, but has extra key', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "b", "c" ],
                    [ "d" ]
                ),
                false
            );
        });
        

        it('returns false if has expression side has extra keys', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "b", "c" ],
                    [ "a", "b", "c", "d" ]
                ),
                false
            );
        });
        
    });
    
    describe('optional keys', function () {
        
        it('returns true if both required and optional keys are present', function() {
            assert.ok(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "a", "b", "c" ]
                )
            );
        });

        it('returns true if optional key is missing but required keys are present', function() {
            assert.ok(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "a", "c" ]
                )
            );
        });

        it('returns false if required and optional keys are missing', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "a" ]
                ),
                false
            );
        });

        it('returns false if required key is missing', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "a", "b" ]
                ),
                false
            );
        });

        it('returns false if required key is missing, but has optional key', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "b" ]
                ),
                false
            );
        });

        it('returns false if required key is missing, but has extra key', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "d" ]
                ),
                false
            );
        });
        

        it('returns false if has expression has extra keys', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "a", "c", "d" ]
                ),
                false
            );
        });
        
        it('returns false if has expression has extra keys', function() {
            assert.equal(
                util.hasRequiredKeysOf(
                    [ "a", "?b", "c" ],
                    [ "a", "b", "c", "d" ]
                ),
                false
            );
        });

        describe('optional keys', function () {
            
            it('returns true if both required and optional keys are present', function() {
                assert.ok(
                    util.hasRequiredKeysOf(
                        [ "oper", "?_approx", "0", "1" ],
                        [ "oper", "0", "1" ]
                    )
                );
            });

            it('returns true if optional key is missing but required keys are present', function() {
                assert.ok(
                    util.hasRequiredKeysOf(
                        [ "oper", "?_approx", "0", "1" ],
                        [ "oper", "_approx", "0", "1" ]
                    )
                );
            });
        });
    });
});


// F                      E
// 0: a, b, c             OK a,b,c  ;  a,c
// 1: a, c                NG a,c,d  ;  a,b,c,d  ;  a  ;  b  ;  c  ;  a, b  ;  b, c  ;  d
// F: a, ?b, c
// 
// F0 - E         F1 - E                F - E
// []             []                    [?b]
// [b]            []                    [?b]
// 
// [b]            []                    [?b]
// []             []                    [?b]
// [c]            [c]                   [?b, c]
// []             [a, c]                [a, ?b, c]
// [a]            [a]                   [a, ?b]
// [c]            [c]                   [?b, c]
// [a]            [a]                   [a, ?b]
// []             [a, c]                [a, ?b, c]
// 
// ----
// E - F1         E - F0                E - F
// []             []                    [b]
// [b]            []                    []
// 
// [d]            [d]                   [d]
// [b, d]         [d]                   [b, d]
// []             []                    []
// [b]            []                    [b]
// []             []                    []
// [b]            []                    [b]
// [b]            []                    [b]
// [d]            [d]                   [d]


// F                      E
// 0: a, b, c             OK a,b,c
// 1: a, b, c             NG a, c  ;  a,c,d  ;  a,b,c,d  ;  a  ;  b  ;  c  ;  a, b  ;  b, c  ;  d
// 
// F - E
// []

// []
// []
// []
// [c]
// [a, c]
// [a]
// [c]
// [a]
// [a, c]
// 
// ----
// E - F
// []

// [b]
// [d]
// [b, d]
// []
// [b]
// []
// [b]
// [b]
// [d]




