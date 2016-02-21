'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.add = add;
exports.rm = rm;

var cache = {};
var start = '(?:^|\\s)';
var end = '(?:\\s|$)';

function lookupClass(className) {
  var cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cache[className] = cached = new RegExp(start + className + end, 'g');
  }
  return cached;
}

function add(el, className) {
  if (el.classList) {
    el.classList.add(className);
    return;
  }
  var current = el.className;
  if (!current.length) {
    el.className = className;
  } else if (!lookupClass(className).test(current)) {
    el.className += ' ' + className;
  }
}

function rm(el, className) {
  if (el.classList) {
    el.classList.remove(className);
    return;
  }
  el.className = el.className.replace(lookupClass(className), ' ').trim();
}