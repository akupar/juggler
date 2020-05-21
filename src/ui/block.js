import $ from "jquery";

import { $mathml } from "../ui/mathml";

import { deformat } from "../formatter";

import { getVariables, replaceValue } from "../util";
import generalStore from "../equations/index";
import symbolStore from "../equations/userSymbols";
import symbolTable from "./userSymbols";
import { handlePickTransform } from "./suggestion";
import suggestions from "./suggestions";

import oneNumberDialog from "./oneNumberDialog";

import debug from "./debug";

import "./block.css";

let idCounter = 0;
function createId() {
    return idCounter++;
}

export function getEq(el) {
    return JSON.parse($(el).attr("expr"));
}

export function setEq(el, expr) {
    $(el).attr("expr", JSON.stringify(expr));
}

export function replaceReferences(elem, oldRef, newRef) {
    console.log("replaceReferences:", oldRef, newRef, JSON.stringify(getEq(elem)));
    const oldRefId = "#" + oldRef.getAttribute("id"),
          newRefId = "#" + newRef.getAttribute("id");

    if ( getEq(elem) === oldRefId ) {
        setEq(elem, newRefId);
    } else {
        setEq(elem, replaceValue(getEq(elem), oldRefId, newRefId));
    }
}

export function getParentBlock() {
    var $parent = $(this).parents(".block:first");
    if ( $parent.length === 0 ) {
        return null;
    }

    return $parent.get(0);
}

export function getNextSiblingBlock() {
    let current = this;
    do {
        current = current.nextElementSibling;
        if ( current && current.classList.contains("block") ) {
            return current;
        }

    } while ( current !== null );

    return null;
}

export function getPreviousSiblingBlock() {
    let current = this;
    do {
        current = current.previousElementSibling;
        if ( current && current.classList.contains("block") ) {
            return current;
        }

    } while ( current !== null );

    return null;
}

function getNextGrandSibling(current) {
    while ( current ) {
        if ( current.id === "canvas" ) {
            return null;
        }
        if ( current.nextElementSibling ) {
            return current.nextElementSibling;
        }
        
        current = current.parentElement;
    }
    
    return null;
}

export function getNextBlock() {
    let current = this;
    
    for ( ;; ) {
        current = current.firstElementChild
               || current.nextElementSibling
               || getNextGrandSibling(current);

        if ( !current ) {
            return null;
        }
        
        if ( current.classList.contains("block") ) {
            return current;
        }
    }
}

function getPreviousGrandSibling(current) {
    while ( current ) {
        if ( current.id === "canvas" ) {
            return null;
        }
        if ( current.previousElementSibling ) {
            return current.previousElementSibling;
        }
        
        current = current.parentElement;
    }
    
    return null;
}

export function getPreviousBlock() {
    let current = this;
    
    for ( ;; ) {
        current = current.lastElementChild
               || current.previousElementSibling
               || getPreviousGrandSibling(current);

        if ( !current ) {
            return null;
        }
        
        if ( current.classList.contains("block") ) {
            return current;
        }
    }
}

export function selectBlock() {
    const selecteds = document.getElementsByClassName("selected");
    if ( selecteds.length > 0 ) {
        console.assert(selecteds.length === 1, "Strange! More than one selected");
        const selected = selecteds[0];
        selected.classList.remove("selected");
    }
    this.classList.add("selected");
    showSuggestions.bind(this)();
}


async function handleCreateSymbol() {
    const $elem = $(this);
    const $suggestionElem = $elem.parents(".suggestion").addBack(".suggestion");
    
    // Haetaan valittuun lausekkeeseen mätsäävä lauseke suggestion boksista, johon se tallennettiin
    // jossain muualla.
    const alteredEquation = $suggestionElem.data("equation");
    if ( !alteredEquation ) {
        throw new Error("Ehdotukseen ei ole liitetty yhtälöä!");
    }

    console.log("MUUNNOS YHTÄLÖ:", JSON.stringify(alteredEquation[0], null, 2));
    // Kaikki muuttujat on sitomattomia, koska toisella puolella on vain symboli.
    const unboundVars = getVariables(alteredEquation[0]);

    if ( unboundVars.length === 0 ) {
        console.log("Luodaan vakio");
    } else {
        console.log("Luodaan funktio");
    }

    console.log("UNBOUDN:", unboundVars);

    const vars = {};
    if ( ! await oneNumberDialog.createDialog("Input symbol", vars, "a", true) ) {
        return;
    }

    if ( unboundVars.length === 0 ) {    
        alteredEquation[1] = {
            item: "(sym)",
            0: "?" + vars["a"]
        };
    } else {
        alteredEquation[1] = {
            item: "(func)",
            oper: "?" + vars["a"],
            ...unboundVars
        };
    }

    // Tallennetaan uusi yhtälö takisin ehotukseen ja ”painetaan” sitä.
    $suggestionElem.data("equation", alteredEquation);
    handlePickTransform.bind($suggestionElem.get(0))();

    
    symbolStore.addEquation({
        oper: "=",
        0: alteredEquation[1],
        1: alteredEquation[0]
    },
                            "Expand symbol",
                            "Replace with symbol"
    );

    symbolTable.showUserSymbols();
}

/**
 * Funktio ohjaa klikkauksen sen mukaan ollaanko päänäkymässä vai ehdotuslistassa.
 **/
export async function handleClick(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var $elem = $(this);
    if ( !$elem.hasClass("block") ) {
        
        $elem = $elem.parents(".block:first");
    }

    console.assert($elem.hasClass("block"), "Ei blokki");
    
    if ( $elem.parents("#canvas").length > 0 ) {
        selectBlock.bind(this)();
        showSuggestions.bind($elem.get(0))();
    } else if ( $elem.parents(".to-symbol").addBack(".to-symbol").length > 0 ) {
        await handleCreateSymbol.bind(this)();
    } else if ( $elem.parents(".suggestion").addBack(".suggestion").length > 0 ) {
        handlePickTransform.bind($elem.parents(".suggestion").addBack(".suggestion").get(0))();
    } else {
        console.log("UNKOWN CLICK ");
    }
    
    return false;
}

export function createBlock(elemName, content, expr) {
    var $elem;
    
    if ( elemName === "div" ) {
        $elem = $("<div></div>");
    } else if ( elemName === "mpadded" ) {
        $elem = $mathml(elemName);
        $elem.attr("height", "+4px");
        $elem.attr("width", "+10px");
        $elem.attr("lspace", "+5px");
        $elem.attr("voffset", "+2px");                
    } else {
        $elem = $mathml(elemName);
    }

    $elem.addClass("block")
         .append(content)
         .attr("id", createId())
         .on("click", handleClick);

    setEq($elem.get(0), expr);

    return $elem.get(0);
}

export function showSuggestions() {
    var expr = deformat(this);
    debug.showExpression(expr);
    
    suggestions.clear();

    let found = false;
    symbolStore.allMatches(expr).forEach(function ({ equation, vars, score, description }) {
        suggestions.add({ equation, vars, score, description });
        found = true;
    });

    // Lisätään symbolin luonti vain jos mätsäävää olemassa olevaa symbolia ei löytynyt.
    if ( !found ) {
        const elem = suggestions.add({ equation: { oper: "->", 0: expr, 1: "symbol" }, description: "Replace with symbol" });
        $(elem).addClass("to-symbol");
    }

    generalStore.allMatches(expr).forEach(function ({ equation, vars, score, description }) {
        suggestions.add({ equation, vars, score, description });
    });
}

