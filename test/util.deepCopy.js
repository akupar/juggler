const assert = require('assert');
const util   = require('../src/util');

describe('util.deepCopy', function() {
    it('copy integers', function() {
        assert.equal(util.deepCopy("1"), "1");
    });

    it('copy symbols', function() {
        assert.equal(util.deepCopy("a"), "a");
    });

    it('copy objects', function() {
        assert.deepEqual(util.deepCopy({ oper: "+", 0: "a", 1: "b" }), { oper: "+", 0: "a", 1: "b" });
    });

    it('copy deep objects', function() {
        assert.deepEqual(
            util.deepCopy(
                { oper: "+", 0: { oper: "-", 0: "a", 1: { oper: "×", 0: "b", 1: "c" } }, 1: "d" }
            ),
            { oper: "+", 0: { oper: "-", 0: "a", 1: { oper: "×", 0: "b", 1: "c" } }, 1: "d" }
        );
    });
});




