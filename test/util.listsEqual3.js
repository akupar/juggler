const assert = require('assert');
const util   = require('../src/util');

describe('util.hasRequiredKeysOf2', function() {
    /* it('does not equal nulls', function() {
     *     assert.throws(() => util.hasRequiredKeysOf2(null, null), { name: 'TypeError', message: 'Value must be array' });
     * }); */
    
    it('equals empty lists', function() {
        assert.ok(util.hasRequiredKeysOf2([], []));
    });

    it('equals lists with multiple items', function() {
        assert.ok(util.hasRequiredKeysOf2(["a", "b"], ["a", "b"]));
    });

    it('equals lists with items in different order', function() {
        assert.ok(util.hasRequiredKeysOf2(["a", "b"], ["b", "a"]));
    });

    describe('without optional keys', function () {
        
        it('returns true if lists equal exactly', function() {
            assert.ok(
                util.hasRequiredKeysOf2(
                    [ "a", "b", "c" ],
                    [ "a", "b", "c" ]
                )
            );
        });


        it('returns false if required key is missing', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "b", "c" ],
                    [ "a" ]
                ),
                false
            );
        });

        it('returns false if required key is missing', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "b", "c" ],
                    [ "a", "b" ]
                ),
                false
            );
        });


        it('returns false if required key is missing, but has extra key', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "b", "c" ],
                    [ "d" ]
                ),
                false
            );
        });
        

        it('returns false if has expression side has extra keys', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
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
                util.hasRequiredKeysOf2(
                    [ "a", "c" ],
                    [ "a", "_b", "c" ]
                )
            );
        });


        it('returns false if required key is missing', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "c" ],
                    [ "a", "_b" ]
                ),
                false
            );
        });

        it('returns false if required key is missing, but has optional key', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "c" ],
                    [ "_b" ]
                ),
                false
            );
        });

        it('returns false if required key is missing, but has extra key', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "c" ],
                    [ "d" ]
                ),
                false
            );
        });
        

        it('returns false if expression has extra keys', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "c" ],
                    [ "a", "c", "d" ]
                ),
                false
            );
        });
        
        it('returns false if has expression has extra keys', function() {
            assert.equal(
                util.hasRequiredKeysOf2(
                    [ "a", "c" ],
                    [ "a", "_b", "c", "d" ]
                ),
                false
            );
        });

        describe('required optional keys', function () {
            
            it('returns true if required optional key is present', function() {
                assert.ok(
                    util.hasRequiredKeysOf2(
                        [ "oper", "!_approx", "0", "1" ],
                        [ "oper", "_approx", "0", "1" ]
                    )
                );
            });

            it('returns false if required optional key is missing', function() {
                assert.ok(
                    util.hasRequiredKeysOf2(
                        [ "oper", "!_approx", "0", "1" ],
                        [ "oper", "0", "1" ]
                    )
                );
            });
        });
    });
});


// F                      E
// a, c                   OK a,_b,c  ;  a,c
//                        NG a,c,d  ;  a,_b,c,d  ;  a  ;  _b  ;  c  ;  a, _b  ;  _b, c  ;  d
// 
// 
// F - E                               
// []                                  
// []                                 
// 
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
// [_b]   
// []  
// 
// [d]    
// [_b, d] 
// []    
// [_b]   
// []    
// [_b]   
// [_b]   
// [d]   


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




