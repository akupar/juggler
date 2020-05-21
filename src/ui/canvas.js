import $ from "jquery";

import { deformat, format } from "../formatter";
import {
    replaceReferences,
    selectBlock
} from "./block";


/* function setVariable(vars) {
 *     const root = document.getElementById("canvas").firstChild;
 *     const expr_in = deformat(root);
 *     const expr_out = apply(expr_in, vars);
 *     setEquation(expr_out);
 * }
 *  */

/**
 * Palauttaa isä-ketjussa, solmu itse mukaanlukien, ensimmäisen solmun, jolla on luokka block.
 */
function getNearestBlock(elem) {
    if ( !elem || elem === document.body ) {
        return null;
    }
    
    if ( elem.classList.contains("block") ) {
        return elem;
    }
    return getNearestBlock(elem.parentNode);
}


function setElement(elem) {
    $("#canvas").html(elem);
}

/**
 * Replace the whole equation with `equation`.
 **/
function setEquation(equation, skipUndo) {
    const elem = format(equation);

    if ( !skipUndo ) {
        window.undoBuffer.push(equation);
    }

    setElement(elem);
}

/**
 * Get the whole equation.
 **/
function getEquation() {
    return deformat(document.getElementById("canvas").firstElementChild);
}

function getSelectedElement() {
    const selecteds = document.getElementsByClassName("selected");
    if ( selecteds.length === 0 ) {
        return null;
    }

    // TODO onko nykyään turha
    const target = getNearestBlock(selecteds[0]);
    if ( ! target ) {
        return null;
    }

    return target;
}

/**
 * Get selected part of equation.
 **/
function getEquationOfSelected() {
    const element = getSelectedElement();
    if ( !element ) {
        return null;
    }
    
    return deformat(element);
}

/**
 * Replace selected part of equation with `equation`.
 **/
function replaceSelectionWithEquation(equation) {
    const equationElem = format(equation);
    console.assert(equationElem, "EI equation elementiä");

    const selected = getSelectedElement();
    if ( !selected ) {
        console.log("NO SELECTION");
        return;
    }
    
    const parent = getNearestBlock(selected.parentNode);
    if ( parent ) {
        replaceReferences(parent, selected, equationElem);
    }
    $(selected).replaceWith($(equationElem));

    window.undoBuffer.push(getEquation());

    
    selectBlock.bind(equationElem)();

}

export default {
    getEquation,
    setEquation,
    getEquationOfSelected,
    replaceSelectionWithEquation
};

console.log("canvas loaded");
