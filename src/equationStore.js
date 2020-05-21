import {
    getUnboundVariables,
    deepCopy,
    deepEqual,
    isVariable,
    match
} from "./util";





export default function EquationStore(onMember, pathMember) {
    this.buckets = {};


    function getPath(eq) {
        const path = [];

        let current = eq;
        do {
            let memberValue = current[onMember] || "";
            // If the operator is variable, truncate the path so the equation
            // can be matched.
            if ( isVariable(memberValue) ) {
                return path;
            }
            if ( typeof(memberValue) === "object" ) {
                memberValue = "";
            }
            path.push(memberValue);
            current = current[pathMember];
            
        } while ( typeof(current) === "object" );

        return path;
    }

    function getAddress(eq) {
        return getPath(eq).join(".");
    }
    
    /**
     * Checks the equation can be used from 0 to 1 direction.
     * Returns false if right side has extra variables, otherwise true.
     **/
    function checkDirectedEquation(equation) {
        if ( getUnboundVariables(equation).length > 2 ) {
            return false;
        }
        
        return true;
    }

    this.addDirectedEquation = function(eq, desc) {
        const bucketAddress = getAddress(eq[0]);

        if ( ! this.buckets[bucketAddress] ) {
            this.buckets[bucketAddress] = [];
        }

        const copy = deepCopy(eq);
        
        copy.__description = desc;
        
        this.buckets[bucketAddress].push(copy);
        ////console.log("ADDED TO (", bucketAddress, ") :", copy);
    };
    

    
    this.addEquation = function (equation, desc1, desc2) {
        if ( desc2 === undefined ) {
            desc2 = desc1;
        }

        
        if ( checkDirectedEquation(equation) ) {
            this.addDirectedEquation(equation, desc1);
        }
        
        ////console.log("ADDED DIR EQ:", equation);
        if ( equation.oper === "="
          || equation.oper === "<=>" ) {
            var reversed = {
                oper: equation.oper,
                0: equation[1],
                1: equation[0]
            };
            ////console.log("ADDED DIR EQ:", reversed);
            if ( checkDirectedEquation(reversed) ) {
                this.addDirectedEquation(reversed, desc2);
            }
        }
    };

    this.addDirectedEquivalence = function(equivalence, desc) {
        this.addDirectedEquation(equivalence, desc);

        // Add alternative order, eg. if `equivalence` is a = b <=> c = d,
        // then add also b = a <=> c = d, a = b <=> d = c, and b = a <=> d = c
        if ( equivalence[0].oper === "=" ) {
            const altOrder1 = {
                oper: equivalence.oper,
                0: {
                    oper: "=",
                    0: equivalence[0][1],
                    1: equivalence[0][0]
                },
                1: equivalence[1]
            };

            if ( ! deepEqual(equivalence[0][0], equivalence[0][1]) ) {
                this.addDirectedEquation(altOrder1, desc);
            }

            const altOrder2 = {
                oper: equivalence.oper,
                0: equivalence[0],
                1: {
                    oper: "=",
                    0: equivalence[1][1],
                    1: equivalence[1][0]
                }
            };

            if ( ! deepEqual(equivalence[0][0], equivalence[1][0]) ) {
                this.addDirectedEquation(altOrder2, desc);
            }

            const altOrder3 = {
                oper: equivalence.oper,
                0: {
                    oper: "=",
                    0: equivalence[0][1],
                    1: equivalence[0][0]
                },
                1: {
                    oper: "=",
                    0: equivalence[1][1],
                    1: equivalence[1][0]
                }
            };

            if ( ! deepEqual(equivalence[0][0], equivalence[1][1]) ) {
                this.addDirectedEquation(altOrder3, desc);
            }
        }
    };

    this.addEquivalence = function (equivalence, desc1, desc2) {
        console.assert(equivalence.oper === "<=>" || equivalence.oper === "->", "Error in equivalence");
        //console.assert(equivalence[0].oper === "=", "Cant have other than = second level operator in equivalence:" + JSON.stringify(equivalence));
        //console.assert(equivalence[1].oper === "=", "Cant have other than = second level operator in equivalence:" + JSON.stringify(equivalence));
        
        if ( desc2 === undefined ) {
            desc2 = desc1;
        }

        this.addDirectedEquivalence(equivalence, desc1);

        // Add reverse equivalence, eg. if `equivalence` is a = b <=> c = d, then `reversed` is c = d <=> a = b.
        if ( equivalence.oper === "<=>" ) {
            const reversed = {
                oper: equivalence.oper,
                0: equivalence[1],
                1: equivalence[0]
            };

            this.addDirectedEquivalence(reversed, desc2);
        }
    };


    this.getEquations = function (path) {
        const buckets = [];
        
        let address;
        while ( path.length > 0 ) {
            address = path.join(".");
            if ( this.buckets[address] ) {
                buckets.push(this.buckets[address]);
                //console.log("INCLUDING:", path.join("."));
            }
            path.pop();
        }

        if ( this.buckets[""] && address !== "" ) {
            buckets.push(this.buckets[""]);
        }

        return [].concat(...buckets);
    };

    
    this.allMatches = function (expression) {
        const path = getPath(expression);

        /* if ( JSON.stringify(expression).indexOf("approx") > -1 ) {
         *     this.debug = true;
         * } else {
         *     this.debug = false;
         * }
         */
        if ( this.debug ) {
            console.log("allMatches: Expression:", JSON.stringify(expression), "Path:", path);
            //console.log("path:", path);
        }
        
        const equations = this.getEquations(path);

        if ( !equations ) {
            return [];
        }
        
        const out = [];
        for ( let equation of equations ) {
            const description = equation.__description;
            
            let vars = {};
            let score = match(equation[0], expression, vars);
            if ( score > 0 ) {
                out.push({ equation, vars, score, description });
            }
            if ( this.debug ) {
                console.log("allMatches: Equation:", JSON.stringify(equation), "score:", score);
            }

        }

        return out.sort((a, b) => b.score - a.score);
    };

    

    this.bestMatch = function (expression) {
        const matches = this.allMatches(expression);
        if ( matches.length > 0 ) {
            if ( this.debug ) {
                console.log("bestMatch: Picked:", matches[0], "score:", matches[0].score);
            }

            return matches[0];
        }
        
        return { equation: null, vars: null };
    };
    
    return this;
}




