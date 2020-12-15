const maximo = 8;
for (let i = 0; i <= maximo; i++) {
    $('a.grafico-' + i).click(function(event) {
        event.preventDefault();
        $("html, body").animate({scrollTop: $('#title-' + i).offset().top + 10}, 500);
    });
}
$(window).on('scroll', function () {
    for (let i = maximo; i >= 0; i--) {
        if($(window).scrollTop() > $('#title-' + i).offset().top) {
            for (let j = 0; j <= maximo; j++) {
                $('.grafico-' + j).removeClass('active');
            }
            $('.grafico-' + i).addClass('active');
            break;
        }
    }
});