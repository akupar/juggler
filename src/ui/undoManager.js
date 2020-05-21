import $ from "jquery";

import UndoBuffer from "../undoBuffer";
import canvas from "./canvas";


function undo() {
    console.log("UNDO");
    const state = window.undoBuffer.undo(1);
    if ( !state ) {
        console.log("noting to undo");
        return;
    }
    canvas.setEquation(state, true);
}

function redo() {
    console.log("REDO");
    const state = window.undoBuffer.redo(1);
    if ( !state ) {
        console.log("noting to redo");
        return;
    }
    canvas.setEquation(state, true);
}


$(document).ready(function () {
    window.undoBuffer = new UndoBuffer();
    console.log("created undo buffer");
    
    $(".undo-button").on("click", undo);

    $(".redo-button").on("click", redo);

});

export default {
    undo,
    redo
};
