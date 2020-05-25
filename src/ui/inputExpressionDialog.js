import $ from "jquery";
import "jquery-ui";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/dialog.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/ui/widgets/dialog";

import "./dialog.css";
import shuntingyard from "../shuntingyard";
import { format } from "../formatter";


export function createDialog() {
    const $expression = $("#dialog-input-expression").find("[name=\"expression\"]");
    const $output = $("#dialog-input-expression").find("math");

    $expression.select();
    
    $expression.on("change", function () {
        const input = $(this).val();
        let output = null;

        if ( input ) {
            try {
                output = shuntingyard.toParsetree(shuntingyard.infixToRPN(input));
                const elem = format(output);
                $output.html(elem);
                this.setCustomValidity("");
            } catch ( e ) {
                this.setCustomValidity("Syntax error");
            }
        }
    });
    
    $expression.on("keypress", function ($e) {
        $e.stopImmediatePropagation();

        if ( $(this).data("timeoutHandle") ) {
            clearTimeout($(this).data("timeoutHandle"));
        }
        $expression.data("timeoutHandle", setTimeout(() => { $(this).change(); }, 250));
    });

    const $form = $("#dialog-input-expression").find("form");

    const deferred = $.Deferred();    
    $form.on("submit", function (e) {
        e.preventDefault();

        const input = $expression.val();

        if ( input ) {
            const output = shuntingyard.toParsetree(shuntingyard.infixToRPN(input));
            deferred.resolve(output);            
        } else {
            deferred.resolve(null);
        }
        
        $dialog.dialog( "close" );
    });
    
    
    const $dialog = $( "#dialog-input-expression" ).dialog({
        modal: true,
        buttons: {
            OK: function() {
                if ( $expression.val() !== "" ) {
                    $form.submit();
                }
            },
            Cancel: function() {
                $dialog.dialog( "close" );
            }
        },
        close: function() {
            $expression.removeClass( "ui-state-error" );
            //deferred.resolve(null);            
        }
    });
    
    return deferred.promise();
}

export default {
    createDialog
};
