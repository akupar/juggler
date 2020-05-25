const assert = require('assert');
const EquationStore = require('../src/equationStore');
const { auto, variable } = require("../src/types");

const store = new EquationStore.default("oper", 0);


describe('equationStore', function() {
    
    it('Can add equations', function() {
        const eq = {
            oper: "=",
            0: {
                oper: "+",
                0: variable("x"),
            },
            1: variable("x"),
        };
        
        store.addEquation(
            eq,
            "Toggle plus sign"
        );

        const expected = { ...eq };
        expected.__description = "Toggle plus sign";
        expected.__where = undefined;
        
        assert.deepEqual(expected, store.buckets["+"][0]);
    });


    
    it('Can find equations', function() {
        const expr = {
            oper: "+",
            0: auto(5)
        };

        const matches = store.allMatches(expr);

        assert.equal(matches.length, 2);
        
        
        assert.deepEqual(matches[0], {
            equation: store.buckets["+"][0],
            vars: {
                "x": auto(5)
            },
            score: 3,
            description: "Toggle plus sign"
        });

        assert.deepEqual(matches[1], {
            equation: store.buckets[""][0],
            vars: {
                "x": {
                    oper: "+",
                    0: auto(5)
                }
            },
            score: 1,
            description: "Toggle plus sign"
        });
        
    });
    
});    

