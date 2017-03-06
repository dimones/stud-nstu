$('.btn-dd').click(function (event) {
    var btndd = $('.btn-dd.active');
    if (btndd[0] != $(this)[0]) {
        btndd.removeClass('active');
        var menu = btndd.parent().find('.dd-menu');
        menu.removeClass('is-open');
    }

    btndd = $(this);
    menu = btndd.parent().find('.dd-menu');
    if (menu.hasClass('is-open')) {
        btndd.removeClass('active');
        menu.removeClass('is-open');
    } else {
        btndd.addClass('active');
        menu.addClass('is-open');
    }

    event.stopPropagation();
});

$(document.body).click(function () {
    var btndd = $('.btn-dd.active');
    btndd.removeClass('active');
    var menu = btndd.parent().find('.dd-menu');
    menu.removeClass('is-open');
});

$('.fme2-modal-dialog').click(function (event) {
    event.stopPropagation();
});

$('.fme2-modal').click(function (event) {
    $(this).hide();
});