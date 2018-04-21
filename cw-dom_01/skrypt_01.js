//jshint browser: true, esversion:6
$(() => {
    function addYellowClass(e) {
        $('tr').removeClass('yellow');
        $(e.target).parent().addClass('yellow');
    }
    $('tr').on('click', addYellowClass);
    $(document).keydown((e) => {
        if (38 === e.which) {
            $('.yellow').after(function() { 
               return this.previousElementSibling;
            });
        }

        if (40 === e.which) {
            $('.yellow').before(function () {
                return this.nextElementSibling;
            });
        }
    });
    $(document).on('click', (e) => {
        if (!$('td').is(e.target)) {
            $('tr').removeClass('yellow');
        }
    });

    $('td').dblclick((e) => {
        console.log($('tr').off('click'));
        let cell = $(e.target);
        cell.wrapInner('<input type=text value=\"'+ cell.text() +'\"/>');
        $(document).keydown((e) => {
            if(13 === e.which ) {
                cell.text($('input').val());
                $('input').remove();
                $('tr').bind('click',addYellowClass);
            }
        });
    });
});
