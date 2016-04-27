define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _Util = function () {
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

    _Util.prototype.getElementBehindPoint = function getElementBehindPoint(point, x, y) {
      var p = point || {};
      var state = p.className;
      var el = void 0;
      p.className += ' gu-hide';
      el = document.elementFromPoint(x, y);
      p.className = state;
      return el;
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
      if (point) point.classList.add('gu-hide');

      var el = document.elementFromPoint(x, y);

      if (point) point.classList.remove('gu-hide');
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

    _Util.prototype.remove = function remove(node) {
      if (node) {
        if (!('remove' in Element.prototype)) {
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        } else {
          node.remove();
        }
      }
    };

    _Util.prototype.getViewModel = function getViewModel(element) {
      if (element.au && element.au.controller) {
        return element.au.controller.viewModel;
      }
      return null;
    };

    return _Util;
  }();

  var Util = new _Util();
  exports.Util = Util;
});