System.register(['crossvent'], function (_export) {
  'use strict';

  var crossvent, touch, pointers, microsoft;

  _export('touchy', touchy);

  function touchy(el, op, type, fn) {
    if (window.navigator.pointerEnabled) {
      crossvent[op](el, pointers[type], fn);
    } else if (window.navigator.msPointerEnabled) {
      crossvent[op](el, microsoft[type], fn);
    } else {
      crossvent[op](el, touch[type], fn);
      crossvent[op](el, type, fn);
    }
  }

  return {
    setters: [function (_crossvent) {
      crossvent = _crossvent;
    }],
    execute: function () {
      touch = {
        mouseup: 'touchend',
        mousedown: 'touchstart',
        mousemove: 'touchmove'
      };
      pointers = {
        mouseup: 'pointerup',
        mousedown: 'pointerdown',
        mousemove: 'pointermove'
      };
      microsoft = {
        mouseup: 'MSPointerUp',
        mousedown: 'MSPointerDown',
        mousemove: 'MSPointerMove'
      };
    }
  };
});