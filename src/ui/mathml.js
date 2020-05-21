import $ from "jquery";

/**
 * Creates a MathML element.
 **/
export function mathml(el) {
    return document.createElementNS("http://www.w3.org/1998/Math/MathML", el);
}

/**
 * Creates a MathML element and wraps it in jQuery object.
 **/
export function $mathml(el) {
    return $(mathml(el));
}

