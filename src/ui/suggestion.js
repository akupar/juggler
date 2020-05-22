import $ from "jquery";

import {
    apply,
    getUnboundVariables,
    match,
    transform2
} from "../util";

import prompters from "../prompters/index";

import { defaultPrompt } from "./defaultPrompt";

import canvas from "./canvas";



export async function handlePickTransform() {
    const transformEquation = $(this).data("equation");
    
    const selectedExpression = canvas.getEquationOfSelected();
    if ( ! selectedExpression ) {
        throw new Error("Ei valittua");
    }
    //console.log("SELECTEDeXPRESSION:", selectedExpression);
    //console.log("TRANSFORMeQUATION:", transformEquation);
    const unbound = getUnboundVariables(transformEquation);
    //console.log("UNBOUND:", unbound);
    let vars = {};

    if ( unbound.length > 0 ) {
        const matched = match(transformEquation[0], selectedExpression, vars);
        console.assert(matched, "Ei mätsännytkään");
        const prompterEquation = prompters.bestMatch(transformEquation).equation;
        const prompt = prompterEquation ? prompterEquation[1] : defaultPrompt;
        
        if ( !await prompt(vars, unbound) ) {
            //console.log("prompt returned: false");
            return;
        }
        //console.log("VARS:", vars);
        apply(selectedExpression, vars);
        //console.log("APPLIED:", selectedExpression);
    }
    
    const result = transform2(transformEquation[0], transformEquation[1], selectedExpression, vars);
    if ( result === undefined ) { // Jos arvon syöttäminen peruttiin.
        return;
    }

    canvas.replaceSelectionWithEquation(result);
    
}

