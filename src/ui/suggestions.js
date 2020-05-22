import $ from "jquery";
import { $mathml } from "./mathml";
import { format } from "../formatter";

let $table = $();

$(document).ready(function () {
    $table = $("#transformSuggestions > math > mtable");

});

function clear() {
    $table.html("");
}

/**
 * Removes optional fields from the displayed equation. (Full version is kept in data(equation).
 **/
function removeOptional(expr) {
    const copy = { ...expr };

    for ( let item in copy ) {
        if ( item.startsWith("?") ) {
            console.log("DELETE:", item);
            delete copy[item];
        } else if ( typeof(copy[item]) === "object" ) {
            copy[item] = removeOptional(copy[item]);
        }
    }

    return copy;
}

function add({ equation, score, description }) {
    equation.oper = "&rarr;";
    const elem = format(removeOptional(equation));
    $(elem).addClass("suggestion");
    $(elem).data("equation", equation);
    $(elem).attr("score", score);
    $(elem).attr("title", description);
    $table.append($mathml("mtr").append($mathml("mtd").append(elem)));

    return elem;
}



export default {
    add,
    clear
};
