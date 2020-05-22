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
import { bind } from "../util";

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
        0: "a",
    },
    1: (vars) => {
        let a = vars["a"],
            self = createBlock(
                (Number.isInteger(vars["a"]) ? "mn" : "mi"),
                [ a ],
                {
                    item: "(val)",
                    0: vars["a"]
                }
            );

        self.classList.add("integer");
        return self;
    }
});


/**
 * Any element with display=approx set
 **/
formatters.addEquation2({
    0: "a",
    1: ({ a }) => {
        console.log("display formatter:", a);
        
        return createBlock(
            "mn",
            [ a._approx.toString().substring(0, 5) + "..." ],
            a
        );
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
        0: "a",
        "?_approx": "approx",
    },
    1: ({ a, approx }) => {
        let self = createBlock(
            "mi",
            [ a.replace(/^\?/, "") ],
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
        0: "a",
        _approx: "approx"
    },
    1: (vars) => {
        let a = vars["a"],
            self = createBlock(
                "mi",
                [ a.replace(/^\?/, "") ],
                {
                    item: "(sym)",
                    0: vars["a"],
                    _approx: vars["approx"]
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
        0: "a",
    },
    1: (vars) => {
        let a = vars["a"].replace(/^\?/, ""),
            self = createBlock(
                "mi",
                [ a ],
                {
                    item: "(func)",
                    0: vars["a"]
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
        name: "f",
        0: "a",
    },
    1: (vars) => {
        let a = format(vars["a"]),
            f = vars["f"].replace(/^\?/, ""),
            self = createBlock(
                "mpadded",
                [ $mathml("mo").append(f), " ", a ],
                {
                    item: "(func)",
                    name: vars["f"],
                    0: "#" + a.getAttribute("id"),
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
        name: "f",
        0: "a",
        1: "b"
    },
    1: function NEW_FUNC_FORMATTER(vars) {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            f = vars["f"].replace(/^\?/, ""),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append(f), " ", a, ", ", b ],
                {
                    item: "(func)",
                    name: vars["f"],
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
    },
    1: (vars) => {
        let a = vars["a"],
            self = createBlock(
                "mi",
                [ a ],
                {
                    item: "(imaginary)",
                    0: vars["a"]
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
        approx: "approx",
        display: "d",
        0: "a"
    },
    1: (vars) => {
        const self = createBlock(
            "mn",                    
            vars["d"],
            {
                oper: "(summary)",
                display: vars["d"],
                approx: vars["approx"],
                0: vars["a"]
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "msub",                    
                [ a, b ],
                {
                    oper: "[]",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("+"), a ],
                {
                    oper: "+",
                    0: "#" + a.getAttribute("id"),
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
        0: "a"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("-"), a ],
                {
                    oper: "-",
                    0: "#" + a.getAttribute("id"),
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
        0: "a"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("±"), a ],
                {
                    oper: "±",
                    0: "#" + a.getAttribute("id"),
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
        0: "a"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("sin"), " ", a ],
                {
                    oper: "(sin)",
                    0: "#" + a.getAttribute("id"),
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
        0: "a"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("cos"), " ", a ],
                {
                    oper: "(cos)",
                    0: "#" + a.getAttribute("id"),
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
        0: "a"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("tan"), " ", a ],
                {
                    oper: "(tan)",
                    0: "#" + a.getAttribute("id"),
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
        0: "a"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ $mathml("mo").append("|"), a, $mathml("mo").append("|") ],
                {
                    oper: "(abs)",
                    0: "#" + a.getAttribute("id"),
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
        0: "a",
        1: "b",
        "?_approx": "approx"
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("-"), b ],
                {
                    oper: "-",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b",
        "?_approx": "approx"
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("&middot;"), b ],
                {
                    oper: "×",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append(":"), b ],
                {
                    oper: ":",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b",
        2: "c"         
    },
    1: (vars) => {
        let a = vars["a"],
            b = vars["b"],
            c = vars["c"],
            self = createBlock(
                "mpadded",
                [
                    $mathml("mpadded").append(a[0]),
                    $mathml("mfrac").append([
                        $mathml("mpadded").append(b[0]),
                        $mathml("mpadded").append(c[0])
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "msup",
                [ $mathml("mpadded").append(a), $mathml("mpadded").append(b) ],
                {
                    oper: "^",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mroot",
                [ $mathml("mpadded").append(a), $mathml("mpadded").append(b) ],
                {
                    oper: "(root)",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("∘"), b ],
                {
                    oper: "∘",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "msup",
                [ $mathml("mpadded").append(a), $mathml("mpadded").append(b) ],
                {
                    oper: "(function power)",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append(";"), "<br/>", b ],
                {
                    oper: ";",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "ab",
        1: "c" 
    },
    1: (vars) => {
        let ab = format(vars["ab"]),
            c = format(vars["c"]),
            self = createBlock(
                "msup",
                [ $mathml("mpadded").append(ab), $mathml("mpadded").append("(", c) ],
                {
                    oper: "(supistaminen)",
                    0: "#" + ab.getAttribute("id"),
                    1: "#" + c.getAttribute("id")
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
        0: "ab",
        1: "c" 
    },
    1: (vars) => {
        let ab = format(vars["ab"]),
            c = format(vars["c"]),
            self = createBlock(
                "mmultiscripts",
                // Huom. pitäisi olla oikein, muttei toimi Firefoxissa
                [ $mathml("mpadded").append(ab), "<mprescripts/>", "<none/>", $mathml("mpadded").append(c, ")") ],
                {
                    oper: "(laventaminen)",
                    0: "#" + ab.getAttribute("id"),
                    1: "#" + c.getAttribute("id")
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
        expr: "expr",
        start: "start",
        end: "end",
        concat: "concat",
        vble: "vble" 
    },

    1: (vars) => {
        const expr   = format(vars.expr),
              start  = format(vars.start),
              end    = format(vars.end),
              concat = format(vars.concat),
              vble   = format(vars.vble);

        return createBlock([
            "div",                
            format(bind(
                {
                    symbol: vble,
                    val: start 
                },
                vars.expr
            )),
            " ",
            concat,
            " ",
            format(bind(
                {
                    symbol: vble,
                    val: start + 1 
                },
                vars.expr
            )),
            concat,                
            " ... ",
            concat,
            " ",
            format(bind(
                {
                    symbol: vble,
                    val: end 
                },
                vars.expr
            ))
        ], {
            oper: "...",
            expr: expr,
            start: start,
            end: end,
            concat: concat,
            vble: vble
        });
    }
});

/**
 * Sum operator. TODO needs to be updated.
 **/
formatters.addEquation({
    oper: "->",
    0: {
        oper: "(sum)",
        expr: "expr",
        start: "start",
        end: "end",
        vble: "vble" 
    },

    1: (vars) => {
        const expr  = format(vars.expr),
              start = format(vars.start),
              end   = format(vars.end),
              vble  = format(vars.vble);

        
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("="), b ],
                {
                    oper: "=",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("≥"), b ],
                {
                    oper: "≥",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        //console.log('vars a:', vars['a'], 'expr:');
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("&rarr;"), b ],
                {
                    oper: "&rarr;",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b"
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("+"), b, "i" ],
                {
                    item: "(complex)",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a",
        1: "b" 
    },
    1: (vars) => {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("∠"), b ],
                {
                    oper: "∠",
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
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
        0: "a"
    },
    1: function degreeFormatter(vars) {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ a, $mathml("mo").append("°") ],
                {
                    oper: "°",
                    0: "#" + a.getAttribute("id"),
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
        0: "a"
    },
    1: function degreeFormatter(vars) {
        let a = format(vars["a"]),
            self = createBlock(
                "mpadded",                    
                [ a, " ", $mathml("mo").append("rad") ],
                {
                    oper: "(rad)",
                    0: "#" + a.getAttribute("id"),
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
        oper: "f",
        0: "a"
    },
    1: function generalFunctionFormatter1(vars) {
        let a = format(vars["a"]),
            f = format(vars["f"]),
            self = createBlock(
                "mpadded",
                [ $mathml("mi").append(f), "&nbsp;", a ],
                {
                    oper: "#" + f.getAttribute("id"),
                    0: "#" + a.getAttribute("id")
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
        oper: "f",
        0: "a",
        1: "b"        
    },
    1: function generalFunctionFormatter2(vars) {
        let a = format(vars["a"]),
            b = format(vars["b"]),
            f = format(vars["f"]),
            self = createBlock(
                "mpadded",
                [ $mathml("mi").append(f), "&nbsp;", a, ", ", b ],
                {
                    oper: "#" + f.getAttribute("id"),
                    0: "#" + a.getAttribute("id"),
                    1: "#" + b.getAttribute("id")
                }
            );
        
        
        return self;
    }
});




console.log("formatters loaded");
