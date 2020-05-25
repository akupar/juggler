const assert = require('assert');
const util   = require('../src/util');
const { variable } = require('../src/types');

describe('util.getVariables', function() {
    it('simple expression', function() {
        assert.deepEqual(
            util.getVariables(
                variable("a")
            ),
            [ "a" ]
        );
    });

    it('semi complex expression', function() {
        assert.deepEqual(
            util.getVariables(
                {
                    oper: '+',
                    0: variable("a"),
                    1: 1
                }
            ),
            [ "a" ]
        );
    });

    
});




