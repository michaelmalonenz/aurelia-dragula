System.register([], function (_export) {
  'use strict';

  var touch, pointers, microsoft;

  _export('touchy', touchy);

  function touchy(el, op, type, fn) {
    if (window.navigator.pointerEnabled) {
      el[op](pointers[type], fn);
    } else if (window.navigator.msPointerEnabled) {
      el[op](microsoft[type], fn);
    } else {
      el[op](touch[type], fn);
      el[op](type, fn);
    }
  }

  return {
    setters: [],
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