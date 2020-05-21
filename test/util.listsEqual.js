const assert = require('assert');
const util   = require('../src/util');

describe('util.listsEqual', function() {
    /* it('does not equal nulls', function() {
     *     assert.throws(() => util.listsEqual(null, null), { name: 'TypeError', message: 'Value must be array' });
     * }); */
    
    it('equals empty lists', function() {
        assert.ok(util.listsEqual([], []));
    });

    it('equals lists with multiple items', function() {
        assert.ok(util.listsEqual(["a", "b"], ["a", "b"]));
    });

    it('equals lists with items in different order', function() {
        assert.ok(util.listsEqual(["a", "b"], ["b", "a"]));
    });

    it('returns false for lists with duplicate items', function() {
        assert.equal(
            util.listsEqual(
                [ 1, 2, 3, 3, 4 ],
                [ 1, 2, 3, 4 ]
            ),
            false
        );
    });

    it('returns false for lists with different lengths', function() {
        assert.equal(
            util.listsEqual(
                [ 1, 2, 3, 4 ],
                [ 1, 2, 3 ]
            ),
            false
        );
    });

    it('returns false for lists with different items', function() {
        assert.equal(
            util.listsEqual(
                [ 1, 2, 3, 4 ],
                [ 1, 2, 5, 4 ]
            ),
            false
        );
    });
    
});




