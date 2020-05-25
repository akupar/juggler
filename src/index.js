import $ from "jquery";
import "./style.css";
import { auto } from "./types";
import userSymbols from "./ui/userSymbols";
import undoManager from "./ui/undoManager";
import canvas from "./ui/canvas";
import debug from "./ui/debug";
import inputExpressionDialog from "./ui/inputExpressionDialog";
import shuntingyard from "./shuntingyard";

window.shuntingyard = shuntingyard;

import {
    getParentBlock,
    getNextBlock,
    getPreviousBlock,
    selectBlock
} from "./ui/block";

function getSelectedBlock() {
    const selecteds = document.getElementsByClassName("selected");
    if ( selecteds.length === 0 ) {
        return null;
    }

    console.assert(selecteds.length === 1, "More than one selected!");
    
    return selecteds[0];
}

function selectParentBlock() {
    const selected = getSelectedBlock();
    if ( !selected ) {
        return;
    }
    
    const parent = getParentBlock.bind(selected)();
    if ( !parent ) {
        return;
    }

    selectBlock.bind(parent)();
}

function selectNextBlock() {
    const selected = getSelectedBlock();
    if ( !selected ) {
        return;
    }

    const next = getNextBlock.bind(selected)();
    if ( !next ) {
        return;
    }

    selectBlock.bind(next)();
}

function selectPreviousBlock() {
    const selected = getSelectedBlock();
    if ( !selected ) {
        return;
    }

    const previous = getPreviousBlock.bind(selected)();
    if ( !previous ) {
        return;
    }

    selectBlock.bind(previous)();
}

$(document).on("keypress", function ($event) {
    //console.log("KEYPRESS!", $event);
    switch ( $event.originalEvent.key ) {
        case "u":
        case "^":
            console.log("U");
            selectParentBlock();
            break;
        case "n":
            selectNextBlock();
            break;
        case "p":
            selectPreviousBlock();
            break;
        case "z":
            undoManager.undo();
            break;
        case "Z":
            undoManager.redo();
            break;
    }
});


$(document).ready(function () {
    $(".new-button").on("click", async function () {

        const input = await inputExpressionDialog.createDialog();
        console.log("INPUT:", input);
        canvas.setEquation(input);

    });


    debug.showBucketData(window.equations.buckets);
    userSymbols.showUserSymbols();

    var input = {
        oper: "+",
        0: auto(7),
        1: {
            oper: "-",
            0: auto(3),
            1: {
                item: "(sym)",
                0: "?π",
                _approx: 3.14
            }
        }
    };

    debug.showExpression(null, input);

    canvas.setEquation(input);
    console.log("main done");
});

