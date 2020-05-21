const assert = require('assert');
const util   = require('../src/util');

describe('util.getVariables', function() {
    it('simple expression', function() {
        assert.deepEqual(
            util.getVariables(
                "a"
            ),
            [ "a" ]
        );
    });

    it('semi complex expression', function() {
        assert.deepEqual(
            util.getVariables(
                {
                    oper: '+',
                    0: "a",
                    1: 1
                }
            ),
            [ "a" ]
        );
    });

    
});




