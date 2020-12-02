$(document).ready(function(){

    // --------------Btn to scroll back to top -------------- // 

    // https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
    // When the user clicks on the button, scroll to the top of the document
    $('#myBtn').click(function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            $('#myBtn').css('display', 'block');
        } else {
            $('#myBtn').css('display', 'none');
        }
    };

});

