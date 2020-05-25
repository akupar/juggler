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

    $number1.on("keypress", function ($e) {
        $e.stopImmediatePropagation();

        if ( $(this).data("timeoutHandle") ) {
            clearTimeout($(this).data("timeoutHandle"));
        }
        $number1.data("timeoutHandle", setTimeout(() => { $(this).change(); }, 250));
    });
    
    $number2.on("change", function () {
        $number1.val(number1Control($result.val(), $(this).val()));
    });

    $number2.on("keypress", function ($e) {
        $e.stopImmediatePropagation();

        if ( $(this).data("timeoutHandle") ) {
            clearTimeout($(this).data("timeoutHandle"));
        }
        $number1.data("timeoutHandle", setTimeout(() => { $(this).change(); }, 250));
    });

    const $form = $dialog.find("form");

    const deferred = $.Deferred();    
    $form.on("submit", function (e) {
        console.log("submit");
        e.preventDefault();

        vars["a"] = $number1.val();
        vars["b"] = $number2.val();
        $dialog.dialog( "close" );

        deferred.resolve(true);
    });
    
    $number1.on("keypress", function(event) { 
        if (event.keyCode === $.ui.keyCode.ENTER) { 
            $form.submit();
            return false;
        }
    });
    $number2.on("keypress", function(event) { 
        if (event.keyCode === $.ui.keyCode.ENTER) { 
            $form.submit();
            return false;
        }
    });
    $dialog.dialog({
        modal: true,
        buttons: {
            OK: function() {
                console.log("OK");                
                if ( $number1.is(":valid") && $number2.is(":valid") ) {
                    console.log("gonna submit");
                    $form.submit();        
                }
            },
            Cancel: function() {
                console.log("Cancel");                
                $dialog.dialog( "close" );
                deferred.resolve(false);
            }
        },
        close: function() {
            console.log("close");
            $number1.removeClass( "ui-state-error" );
            $number2.removeClass( "ui-state-error" );
            deferred.resolve(false);            
        }
    });

    $dialog.find("button:contains('OK')").prop("disabled", true);

    return deferred.promise();
}

export default {
    createDialog
};
