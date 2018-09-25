$(document).ready(function () {

    $("#search-form").submit(function (event) {

        event.preventDefault();

        fire_ajax_submit();

    });

});

function fire_ajax_submit() {
    var searchtext = $('#search');
    var urll = "/twitter"
    var fname  = $("input[name='search']").val();
    $.ajax({
        url: urll,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({search:fname}),
        success: function(response) {

            searchtext.val('');
            console.log(response);
        },
        error: function (e) {
            console.log("ERROR : ", e);

        }
    });
}
