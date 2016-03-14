System.register(['babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check'], function (_export) {
  var _createClass, _classCallCheck, Util;

  return {
    setters: [function (_babelRuntimeHelpersCreateClass) {
      _createClass = _babelRuntimeHelpersCreateClass['default'];
    }, function (_babelRuntimeHelpersClassCallCheck) {
      _classCallCheck = _babelRuntimeHelpersClassCallCheck['default'];
    }],
    execute: function () {
      'use strict';

      Util = (function () {
        function Util() {
          _classCallCheck(this, Util);
        }

        _createClass(Util, null, [{
          key: 'nextEl',
          value: function nextEl(el) {
            return el.nextElementSibling || manually();
            function manually() {
              var sibling = el;
              do {
                sibling = sibling.nextSibling;
              } while (sibling && sibling.nodeType !== 1);
              return sibling;
            }
          }
        }, {
          key: 'whichMouseButton',
          value: function whichMouseButton(e) {
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
          }
        }, {
          key: 'getElementBehindPoint',
          value: function getElementBehindPoint(point, x, y) {
            var p = point || {};
            var state = p.className;
            var el = undefined;
            p.className += ' gu-hide';
            el = document.elementFromPoint(x, y);
            p.className = state;
            return el;
          }
        }, {
          key: 'getParent',
          value: function getParent(el) {
            return el.parentNode === document ? null : el.parentNode;
          }
        }, {
          key: 'getRectWidth',
          value: function getRectWidth(rect) {
            return rect.width || rect.right - rect.left;
          }
        }, {
          key: 'getRectHeight',
          value: function getRectHeight(rect) {
            return rect.height || rect.bottom - rect.top;
          }
        }, {
          key: 'isInput',
          value: function isInput(el) {
            return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || Util.isEditable(el);
          }
        }, {
          key: 'isEditable',
          value: function isEditable(el) {
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
          }
        }, {
          key: 'getOffset',
          value: function getOffset(el) {
            var rect = el.getBoundingClientRect();
            return {
              left: rect.left + Util.getScroll('scrollLeft', 'pageXOffset'),
              top: rect.top + Util.getScroll('scrollTop', 'pageYOffset')
            };
          }
        }, {
          key: 'getScroll',
          value: function getScroll(scrollProp, offsetProp) {
            if (typeof window[offsetProp] !== 'undefined') {
              return window[offsetProp];
            }
            if (document.documentElement.clientHeight) {
              return document.documentElement[scrollProp];
            }
            return document.body[scrollProp];
          }
        }, {
          key: 'getElementBehindPoint',
          value: function getElementBehindPoint(point, x, y) {
            if (point) point.classList.add('gu-hide');

            var el = document.elementFromPoint(x, y);

            if (point) point.classList.remove('gu-hide');
            return el;
          }
        }, {
          key: 'getEventHost',
          value: function getEventHost(e) {
            if (e.targetTouches && e.targetTouches.length) {
              return e.targetTouches[0];
            }
            if (e.changedTouches && e.changedTouches.length) {
              return e.changedTouches[0];
            }
            return e;
          }
        }, {
          key: 'getCoord',
          value: function getCoord(coord, e) {
            var host = Util.getEventHost(e);
            return host[coord];
          }
        }, {
          key: 'getImmediateChild',
          value: function getImmediateChild(dropTarget, target) {
            var immediate = target;
            while (immediate !== dropTarget && Util.getParent(immediate) !== dropTarget) {
              immediate = Util.getParent(immediate);
            }
            if (immediate === document.documentElement) {
              return null;
            }
            return immediate;
          }
        }]);

        return Util;
      })();

      _export('Util', Util);
    }
  };
});