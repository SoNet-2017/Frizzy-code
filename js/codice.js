$(document).ready(function() {
  $('#toggled').hide();
  $('.MenuHeader').click(function(){
    $('#toggled').toggle( "slide", {direction: "left"}, 500 );
  });

  $(window).scroll(function(){
    if($(window).scrollTop() > 0){
      $('.round-profilo').css("z-index", "0");
    } else {
      $('.round-profilo').css("z-index", "1");
    }
  });
});
