/**
 * These equations transform the left side [0] of the equation to MathML-elemenents.
 * The right side of the equation [1] is a function that takes takes the variables of the
 * left side as parameters and return ui.block. The function is called if the input expression
 * matches the left side of the equation.
 * 
 * The clickable elements should be created with ui.block.createBlock. Any other helper element
 * with ui.mathm.mathml or ui.mathml.$mathml.
 * 
 * NOTE: When the left side of the equation has the same variable two or more times, be sure to
 * create a new element for each. You can't use the same html-element twice in the same document!
 **/

import { format } from "../formatter";
import formatters from "./store";
import { $mathml } from "../ui/mathml";
import { createBlock } from "../ui/block";
import { bind, isVariable, getBasenameOfVariable } from "../util";
import { symbol, variable } from "../types";

//
export default formatters;


/* formatters.addEquation({
 *     oper: "->",
 *     0: {
 *         oper: "(expr)",
 *         0: "expr",
 *         vble: "vble" 
 *     },
 *     1: (vars) => {
 *         return createBlock(expr[0]);
 *     }
 * });, */

/* formatters.addEquation({
 *     oper: "->",
 *     0: "a",
 *     1: (vars) => {
 *         return createBlock(expr);
 *     }
 * });
 */


/**
 * Value.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(val)",
        0: variable("a"),
    },
    1: ({ a }) => {
        let aElem = isVariable(a) ? getBasenameOfVariable(a) : a,
            self = createBlock(
                (Number.isInteger(a) ? "mn" : "mi"),
                [ aElem ],
                {
                    item: "(val)",
                    0: a
                }
            );

        if ( isVariable(a) ) {
            self.classList.add("variable");
        }
        self.classList.add("integer");
        return self;
    }
});


/**
 * Any element with display=approx set
 **/
formatters.addEquation2({
    0: variable("a"),
    1: ({ a }) => {
        const self = createBlock(
            "mn",
            [ a._approx.toString().substring(0, 5) + "..." ],
            a
        );

        self.classList.add("approx");
        return self;
    },
    where: ({ a }) => {
        return ("_approx" in a) && (("display" in a) && a.display === ":approx");
    }
});




