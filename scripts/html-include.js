$(function () {
    var includes = $('[data-include]');
    $.each(includes, function () {
        var file = $(this).data('include');

        $.ajax({
            url: file + '.html',
            async: false,  // Blocks until loaded
            success: function (data) {
                $(this).replaceWith(data);  // Insert HTML
            }.bind(this)
        });

        $('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: file + '.css'
        }).appendTo('head');
    });
});