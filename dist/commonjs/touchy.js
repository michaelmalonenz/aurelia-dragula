'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.touchy = touchy;

var _crossvent = require('crossvent');

var crossvent = _interopRequireWildcard(_crossvent);

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
    crossvent[op](el, pointers[type], fn);
  } else if (window.navigator.msPointerEnabled) {
    crossvent[op](el, microsoft[type], fn);
  } else {
    crossvent[op](el, touch[type], fn);
    crossvent[op](el, type, fn);
  }
}