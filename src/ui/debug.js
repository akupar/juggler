import $ from "jquery";
import "./debug.css";
import { expressionToString } from "./debug-keySort";
import { deformat } from "../formatter";

export function showBucketData(buckets) {
    console.assert(buckets !== undefined, "Undefined");

    $("#status-buckets").append(
        Object.keys(buckets).map((bucketName) => {
            return $("<li></li>")
                .append([bucketName, ": ", buckets[bucketName].length])
                .css("cursor", "pointer")
                .attr("title", "Print bucket contents to console")
                .attr("data-name", bucketName)
                .on("click", function () {
                    console.log("BUCKET '" + bucketName + "':", JSON.stringify(buckets[bucketName], null, 2));
                });
        })
    );
}


export function showExpression(elem) {
    const expr = deformat(elem);
    let bucket = "";
    
    let elemNo = "";

    let expression;
    if ( elem ) {
        elemNo = "#" + elem.id;
        const data = $(elem).attr("expr");
        expression = JSON.parse(data);
    }


    let text = "";
    if ( expression ) {
        text = expressionToString(expression);
    }
    
    let expandedData = "";
    if ( expr ) {
        expandedData = expressionToString(expr);
        bucket = window.equations.getAddress(expr);
    }
    
    $("#status-expression").html(
        elemNo + "; " + bucket
        + "<hr/>"
        + text
        + "<hr/>"
        + expandedData
    );
}


$(document).ready(function() {
    $(".debug").each(function () {
        const $parent = $(this);
        const $cb = $("<input type='checkbox'/>").prop("checked", true).on("change", function () {
            $parent.css("display", $(this).is(":checked") ? "block" : "none");
        });
        $(this).before($cb);
    });
});


export default {
    showExpression,
    showBucketData
};
