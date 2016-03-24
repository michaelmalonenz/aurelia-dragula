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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWE7Ozs7O2FBRUoseUJBQU8sSUFBSTtBQUNoQixpQkFBTyxHQUFHLGtCQUFILElBQXlCLFVBQXpCLENBRFM7QUFFaEIsbUJBQVMsUUFBVCxHQUFxQjtBQUNuQixnQkFBSSxVQUFVLEVBQVYsQ0FEZTtBQUVuQixlQUFHO0FBQ0Qsd0JBQVUsUUFBUSxXQUFSLENBRFQ7YUFBSCxRQUVTLFdBQVcsUUFBUSxRQUFSLEtBQXFCLENBQXJCLEVBSkQ7QUFLbkIsbUJBQU8sT0FBUCxDQUxtQjtXQUFyQjs7O0FBSlMsYUFjSiw2Q0FBaUIsR0FBRztBQUN6QixjQUFJLEVBQUUsT0FBRixLQUFjLEtBQUssQ0FBTCxFQUFRO0FBQUUsbUJBQU8sRUFBRSxPQUFGLENBQVUsTUFBVixDQUFUO1dBQTFCO0FBQ0EsY0FBSSxFQUFFLEtBQUYsS0FBWSxLQUFLLENBQUwsSUFBVSxFQUFFLEtBQUYsS0FBWSxDQUFaLEVBQWU7QUFBRSxtQkFBTyxFQUFFLEtBQUYsQ0FBVDtXQUF6QztBQUNBLGNBQUksRUFBRSxPQUFGLEtBQWMsS0FBSyxDQUFMLEVBQVE7QUFBRSxtQkFBTyxFQUFFLE9BQUYsQ0FBVDtXQUExQjtBQUNBLGNBQUksU0FBUyxFQUFFLE1BQUYsQ0FKWTtBQUt6QixjQUFJLFdBQVcsS0FBSyxDQUFMLEVBQVE7QUFDckIsbUJBQU8sU0FBUyxDQUFULEdBQWEsQ0FBYixHQUFpQixTQUFTLENBQVQsR0FBYSxDQUFiLEdBQWtCLFNBQVMsQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBakIsQ0FEckI7V0FBdkI7OztBQW5CUyxhQXlCSix1REFBc0IsT0FBTyxHQUFHLEdBQUc7QUFDeEMsY0FBSSxJQUFJLFNBQVMsRUFBVCxDQURnQztBQUV4QyxjQUFJLFFBQVEsRUFBRSxTQUFGLENBRjRCO0FBR3hDLGNBQUksV0FBSixDQUh3QztBQUl4QyxZQUFFLFNBQUYsSUFBZSxVQUFmLENBSndDO0FBS3hDLGVBQUssU0FBUyxnQkFBVCxDQUEwQixDQUExQixFQUE2QixDQUE3QixDQUFMLENBTHdDO0FBTXhDLFlBQUUsU0FBRixHQUFjLEtBQWQsQ0FOd0M7QUFPeEMsaUJBQU8sRUFBUCxDQVB3Qzs7O0FBekIvQixhQW1DSiwrQkFBVSxJQUFJO0FBQUUsaUJBQU8sR0FBRyxVQUFILEtBQWtCLFFBQWxCLEdBQTZCLElBQTdCLEdBQW9DLEdBQUcsVUFBSCxDQUE3Qzs7O0FBbkNWLGFBb0NKLHFDQUFhLE1BQU07QUFBRSxpQkFBTyxLQUFLLEtBQUwsSUFBZSxLQUFLLEtBQUwsR0FBYSxLQUFLLElBQUwsQ0FBckM7OztBQXBDZixhQXFDSix1Q0FBYyxNQUFNO0FBQUUsaUJBQU8sS0FBSyxNQUFMLElBQWdCLEtBQUssTUFBTCxHQUFjLEtBQUssR0FBTCxDQUF2Qzs7O0FBckNoQixhQXNDSiwyQkFBUSxJQUFJO0FBQUUsaUJBQU8sR0FBRyxPQUFILEtBQWUsT0FBZixJQUEwQixHQUFHLE9BQUgsS0FBZSxVQUFmLElBQTZCLEdBQUcsT0FBSCxLQUFlLFFBQWYsSUFBMkIsS0FBSyxVQUFMLENBQWdCLEVBQWhCLENBQWxGLENBQVQ7OztBQXRDUixhQXVDSixpQ0FBVyxJQUFJO0FBQ3BCLGNBQUksQ0FBQyxFQUFELEVBQUs7QUFBRSxtQkFBTyxLQUFQLENBQUY7V0FBVDtBQUNBLGNBQUksR0FBRyxlQUFILEtBQXVCLE9BQXZCLEVBQWdDO0FBQUUsbUJBQU8sS0FBUCxDQUFGO1dBQXBDO0FBQ0EsY0FBSSxHQUFHLGVBQUgsS0FBdUIsTUFBdkIsRUFBK0I7QUFBRSxtQkFBTyxJQUFQLENBQUY7V0FBbkM7QUFDQSxpQkFBTyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxTQUFMLENBQWUsRUFBZixDQUFoQixDQUFQLENBSm9COzs7QUF2Q1gsYUE4Q0osK0JBQVUsSUFBSTtBQUNuQixjQUFJLE9BQU8sR0FBRyxxQkFBSCxFQUFQLENBRGU7QUFFbkIsaUJBQU87QUFDTCxrQkFBTSxLQUFLLElBQUwsR0FBWSxLQUFLLFNBQUwsQ0FBZSxZQUFmLEVBQTZCLGFBQTdCLENBQVo7QUFDTixpQkFBSyxLQUFLLEdBQUwsR0FBVyxLQUFLLFNBQUwsQ0FBZSxXQUFmLEVBQTRCLGFBQTVCLENBQVg7V0FGUCxDQUZtQjs7O0FBOUNWLGFBc0RKLCtCQUFVLFlBQVksWUFBWTtBQUN2QyxjQUFJLE9BQU8sT0FBTyxVQUFQLENBQVAsS0FBOEIsV0FBOUIsRUFBMkM7QUFDN0MsbUJBQU8sT0FBTyxVQUFQLENBQVAsQ0FENkM7V0FBL0M7QUFHQSxjQUFJLFNBQVMsZUFBVCxDQUF5QixZQUF6QixFQUF1QztBQUN6QyxtQkFBTyxTQUFTLGVBQVQsQ0FBeUIsVUFBekIsQ0FBUCxDQUR5QztXQUEzQztBQUdBLGlCQUFPLFNBQVMsSUFBVCxDQUFjLFVBQWQsQ0FBUCxDQVB1Qzs7O0FBdEQ5QixhQWdFSix1REFBc0IsT0FBTyxHQUFHLEdBQUc7QUFDeEMsY0FBSSxLQUFKLEVBQ0UsTUFBTSxTQUFOLENBQWdCLEdBQWhCLENBQW9CLFNBQXBCLEVBREY7O0FBR0EsY0FBSSxLQUFLLFNBQVMsZ0JBQVQsQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBTCxDQUpvQzs7QUFNeEMsY0FBSSxLQUFKLEVBQ0UsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFNBQXZCLEVBREY7QUFFQSxpQkFBTyxFQUFQLENBUndDOzs7QUFoRS9CLGFBMkVKLHFDQUFhLEdBQUc7QUFJckIsY0FBSSxFQUFFLGFBQUYsSUFBbUIsRUFBRSxhQUFGLENBQWdCLE1BQWhCLEVBQXdCO0FBQzdDLG1CQUFPLEVBQUUsYUFBRixDQUFnQixDQUFoQixDQUFQLENBRDZDO1dBQS9DO0FBR0EsY0FBSSxFQUFFLGNBQUYsSUFBb0IsRUFBRSxjQUFGLENBQWlCLE1BQWpCLEVBQXlCO0FBQy9DLG1CQUFPLEVBQUUsY0FBRixDQUFpQixDQUFqQixDQUFQLENBRCtDO1dBQWpEO0FBR0EsaUJBQU8sQ0FBUCxDQVZxQjs7O0FBM0VaLGFBd0ZKLDZCQUFTLE9BQU8sR0FBRztBQUN4QixjQUFJLE9BQU8sS0FBSyxZQUFMLENBQWtCLENBQWxCLENBQVAsQ0FEb0I7QUFFeEIsaUJBQU8sS0FBSyxLQUFMLENBQVAsQ0FGd0I7OztBQXhGZixhQTZGSiwrQ0FBa0IsWUFBWSxRQUFRO0FBQzNDLGNBQUksWUFBWSxNQUFaLENBRHVDO0FBRTNDLGlCQUFPLGNBQWMsVUFBZCxJQUE0QixLQUFLLFNBQUwsQ0FBZSxTQUFmLE1BQThCLFVBQTlCLEVBQTBDO0FBQzNFLHdCQUFZLEtBQUssU0FBTCxDQUFlLFNBQWYsQ0FBWixDQUQyRTtXQUE3RTtBQUdBLGNBQUksY0FBYyxTQUFTLGVBQVQsRUFBMEI7QUFDMUMsbUJBQU8sSUFBUCxDQUQwQztXQUE1QztBQUdBLGlCQUFPLFNBQVAsQ0FSMkM7OztlQTdGbEMiLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIn0=
