'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var cache, start, end;


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

  _export('add', add);

  function rm(el, className) {
    if (el.classList) {
      el.classList.remove(className);
      return;
    }
    el.className = el.className.replace(lookupClass(className), ' ').trim();
  }

  _export('rm', rm);

  return {
    setters: [],
    execute: function () {
      cache = {};
      start = '(?:^|\\s)';
      end = '(?:\\s|$)';
    }
  };
});