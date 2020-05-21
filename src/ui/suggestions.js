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

function add({ equation, score, description }) {
    equation.oper = "&rarr;";
    const elem = format(equation);
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
