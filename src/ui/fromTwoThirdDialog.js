import $ from "jquery";
import "jquery-ui";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/dialog.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/ui/widgets/dialog";

import "./dialog.css";



function createDialog(oper, vars, varA, varB, varC, number1Control, number2Control) {
    const $dialog  = $("#dialog-from-two-third");
    const $result  = $dialog.find("[name=\"result\"]");
    const $number1 = $dialog.find("[name=\"number1\"]");
    const $number2 = $dialog.find("[name=\"number2\"]");
    
    $dialog.find("[for=\"number1\"]").text(varA + ":");
    $dialog.find("[for=\"number2\"]").text(varB + ":");
    $dialog.find("[for=\"result\"]").text(varC + ":");
    $dialog.find(".combine-operator").html(oper);

    $number1.val("");
    $number2.val("");
    $result.val(vars[varC]);
    
    $number1.on("change", function () {
        $number2.val(number2Control($result.val(), $(this).val()));
        if ( $number1.is(":valid") ) {
            $dialog.find("button:contains('OK')").prop("disabled", false);
        }
    });

    $number1.on("keypress", function () {
        if ( $(this).data("timeoutHandle") ) {
            clearTimeout($(this).data("timeoutHandle"));
        }
        $number1.data("timeoutHandle", setTimeout(() => { $(this).change(); }, 250));
    });
    
    $number2.on("change", function () {
        $number1.val(number1Control($result.val(), $(this).val()));
    });

    $number2.on("keypress", function () {
        if ( $(this).data("timeoutHandle") ) {
            clearTimeout($(this).data("timeoutHandle"));
        }
        $number1.data("timeoutHandle", setTimeout(() => { $(this).change(); }, 250));
    });
    
    
    const deferred = $.Deferred();
    $dialog.dialog({
        //autoOpen: false,
        modal: true,
        //position: { my: 'center', at: 'center', of: $("#canvas")},
        buttons: {
            OK: function() {
                if ( $number1.is(":valid") && $number2.is(":valid") ) {
                    deferred.resolve(true);
                    vars["a"] = $number1.val();
                    vars["b"] = $number2.val();

                    $dialog.dialog( "close" );
                }
            },
            Cancel: function() {
                deferred.resolve(false);
                $dialog.dialog( "close" );
            }
        },
        close: function() {
            $number1.removeClass( "ui-state-error" );
            $number2.removeClass( "ui-state-error" );
        }
    });

    $dialog.find("button:contains('OK')").prop("disabled", true);

    return deferred.promise();
}

export default {
    createDialog
};
