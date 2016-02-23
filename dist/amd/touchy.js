define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.touchy = touchy;
  var touch = {
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove'
  };
  var pointers = {
    mouseup: 'pointerup',
    mousedown: 'pointerdown',
    mousemove: 'pointermove'
  };
  var microsoft = {
    mouseup: 'MSPointerUp',
    mousedown: 'MSPointerDown',
    mousemove: 'MSPointerMove'
  };

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
});