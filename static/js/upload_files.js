/**
 * Created by dimones-dev on 02.07.17.
 */
$(document).ready(function() {
    jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
    };
    $.fn.stud_upload = function (options) {
        $.getScript()
    };
});
