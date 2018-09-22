$(document).ready(function () {

    $("#message-form").submit(function (event) {

        event.preventDefault();

        fire_ajax_submit();

    });

});
function scrollToBottom () {
    var messages = $('#messages');
    var newMessage = messages.children("li:last-child");
    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

function fire_ajax_submit() {
    var commenttext    = $('#text_input');
    var urll = "/watson/text-input"
    var jsonDate = (new Date()).toJSON();
    var backToDate = new Date(jsonDate);
    $.ajax({
        url: urll,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tone:commenttext.val()}),
        success: function(response) {
            commenttext.val('');
            var current_time = new moment().format("h:mm a");
            var formattedTime = current_time;
            var template = $("#message-template").html();
            var tones = "";
            $.each(response.toneAnalysis.document_tone.tones, function( key, value ) {
              tones+=(value.tone_name+", ");
            });
            tones=tones.substring(0, tones.length - 2);
            console.log(response.toneAnalysis.document_tone.tones)
            var html = Mustache.render(template, {
                text: tones,
                from: response.text,
                createAt: formattedTime
            });
            $("#messages").append(html)
            scrollToBottom();
        },
        error: function (e) {
            console.log("ERROR : ", e);

        }
    });
}
