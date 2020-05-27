import {
    //getUnboundVariables,
    deepCopy,
    deepEqual,
    isVariable,
    match
} from "./util";





export default function EquationStore(onMember) {
    this.buckets = {};


    function getPath(expr, pathMember) {
        const path = [pathMember];

        let current = expr;
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

    this.getAddress = function(expr) {
        const path0 = getPath(expr, 0);
        const path1 = getPath(expr, 1);

        if ( path0.length === 1 && path1.length === 1 ) {
            return "";
        } else if ( path1.length > path0.length ) {
            return path1.join(".");
        } else {
            return path0.join(".");
        }
    };

    function getPaths(expr) {
        const path0 = getPath(expr, 0);
        const path1 = getPath(expr, 1);

        return [ path0, path1 ];
    }
    
    /**
     * Checks the equation can be used from 0 to 1 direction.
     * Returns false if right side has extra variables, otherwise true.
     **/
    function checkDirectedEquation(/*equation*/) {
        //if ( getUnboundVariables(equation).length > 2 ) {
        //return false;
        //}
        
        return true;
    }
    
    
    this.addDirectedEquation = function(eq, desc, where) {
        const bucketAddress = this.getAddress(eq[0]);
        if ( ! this.buckets[bucketAddress] ) {
            this.buckets[bucketAddress] = [];
        }

        const copy = deepCopy(eq);
        
        copy.__description = desc;
        copy.__where = where;
        
        this.buckets[bucketAddress].push(copy);
        if ( this.debug ) {
            console.log("ADDED TO (", bucketAddress, ") :", copy);
        }
    };

    
    this.addEquation2 = function (params) {
        
        const { where, desc } = params;
        const eq0 = params[0];
        const eq1 = params[1];
        let desc0 = desc;
        let desc1;
        if ( typeof(desc) === "object" ) {
            desc0 = desc[0];
            desc1 = desc[1];
        }
        
        //console.log("params:", params, desc0, desc1, where);
        
        if ( typeof(eq1) === "function" ) {
            this.addEquation({
                oper: "->",
                0: eq0,
                1: eq1
            }, desc0, null, where);
        } else {
            this.addEquation({
                oper: "=",
                0: eq0,
                1: eq1
            }, desc0, desc1, where);
        }
    };

    this.addEquationOneWay = function (params) {
        
        const { where, desc } = params;
        const eq0 = params[0];
        const eq1 = params[1];
        
        this.addEquation({
            oper: "->",
            0: eq0,
            1: eq1
        }, desc, null, where);
    };
    
    this.addEquation = function (equation, desc1, desc2, where) {
        if ( desc2 === undefined ) {
            desc2 = desc1;
        }
        
        if ( checkDirectedEquation(equation) ) {
            this.addDirectedEquation(equation, desc1, where);
            //console.log("ADDED DIR EQ:", equation);
        } else {
            console.log("Huom. Ei lisätty koska tarkistus ei palauttanut true");
        }
        

        if ( equation.oper === "="
          || equation.oper === "<=>" ) {
            var reversed = {
                oper: equation.oper,
                0: equation[1],
                1: equation[0]
            };
            
            if ( checkDirectedEquation(reversed) ) {
                this.addDirectedEquation(reversed, desc2, where);
                //console.log("ADDED DIR EQ:", reversed);
            } else {
                console.log("Huom. Ei lisätty koska tarkistus ei palauttanut true");
            }
        }
    };

    this.addDirectedEquivalence = function(equivalence, desc, where) {
        this.addDirectedEquation(equivalence, desc, where);

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
                this.addDirectedEquation(altOrder1, desc, where);
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
                this.addDirectedEquation(altOrder2, desc, where);
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
                this.addDirectedEquation(altOrder3, desc, where);
            }
        }
    };

    this.addEquivalence = function (equivalence, desc1, desc2, where) {
        console.assert(equivalence.oper === "<=>" || equivalence.oper === "->", "Wrong equivalence operator");
        //console.assert(equivalence[0].oper === "=", "Cant have other than = second level operator in equivalence:" + JSON.stringify(equivalence, where));
        //console.assert(equivalence[1].oper === "=", "Cant have other than = second level operator in equivalence:" + JSON.stringify(equivalence), where);
        
        if ( desc2 === undefined ) {
            desc2 = desc1;
        }

        this.addDirectedEquivalence(equivalence, desc1, where);

        // Add reverse equivalence, eg. if `equivalence` is a = b <=> c = d, then `reversed` is c = d <=> a = b.
        if ( equivalence.oper === "<=>" ) {
            const reversed = {
                oper: equivalence.oper,
                0: equivalence[1],
                1: equivalence[0]
            };

            this.addDirectedEquivalence(reversed, desc2, where);
        }
    };


    this.getEquations = function (path) {
        const buckets = [];
        
        let address;
        while ( path.length > 0 ) {
            address = path.join(".");
            //console.log("address:", address);
            if ( this.buckets[address] ) {
                buckets.push(this.buckets[address]);
                if ( this.debug ) {
                    console.log("INCLUDING:", path.join("."));
                }
            }
            path.pop();
        }

        if ( this.buckets[""] ) {//&& address !== "" ) {
            buckets.push(this.buckets["0."]);
            if ( this.debug ) {            
                console.log("INCLUDING:", "0.");
            }
        }

        return [].concat(...buckets);
    };

    
    this.allMatches = function (expression) {
        const [ path0, path1 ] = getPaths(expression);

        //        if ( JSON.stringify(expression).indexOf("0.955414") > -1 ) {
        //            this.debug = true;
        //        } else {
        //            this.debug = false;
        //        }

        //         if ( this.getAddress(expression).startsWith("+.+.+") ) {
        //             this.debug = true;
        //         } else {
        //             this.debug = false;
        //         }
        
        if ( this.debug ) {
            console.log("allMatches: Expression:", JSON.stringify(expression), "Path:", path0, path1);
            //console.log("path:", path);
        }


        const equations0 = this.getEquations(path0);
        const equations1 = this.getEquations(path1);
        const equations = equations0.concat(equations1);

        if ( !equations ) {
            return [];
        }

        const out = [];
        for ( let equation of equations ) {
            const description = equation.__description;
            const where = equation.__where;
            
            let vars = {};

            let score = match(equation[0], expression, vars);
            if ( this.debug ) {
                console.log("allMatches:", this.name, "Equation:", JSON.stringify(equation), "score:", score, "where:", where);
            }
            

            if ( score > 0 && where && !where(vars) ) {
                score = 0;
            }

            if ( score > 0 ) {
                out.push({ equation, vars, score, description });
            }

        }

        if ( this.debug ) {
            console.log("allMatches:", this.name, "DONE");
        }

        return out.sort((a, b) => b.score - a.score);
    };

    

    this.bestMatch = function (expression) {
        if ( this.debug ) {
            console.log("Best match for:", expression);
        }
        const matches = this.allMatches(expression);
        if ( matches.length > 0 ) {
            if ( this.debug ) {
                console.log("bestMatch: Picked:", matches[0], "score:", matches[0].score);
            }

            return matches[0];
        }
        
        return { equation: null, vars: null };
    };

    console.log("equationStore LOADED");    
    return this;
}



