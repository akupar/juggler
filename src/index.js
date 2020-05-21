import $ from "jquery";
import "./style.css";
import { auto } from "./types";
//import userSymbols from "./ui/userSymbols";
//import symbolStore from "./equations/userSymbols";
import "./ui/undoManager";
import canvas from "./ui/canvas";
//import debug from "./ui/debug";

//import {
//    getParentBlock,
//    getNextBlock,
//    getPreviousBlock,
//    selectBlock
//} from "./ui/block";



$(document).ready(function () {
    //debug.showBucketData(window.equations.buckets);
    //debug.showExpression(input);

    console.log("XX");


    var input = {
        oper: "/",
        0: auto(3),
        1: auto(4)
    };
    console.log("XX");
    canvas.setEquation(input);
    console.log("XX2");

    
});

