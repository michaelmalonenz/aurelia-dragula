"use strict";

exports.__esModule = true;
exports.Util = void 0;

var classes = _interopRequireWildcard(require("./classes"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _Util = /*#__PURE__*/function () {
  function _Util() {}

  var _proto = _Util.prototype;

  _proto.nextEl = function nextEl(el) {
    return el.nextElementSibling || manually();

    function manually() {
      var sibling = el;

      do {
        sibling = sibling.nextSibling;
      } while (sibling && sibling.nodeType !== 1);

      return sibling;
    }
  };

  _proto.whichMouseButton = function whichMouseButton(e) {
    if (e.touches !== void 0) {
      return e.touches.length;
    }

    if (e.which !== void 0 && e.which !== 0) {
      return e.which;
    } // see https://github.com/bevacqua/dragula/issues/261


    if (e.buttons !== void 0) {
      return e.buttons;
    }

    var button = e.button;

    if (button !== void 0) {
      // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
      return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
    }
  };

  _proto.getParent = function getParent(el) {
    return el.parentNode === document ? null : el.parentNode;
  };

  _proto.getRectWidth = function getRectWidth(rect) {
    return rect.width || rect.right - rect.left;
  };

  _proto.getRectHeight = function getRectHeight(rect) {
    return rect.height || rect.bottom - rect.top;
  };

  _proto.isInput = function isInput(el) {
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || Util.isEditable(el);
  };

  _proto.isEditable = function isEditable(el) {
    if (!el) {
      return false;
    } // no parents were editable


    if (el.contentEditable === 'false') {
      return false;
    } // stop the lookup


    if (el.contentEditable === 'true') {
      return true;
    } // found a contentEditable element in the chain


    return this.isEditable(this.getParent(el)); // contentEditable is set to 'inherit'
  };

  _proto.getOffset = function getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + this.getScroll('scrollLeft', 'pageXOffset'),
      top: rect.top + this.getScroll('scrollTop', 'pageYOffset')
    };
  };

  _proto.getScroll = function getScroll(scrollProp, offsetProp) {
    if (typeof window[offsetProp] !== 'undefined') {
      return window[offsetProp];
    }

    if (document.documentElement.clientHeight) {
      return document.documentElement[scrollProp];
    }

    return document.body[scrollProp];
  };

  _proto.getElementBehindPoint = function getElementBehindPoint(point, x, y) {
    if (point) {
      classes.add(point, 'gu-hide');
    }

    var el = document.elementFromPoint(x, y);

    if (point) {
      classes.rm(point, 'gu-hide');
    }

    return el;
  };

  _proto.getEventHost = function getEventHost(e) {
    // on touchend event, we have to use `e.changedTouches`
    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
    // see https://github.com/bevacqua/dragula/issues/34
    if (e.targetTouches && e.targetTouches.length) {
      return e.targetTouches[0];
    }

    if (e.changedTouches && e.changedTouches.length) {
      return e.changedTouches[0];
    }

    return e;
  };

  _proto.getCoord = function getCoord(coord, e) {
    var host = this.getEventHost(e);
    return host[coord];
  };

  _proto.getImmediateChild = function getImmediateChild(dropTarget, target) {
    var immediate = target;

    while (immediate !== dropTarget && this.getParent(immediate) !== dropTarget) {
      immediate = this.getParent(immediate);
    }

    if (immediate === document.documentElement) {
      return null;
    }

    return immediate;
  };

  _proto.getViewModel = function getViewModel(element) {
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

var Util = new _Util();
exports.Util = Util;
//# sourceMappingURL=util.js.map
