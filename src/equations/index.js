/**
 * Main index of equations and equivalences. Loads them from submodules.
 *
 * The module a given equation goes to is determined by looking at the operator that
 * is highest in the following list. For example a + a = 2 * a goes to module `mult` because
 * mult.js is higher on the list than `plus`.
 * 
 **/

import "./series";
//import "./constants";        // π, e, ...
//import "./trigonometry";     // sin, cos, tan and friends TODO eri tiedostoihin
//import "./complex";          // complex numbers a + bi
//import "./abs";              // absolute value |x|
//import "./equivalences";     // TODO maybe move to other modules?
//import "./circle";           // ∘ operator
//import "./logarithm.js";     // logarithm operator
//import "./root.js";          // (root) operator
//import "./power.js";         // ^ or pow
//import "./mixedNumeral.js";  // displaying fraction as mixed numeral
//import "./div.js";           // operators / and :
//import "./mult.js";          // multiplication operator ×
//import "./minus.js";         // unary and binary minus (-)
//import "./plus.js";          // unary and binary plus (+)
//import "./summary.js";       // displaying approximate values
//import "./sum.js";           // sum operator
//import "./extra.js";         //
//import "./userSymbols.js";   // turn expression to user defined symbols

import store from "./store";
export default store;

// For debugging
window.equations = store;



console.log("equations loaded");
