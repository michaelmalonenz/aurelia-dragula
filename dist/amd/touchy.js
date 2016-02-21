define(['exports', 'crossvent'], function (exports, _crossvent) {
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
      _crossvent[op](el, pointers[type], fn);
    } else if (window.navigator.msPointerEnabled) {
      _crossvent[op](el, microsoft[type], fn);
    } else {
      _crossvent[op](el, touch[type], fn);
      _crossvent[op](el, type, fn);
    }
  }
});