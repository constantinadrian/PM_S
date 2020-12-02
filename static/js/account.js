$(document).ready(function () {

    // Toggle the img inside profile div
    $('.profile').hover(function(){
        $('#profile-img1').toggle();
        $('#profile-img2').toggle();
    });

    // Toggle the img inside password div
    $('.password-reset').hover(function(){
        $('#pass-img1').toggle();
        $('#pass-img2').toggle();
    });

});