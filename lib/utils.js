'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var scrollToElement = exports.scrollToElement = function scrollToElement(elementRef) {
  var elementCheck = setInterval(function () {
    var element = elementRef.current;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (elementRef.current) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollTop,
        left: 0,
        behavior: 'smooth'
      });
      clearInterval(elementCheck);
    }
  }, 100);
};