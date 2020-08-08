import $ from "jquery";
import { $mathml } from "./mathml";
import { format } from "../formatter";

const me = {};

me.onAdd = function (expr) {
    $("#expressionTree mtable").append(
        $mathml("mtr").append(
            $mathml("mtd").append(
                format(expr)
            )
        )
    );
};


$(document).ready(function() {
    window.expressionTree.addListener(me, "add");
});


export default me;
