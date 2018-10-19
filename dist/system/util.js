'use strict';

System.register(['./classes'], function (_export, _context) {
  "use strict";

  var classes, _Util, Util;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_classes) {
      classes = _classes;
    }],
    execute: function () {
      _Util = function () {
        function _Util() {
          _classCallCheck(this, _Util);
        }

        _Util.prototype.nextEl = function nextEl(el) {
          return el.nextElementSibling || manually();
          function manually() {
            var sibling = el;
            do {
              sibling = sibling.nextSibling;
            } while (sibling && sibling.nodeType !== 1);
            return sibling;
          }
        };

        _Util.prototype.whichMouseButton = function whichMouseButton(e) {
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

        _Util.prototype.getParent = function getParent(el) {
          return el.parentNode === document ? null : el.parentNode;
        };

        _Util.prototype.getRectWidth = function getRectWidth(rect) {
          return rect.width || rect.right - rect.left;
        };

        _Util.prototype.getRectHeight = function getRectHeight(rect) {
          return rect.height || rect.bottom - rect.top;
        };

        _Util.prototype.isInput = function isInput(el) {
          return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || Util.isEditable(el);
        };

        _Util.prototype.isEditable = function isEditable(el) {
          if (!el) {
            return false;
          }
          if (el.contentEditable === 'false') {
            return false;
          }
          if (el.contentEditable === 'true') {
            return true;
          }
          return this.isEditable(this.getParent(el));
        };

        _Util.prototype.getOffset = function getOffset(el) {
          var rect = el.getBoundingClientRect();
          return {
            left: rect.left + this.getScroll('scrollLeft', 'pageXOffset'),
            top: rect.top + this.getScroll('scrollTop', 'pageYOffset')
          };
        };

        _Util.prototype.getScroll = function getScroll(scrollProp, offsetProp) {
          if (typeof window[offsetProp] !== 'undefined') {
            return window[offsetProp];
          }
          if (document.documentElement.clientHeight) {
            return document.documentElement[scrollProp];
          }
          return document.body[scrollProp];
        };

        _Util.prototype.getElementBehindPoint = function getElementBehindPoint(point, x, y) {
          if (point) {
            classes.add(point, 'gu-hide');
          }

          var el = document.elementFromPoint(x, y);

          if (point) {
            classes.rm(point, 'gu-hide');
          }
          return el;
        };

        _Util.prototype.getEventHost = function getEventHost(e) {
          if (e.targetTouches && e.targetTouches.length) {
            return e.targetTouches[0];
          }
          if (e.changedTouches && e.changedTouches.length) {
            return e.changedTouches[0];
          }
          return e;
        };

        _Util.prototype.getCoord = function getCoord(coord, e) {
          var host = this.getEventHost(e);
          return host[coord];
        };

        _Util.prototype.getImmediateChild = function getImmediateChild(dropTarget, target) {
          var immediate = target;
          while (immediate !== dropTarget && this.getParent(immediate) !== dropTarget) {
            immediate = this.getParent(immediate);
          }
          if (immediate === document.documentElement) {
            return null;
          }
          return immediate;
        };

        _Util.prototype.getViewModel = function getViewModel(element) {
          if (element && element.au && element.au.controller) {
            if (element.au.controller.viewModel.currentViewModel) {
              return element.au.controller.viewModel.currentViewModel;
            } else {
              return element.au.controller.viewModel;
            }
          }
          return null;
        };

        return _Util;
      }();

      _export('Util', Util = new _Util());

      _export('Util', Util);
    }
  };
});