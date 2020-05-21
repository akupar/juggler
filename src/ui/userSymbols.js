import $ from "jquery";

import symbolStore from "../equations/userSymbols";
import { format } from "../formatter";
import { $mathml } from "./mathml";

function showUserSymbols() {
    const $table = $("#user-symbols").find("mtable");


    console.log(JSON.stringify(symbolStore.buckets, null, 2));
    $table.html("");
    $table.append(
        symbolStore.buckets["(sym)"] ? symbolStore.buckets["(sym)"].map((symbolEquation) => {
            return $mathml("mtr").append([
                $mathml("mtd")
                    .append(format(symbolEquation[0])),
                $mathml("mtd")
                    .append("="),
                $mathml("mtd")
                    .append(format(symbolEquation[1]))
            ]);
        }) : ""
    );
    $table.append(
        symbolStore.buckets["(func)"] ? symbolStore.buckets["(func)"].map((symbolEquation) => {
            return $mathml("mtr").append([
                $mathml("mtd")
                    .append(format(symbolEquation[0])),
                $mathml("mtd")
                    .append("="),
                $mathml("mtd")
                    .append(format(symbolEquation[1]))
            ]);
        }) : ""
    );
}

export default {
    showUserSymbols
};
import "./userSymbols.css";
