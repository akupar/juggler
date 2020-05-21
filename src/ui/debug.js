import $ from "jquery";
import "./debug.css";

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



export function showExpression(elem, expr) {
    let bucket = "";
    
    let elemNo = "";

    let elemData;
    if ( elem ) {
        elemNo = "#" + elem.id;
        elemData = $(elem).attr("expr");
    }




    let text = "";
    if ( elemData ) {
        text = JSON.stringify(JSON.parse(elemData), null, 2);
    }
    
    let expandedData = "";
    if ( expr ) {
        expandedData = JSON.stringify(expr, null, 2);
        bucket = window.equations.getAddr(expr);
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
