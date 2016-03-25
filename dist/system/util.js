'use strict';

System.register([], function (_export, _context) {
  var Util;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('Util', Util = function () {
        function Util() {
          _classCallCheck(this, Util);
        }

        Util.nextEl = function nextEl(el) {
          return el.nextElementSibling || manually();
          function manually() {
            var sibling = el;
            do {
              sibling = sibling.nextSibling;
            } while (sibling && sibling.nodeType !== 1);
            return sibling;
          }
        };

        Util.whichMouseButton = function whichMouseButton(e) {
          if (e.touches !== void 0) {
            return e.touches.length;
          }
          if (e.which !== void 0 && e.which !== 0) {
            return e.which;
          }
          if (e.buttons !== void 0) {
            return e.buttons;
          }
          var button = e.button;
          if (button !== void 0) {
            return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
          }
        };

        Util.getElementBehindPoint = function getElementBehindPoint(point, x, y) {
          var p = point || {};
          var state = p.className;
          var el = void 0;
          p.className += ' gu-hide';
          el = document.elementFromPoint(x, y);
          p.className = state;
          return el;
        };

        Util.getParent = function getParent(el) {
          return el.parentNode === document ? null : el.parentNode;
        };

        Util.getRectWidth = function getRectWidth(rect) {
          return rect.width || rect.right - rect.left;
        };

        Util.getRectHeight = function getRectHeight(rect) {
          return rect.height || rect.bottom - rect.top;
        };

        Util.isInput = function isInput(el) {
          return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || Util.isEditable(el);
        };

        Util.isEditable = function isEditable(el) {
          if (!el) {
            return false;
          }
          if (el.contentEditable === 'false') {
            return false;
          }
          if (el.contentEditable === 'true') {
            return true;
          }
          return Util.isEditable(Util.getParent(el));
        };

        Util.getOffset = function getOffset(el) {
          var rect = el.getBoundingClientRect();
          return {
            left: rect.left + Util.getScroll('scrollLeft', 'pageXOffset'),
            top: rect.top + Util.getScroll('scrollTop', 'pageYOffset')
          };
        };

        Util.getScroll = function getScroll(scrollProp, offsetProp) {
          if (typeof window[offsetProp] !== 'undefined') {
            return window[offsetProp];
          }
          if (document.documentElement.clientHeight) {
            return document.documentElement[scrollProp];
          }
          return document.body[scrollProp];
        };

        Util.getElementBehindPoint = function getElementBehindPoint(point, x, y) {
          if (point) point.classList.add('gu-hide');

          var el = document.elementFromPoint(x, y);

          if (point) point.classList.remove('gu-hide');
          return el;
        };

        Util.getEventHost = function getEventHost(e) {
          if (e.targetTouches && e.targetTouches.length) {
            return e.targetTouches[0];
          }
          if (e.changedTouches && e.changedTouches.length) {
            return e.changedTouches[0];
          }
          return e;
        };

        Util.getCoord = function getCoord(coord, e) {
          var host = Util.getEventHost(e);
          return host[coord];
        };

        Util.getImmediateChild = function getImmediateChild(dropTarget, target) {
          var immediate = target;
          while (immediate !== dropTarget && Util.getParent(immediate) !== dropTarget) {
            immediate = Util.getParent(immediate);
          }
          if (immediate === document.documentElement) {
            return null;
          }
          return immediate;
        };

        return Util;
      }());

      _export('Util', Util);
    }
  };
});