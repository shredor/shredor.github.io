"use strict";

$(function () {

    function toggleMenu(e) {
        console.log(e.type);
        $(".main-nav__button").toggleClass('main-nav__button--hamburger');
        $(".main-nav__button").toggleClass('main-nav__button--cross');
        $('.main-nav__list').toggleClass('main-nav__list--open');
    }

    function hideMenu(e) {
        if (!$('.main-nav__list').is('.main-nav__list--open')) return;
        toggleMenu(e);
    }

    $(".main-nav__button").on('click', toggleMenu);
    $(window).resize(hideMenu);
    $(document).on('click', function (e) {
        if (!$(e.target).is('.header__main-nav') && !$(e.target).parents().is('.header__main-nav')) {
            hideMenu(e);
        }
    });

    $('.request__submit').on('click', function () {
        $('.request__form').find('input, button').attr('disabled', true);
        $('.request__form').addClass('request__form--submitted');
        $('.request__success').addClass('request__success--submitted');
    });
});