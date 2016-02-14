System.register([], function (_export) {
  'use strict';

  var cache, start, end;

  _export('add', add);

  _export('rm', rm);

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
    var current = el.className;
    if (!current.length) {
      el.className = className;
    } else if (!lookupClass(className).test(current)) {
      el.className += ' ' + className;
    }
  }

  function rm(el, className) {
    el.className = el.className.replace(lookupClass(className), ' ').trim();
  }

  return {
    setters: [],
    execute: function () {
      cache = {};
      start = '(?:^|\\s)';
      end = '(?:\\s|$)';
    }
  };
});