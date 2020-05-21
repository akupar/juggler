import $ from "jquery";
import "jquery-ui";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/dialog.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/ui/widgets/dialog";

import "./dialog.css";



export function createDialog(oper, vars, varA) {
    const $number1 = $("#dialog").find("[name=\"number1\"]");
    $("#dialog").find("[for=\"number1\"]").text(varA + ":");

    $number1.val("");
    
    $number1.on("keypress", function () {
        if ( $(this).data("timeoutHandle") ) {
            clearTimeout($(this).data("timeoutHandle"));
        }
        $number1.data("timeoutHandle", setTimeout(() => { $(this).change(); }, 250));
    });
    
    
    const deferred = $.Deferred();
    const $dialog = $( "#dialog" ).dialog({
        modal: true,
        buttons: {
            OK: function() {
                deferred.resolve(true);
                vars["a"] = $number1.val();
                $dialog.dialog( "close" );
            },
            Cancel: function() {
                deferred.resolve(false);
                $dialog.dialog( "close" );
            }
        },
        close: function() {
            $number1.removeClass( "ui-state-error" );
        }
    });
    return deferred.promise();
}



