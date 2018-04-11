//jshint browser: true, esversion:6
$(() => {
    $('tr').on('click', (e) => {
        $('tr').removeClass('yellow');
        $(e.target).parent().addClass('yellow');
    });
    
    $(document).on('click', (e) => {
        if (!$('td').is(e.target)) {
            $('tr').removeClass('yellow');
        }
    });
// replace innerHTML of td with input
    $('td').dblclick((e) => {
        let cell = $(e.target);
        cell.('<input type=text value=\"'+ cell.text() +'\"/>');
        $(document).keydown((e) => {
            if(13 == e.which ) {
            }
        });
    });
});
