import $ from "jquery";
import "jquery-ui";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/dialog.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/ui/widgets/dialog";

import "./dialog.css";



export function createDialog(oper, vars, varA, inputSymbol) {
    const $number = $("#dialog-one-number").find("[name=\"number\"]");
    $("#dialog").find("[for=\"number\"]").text(varA + ":");
    if ( inputSymbol ) {
        $number.attr("type", "text");
    }

    $number.val("");

    $number.on("change", function () {
        console.log("changed");
    });

    $number.on("keypress", function () {
        if ( $(this).data("timeoutHandle") ) {
            clearTimeout($(this).data("timeoutHandle"));
        }
        $number.data("timeoutHandle", setTimeout(() => { $(this).change(); }, 250));
    });
    
    
    const deferred = $.Deferred();
    const $dialog = $( "#dialog-one-number" ).dialog({
        modal: true,
        buttons: {
            OK: function() {
                if ( $number ) {
                    deferred.resolve(true);
                    vars["a"] = $number.val();
                    $dialog.dialog( "close" );
                }
            },
            Cancel: function() {
                deferred.resolve(false);
                $dialog.dialog( "close" );
            }
        },
        close: function() {
            $number.removeClass( "ui-state-error" );
        }
    });
    return deferred.promise();
}

export default {
    createDialog
};
