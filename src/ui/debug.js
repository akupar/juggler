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
    console.log("BUCKE DONE");
}



export function showExpression(expr) {
    $("#status-expression").html(
        JSON.stringify(expr, null, 2)
    );
}


$(document).ready(function() {
    $(".debug").each(function () {
        const $parent = $(this);
        const $cb = $("<input type=\"checkbox\"/>").prop("checked", true).on("change", function () {
            $parent.css("display", $(this).is(":checked") ? "block" : "none");
        });
        $(this).before($cb);
    });
});


export default {
    showExpression,
    showBucketData
};
