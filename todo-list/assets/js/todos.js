// Check Off Specific Todos By Clicking
$('ul')
    .on('click', 'li', function() {
        $(this).toggleClass('completed');
    })
    .on('click', 'span', function(e) {
       $(this).parent().fadeOut(500, function(){
           $(this).remove();
       });
        e.stopPropagation();
    });
$('input[type="text"]').keypress(function(e) {
    if (e.which != 13) return;
    var todoText = $(this).val();
    $('ul').append('<li><span><i class="fa fa-trash" aria-hidden="true"></i></span> ' + todoText + '</li>');
    $(this).val('');
});
$('.fa-plus').click(function() {
   $('input[type="text"]').fadeToggle();
});