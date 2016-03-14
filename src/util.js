export class Util {
    //nextEl
  static nextEl(el) {
    return el.nextElementSibling || manually();
    function manually () {
      let sibling = el;
      do {
        sibling = sibling.nextSibling;
      } while (sibling && sibling.nodeType !== 1);
      return sibling;
    }
  }

  //whichMouseButton
  static whichMouseButton(e) {
    if (e.touches !== void 0) { return e.touches.length; }
    if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
    if (e.buttons !== void 0) { return e.buttons; }
    let button = e.button;
    if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
      return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
    }
  }

  //getElementBehindPoint
  static getElementBehindPoint(point, x, y) {
    let p = point || {};
    let state = p.className;
    let el;
    p.className += ' gu-hide';
    el = document.elementFromPoint(x, y);
    p.className = state;
    return el;
  }

  static getParent(el) { return el.parentNode === document ? null : el.parentNode; }
  static getRectWidth(rect) { return rect.width || (rect.right - rect.left); }
  static getRectHeight(rect) { return rect.height || (rect.bottom - rect.top); }
  static isInput(el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || Util.isEditable(el); }
  static isEditable(el) {
    if (!el) { return false; } // no parents were editable
    if (el.contentEditable === 'false') { return false; } // stop the lookup
    if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
    return Util.isEditable(Util.getParent(el)); // contentEditable is set to 'inherit'
  }

  static getOffset(el) {
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + Util.getScroll('scrollLeft', 'pageXOffset'),
      top: rect.top + Util.getScroll('scrollTop', 'pageYOffset')
    };
  }

  static getScroll(scrollProp, offsetProp) {
    if (typeof window[offsetProp] !== 'undefined') {
      return window[offsetProp];
    }
    if (document.documentElement.clientHeight) {
      return document.documentElement[scrollProp];
    }
    return document.body[scrollProp];
  }

  static getElementBehindPoint(point, x, y) {
    if (point)
      point.classList.add('gu-hide');

    let el = document.elementFromPoint(x, y);

    if (point)
      point.classList.remove('gu-hide');
    return el;
  }

  static getEventHost(e) {
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
  }

  static getCoord(coord, e) {
    let host = Util.getEventHost(e);
    return host[coord];
  }

  static getImmediateChild(dropTarget, target) {
    let immediate = target;
    while (immediate !== dropTarget && Util.getParent(immediate) !== dropTarget) {
      immediate = Util.getParent(immediate);
    }
    if (immediate === document.documentElement) {
      return null;
    }
    return immediate;
  }
}