/**
 * Symbol.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(sym)",
        0: variable("a"),
        "?_approx": variable("approx"),
    },
    1: ({ a, approx }) => {
        let self = createBlock(
            "mi",
            [ a ],
            {
                item: "(sym)",
                0: a,
                _approx: approx,
            }
        );

        self.classList.add("symbol");
        self.setAttribute("title", approx || "");
        return self;
    }
});

/**
 * Symbol with approx value.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(sym)",
        0: variable("a"),
        _approx: variable("approx")
    },
    1: ({ a, approx }) => {
        let self = createBlock(
                "mi",
                [ a ],
                {
                    item: "(sym)",
                    0: a,
                    _approx: approx
                }
            );

        self.classList.add("symbol");
        return self;
    }
});

/**
 * Function name.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(func)",
        0: variable("a"),
    },
    1: ({ a }) => {
        let self = createBlock(
                "mi",
                [ a ],
                {
                    item: "(func)",
                    0: a
                }
            );

        self.classList.add("symbol");
        return self;
    }
});


/**
 * UUSI Function name.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(func)",
        name: variable("f"),
        0: variable("a"),
    },
    1: ({ a, f }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",
                [ $mathml("mo").append(f), " ", aElem ],
                {
                    item: "(func)",
                    name: f,
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        self.classList.add("symbol");
        return self;
    }
});

/**
 * UUSI Function name.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(func)",
        name: variable("f"),
        0: variable("a"),
        1: variable("b")
    },
    1: function({ a, b, f }) {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append(f), " ", aElem, ", ", bElem ],
                {
                    item: "(func)",
                    name: f,
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        self.classList.add("symbol");
        return self;
    }
});


/**
 * Imaginary unit.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(imaginary)",
        0: variable("a"),
    },
    1: ({ a }) => {
        let self = createBlock(
                "mi",
                [ a ],
                {
                    item: "(imaginary)",
                    0: a
                }
            );

        
        return self;
    }
});


/**
 * Summary value.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(summary)",
        approx: variable("approx"),
        display: variable("display"),
        0: variable("a")
    },
    1: ({ a, display, approx }) => {
        const self = createBlock(
            "mn",                    
            display,
            {
                oper: "(summary)",
                display: display,
                approx: approx,
                0: a
            }
        );
        
        return self;
    }
});

/**
 * Index operator [].
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "[]",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "msub",                    
                [ aElem, bElem ],
                {
                    oper: "[]",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * Unary plus sign.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "+",
        0: variable("a"),
        "?_approx": variable("approx")
    },
    1: ({ a, approx }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("+"), aElem ],
                {
                    oper: "+",
                    0: "#" + aElem.getAttribute("id"),
                    _approx: approx
                }
            );

        
        return self;
    }
});

/**
 * Unary minus sign.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "-",
        0: variable("a")
    },
    1: ({ a }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("-"), aElem ],
                {
                    oper: "-",
                    0: "#" + aElem.getAttribute("id"),
                }
            );
        
        return self;
    }
});

/**
 * Unary plus-minus sign (±).
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "±",
        0: variable("a")
    },
    1: ({ a }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("±"), aElem ],
                {
                    oper: "±",
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        return self;
    }
});

/**
 * Sine function.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(sin)",
        0: variable("a")
    },
    1: ({ a }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("sin"), " ", aElem ],
                {
                    oper: "(sin)",
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        return self;
    }
});

/**
 * Cosine function.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(cos)",
        0: variable("a")
    },
    1: ({ a }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("cos"), " ", aElem ],
                {
                    oper: "(cos)",
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        return self;
    }
});

/**
 * Tangent function.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(tan)",
        0: variable("a")
    },
    1: ({ a }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("tan"), " ", aElem ],
                {
                    oper: "(tan)",
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        return self;
    }
});


/**
 * Absolute value operator (|x|).
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(abs)",
        0: variable("a")
    },
    1: ({ a }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("|"), aElem, $mathml("mo").append("|") ],
                {
                    oper: "(abs)",
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        return self;
    }
});


/**
 * Addition operator +.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "+",
        0: variable("a"),
        1: variable("b"),
        "?_approx": variable("approx")
    },
    1: ({ a, b, approx }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("+"), bElem ],
                {
                    oper: "+",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id"),
                    _approx: approx
                }
            );

        self.setAttribute("title", approx || "");
        return self;
    }
});


/**
 * Subtraction operator -.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "-",
        0: variable("a"),
        1: variable("b") ,
        "?_approx": variable("approx")        
    },
    1: ({ a, b, approx }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("-"), bElem ],
                {
                    oper: "-",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id"),
                    _approx: approx
                }
            );

        
        return self;
    }
});

/**
 * Division operator / -> fraction display.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "/",
        0: variable("a"),
        1: variable("b"),
        "?_approx": variable("approx")
    },
    1: ({ a, b, approx }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mfrac",
                [ $mathml("mpadded").append(aElem), $mathml("mpadded").append(bElem) ],
                {
                    oper: "/",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id"),
                    _approx: approx
                }
            );


        self.setAttribute("title", approx || "");
        return self;
    }
});



/**
 * Multiplication operator × -> dot display.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "×",
        0: variable("a"),
        1: variable("b"),
        "?_approx": variable("approx")        
    },
    1: ({ a, b, approx }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("&middot;"), bElem ],
                {
                    oper: "×",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id"),
                    _approx: approx
                }
            );

        return self;
    }
});

/**
 * Division operator :. Displayed inline.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: ":",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append(":"), bElem ],
                {
                    oper: ":",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        return self;
    }
});

/**
 * Mixed numeral, eg. 1 1/3.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(mixed)",
        0: variable("a"),
        1: variable("b"),
        2: variable("c")
    },
    1: ({ a, b, c }) => {
        let self = createBlock(
                "mpadded",
                [
                    $mathml("mpadded").append(a),
                    $mathml("mfrac").append([
                        $mathml("mpadded").append(b),
                        $mathml("mpadded").append(c)
                    ])
                ],
                {
                    oper: "(mixed)",
                    0: a,
                    1: b,
                    2: c
                }
            );

        return self;
    }
});

/**
 * Power operator ^. Displayed superscript.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "^",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "msup",
                [ $mathml("mpadded").append(aElem), $mathml("mpadded").append(bElem) ],
                {
                    oper: "^",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * Root operator (root). Displayed as root sign and left superscript.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(root)",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mroot",
                [ $mathml("mpadded").append(aElem), $mathml("mpadded").append(bElem) ],
                {
                    oper: "(root)",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});


/**
 * Logarithm.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "log",
        0: variable("k"),
        1: variable("a") 
    },
    1: ({ k, a }) => {
        let kElem = format(k),
            aElem = format(a),
            self = createBlock(
                "mpadded",
                [ $mathml("msub").append([ $mathml("mo").append("log"), kElem ]), $mathml("mpadded").append(aElem) ],
                {
                    oper: "log",
                    0: "#" + kElem.getAttribute("id"),
                    1: "#" + aElem.getAttribute("id")
                }
            );

        
        return self;
    }
});


/**
 * Natural logarithm.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "ln",
        0: variable("a") 
    },
    1: ({ a }) => {
        let aElem = format(a),
            self = createBlock(
                "mpadded",
                [ $mathml("mo").append("ln"), $mathml("mpadded").append(aElem) ],
                {
                    oper: "ln",
                    0: "#" + aElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * Function composition operator ∘. Displayed inline.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "∘",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("∘"), bElem ],
                {
                    oper: "∘",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});


/**
 * Power of function composition operator (function power). Displayed as superscript before the parentheses.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(function power)",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "msup",
                [ $mathml("mpadded").append(aElem), $mathml("mpadded").append(bElem) ],
                {
                    oper: "(function power)",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});



/**
 * Equation separator (;).
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: ";",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append(";"), "<br/>", bElem ],
                {
                    oper: ";",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});


/**
 * Cancelling. Displayed as superscript on right side with left parenthesis.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(supistaminen)",
        0: variable("ab"),
        1: variable("c") 
    },
    1: ({ ab, c }) => {
        let abElem = format(ab),
            cElem = format(c),
            self = createBlock(
                "msup",
                [ $mathml("mpadded").append(abElem), $mathml("mpadded").append("(", cElem) ],
                {
                    oper: "(supistaminen)",
                    0: "#" + abElem.getAttribute("id"),
                    1: "#" + cElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * Expansion. Displayed as superscript on left side with right parenthesis.
 * Note. Doesn't work correctly in Firefox. The superscript is drawn on the right side.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(laventaminen)",
        0: variable("ab"),
        1: variable("c") 
    },
    1: ({ ab, c }) => {
        let abElem = format(ab),
            cElem = format(c),
            self = createBlock(
                "mmultiscripts",
                // Huom. pitäisi olla oikein, muttei toimi Firefoxissa
                [ $mathml("mpadded").append(abElem), "<mprescripts/>", "<none/>", $mathml("mpadded").append(cElem, ")") ],
                {
                    oper: "(laventaminen)",
                    0: "#" + abElem.getAttribute("id"),
                    1: "#" + cElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * Series with ellipsis. TODO needs to be updated.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "...",
        expr: variable("expr"),
        start: variable("start"),
        end: variable("end"),
        concat: variable("concat"),
        vble: symbol(variable("vble"))
    },

    1: ({ expr, start, end, concat, vble }) => {
        console.log("...:", { expr, start, end, concat, vble });
            return createBlock(
                "mpadded",
                [
                    format(
                        bind(
                            {
                                [vble]: start
                            },
                            expr
                        )
                    ),
                " ",
                concat,                
                " ... ",
                concat,
                " ",
                    format(
                        bind(
                            {
                                [vble]: end 
                            },
                            expr
                        )
                    )
                ],
                {
                    oper: "...",
                    expr: expr,
                    start: start,
                    end: end,
                    concat: concat,
                    vble: symbol(vble)
                }
            );
    }
});

/**
 * Sum operator. TODO needs to be updated.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(sum)",
        expr: variable("expr"),
        start: variable("start"),
        end: variable("end"),
        vble: variable("vble") 
    },

    1: ({ expr, start, end, vble }) => {
        
        return createBlock(
            "div",
            [ end, "<br/>",
              "summa ", "<br/>",
              vble, " = ", start ],
            {
                oper: "(sum)",
                expr: expr,
                start: start,
                end: end,
                vble: vble
            });
    }
});

/**
 * Equality operator =.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "=",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("="), bElem ],
                {
                    oper: "=",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * Greater than or equal to (≥).
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "≥",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("≥"), bElem ],
                {
                    oper: "≥",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * One sided ”equality” operator ->. Displayed as inline &rarr;.
 * This is used in the suggestions display in place of equality sign.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "&rarr;",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("&rarr;"), bElem ],
                {
                    oper: "&rarr;",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});    




/**
 * Complex number.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        item: "(complex)",
        0: variable("a"),
        1: variable("b")
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("+"), bElem, "i" ],
                {
                    item: "(complex)",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );

        
        return self;
    }
});

/**
 * Complex number polar form separator ∠.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "∠",
        0: variable("a"),
        1: variable("b") 
    },
    1: ({ a, b }) => {
        let aElem = format(a),
            bElem = format(b),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("∠"), bElem ],
                {
                    oper: "∠",
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );
        
        return self;
    }
});


/**
 * Degrees symbol °.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "°",
        0: variable("a")
    },
    1: function degreeFormatter({ a }) {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ aElem, $mathml("mo").append("°") ],
                {
                    oper: "°",
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        
        return self;
    }
});

/**
 * Radians symbol rad.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(rad)",
        0: variable("a")
    },
    1: function degreeFormatter({ a }) {
        let aElem = format(a),
            self = createBlock(
                "mpadded",                    
                [ aElem, " ", $mathml("mo").append("rad") ],
                {
                    oper: "(rad)",
                    0: "#" + aElem.getAttribute("id"),
                }
            );

        
        return self;
    }
});



/**
 * Function with one parameter. TODO other functions
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: variable("f"),
        0: variable("a")
    },
    1: function generalFunctionFormatter1({ a, f }) {
        let aElem = format(a),
            fElem = format(f),
            self = createBlock(
                "mpadded",
                [ $mathml("mi").append(fElem), "&nbsp;", aElem ],
                {
                    oper: "#" + fElem.getAttribute("id"),
                    0: "#" + aElem.getAttribute("id")
                }
            );
        
        
        return self;
    }
});

/**
 * Function with two parameters. TODO tarviiko erilliset kaikkiin??
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: variable("f"),
        0: variable("a"),
        1: variable("b")        
    },
    1: function generalFunctionFormatter2({ a, b, f }) {
        let aElem = format(a),
            bElem = format(b),
            fElem = format(f),
            self = createBlock(
                "mpadded",
                [ $mathml("mi").append(fElem), "&nbsp;", aElem, ", ", bElem ],
                {
                    oper: "#" + fElem.getAttribute("id"),
                    0: "#" + aElem.getAttribute("id"),
                    1: "#" + bElem.getAttribute("id")
                }
            );
        
        
        return self;
    }
});




console.log("formatters loaded");
