import $ from "jquery";
import "./style.css";
import { auto } from "./types";
import userSymbols from "./ui/userSymbols";
import undoManager from "./ui/undoManager";
import canvas from "./ui/canvas";
import debug from "./ui/debug";

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
    debug.showBucketData(window.equations.buckets);
    debug.showExpression(input);
    userSymbols.showUserSymbols();

    var input = {
        oper: "/",
        0: auto(3),
        1: auto(4)
    };

    canvas.setEquation(input);
});

