const assert = require('assert');
const EquationStore = require('../src/equationStore');
const { auto, symbol, variable } = require("../src/types");




describe('equationStore', function() {
    let store;
    before(function () {
        store = new EquationStore.default("oper", 0);
    });
    
    it('returns longer path', function() {
        const eq = {
            "0": {
                "0": "$a",
                "1": "$b",
                "oper": "="
            },
            "1": {
                "0": {
                    "0": "$a",
                    "1": "$c",
                    "oper": "+"
                },
                "1": {
                    "0": "$b",
                    "1": "$c",
                    "oper": "+"
                },
                "oper": "="
            },
            "oper": "<=>"
        };
        
        const actual = store.getAddress(eq);

        const expected = "1.=.+";
        
        assert.equal(actual, expected);
    });





});    
