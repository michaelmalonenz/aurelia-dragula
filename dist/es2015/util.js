let _Util = class _Util {
  nextEl(el) {
    return el.nextElementSibling || manually();
    function manually() {
      let sibling = el;
      do {
        sibling = sibling.nextSibling;
      } while (sibling && sibling.nodeType !== 1);
      return sibling;
    }
  }

  whichMouseButton(e) {
    if (e.touches !== void 0) {
      return e.touches.length;
    }
    if (e.which !== void 0 && e.which !== 0) {
      return e.which;
    }
    if (e.buttons !== void 0) {
      return e.buttons;
    }
    let button = e.button;
    if (button !== void 0) {
      return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
    }
  }

  getElementBehindPoint(point, x, y) {
    let p = point || {};
    let state = p.className;
    let el;
    p.className += ' gu-hide';
    el = document.elementFromPoint(x, y);
    p.className = state;
    return el;
  }

  getParent(el) {
    return el.parentNode === document ? null : el.parentNode;
  }
  getRectWidth(rect) {
    return rect.width || rect.right - rect.left;
  }
  getRectHeight(rect) {
    return rect.height || rect.bottom - rect.top;
  }
  isInput(el) {
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || Util.isEditable(el);
  }
  isEditable(el) {
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
  }

  getOffset(el) {
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + this.getScroll('scrollLeft', 'pageXOffset'),
      top: rect.top + this.getScroll('scrollTop', 'pageYOffset')
    };
  }

  getScroll(scrollProp, offsetProp) {
    if (typeof window[offsetProp] !== 'undefined') {
      return window[offsetProp];
    }
    if (document.documentElement.clientHeight) {
      return document.documentElement[scrollProp];
    }
    return document.body[scrollProp];
  }

  getElementBehindPoint(point, x, y) {
    if (point) point.classList.add('gu-hide');

    let el = document.elementFromPoint(x, y);

    if (point) point.classList.remove('gu-hide');
    return el;
  }

  getEventHost(e) {
    if (e.targetTouches && e.targetTouches.length) {
      return e.targetTouches[0];
    }
    if (e.changedTouches && e.changedTouches.length) {
      return e.changedTouches[0];
    }
    return e;
  }

  getCoord(coord, e) {
    let host = this.getEventHost(e);
    return host[coord];
  }

  getImmediateChild(dropTarget, target) {
    let immediate = target;
    while (immediate !== dropTarget && this.getParent(immediate) !== dropTarget) {
      immediate = this.getParent(immediate);
    }
    if (immediate === document.documentElement) {
      return null;
    }
    return immediate;
  }

  remove(node) {
    if (node) {
      if (!('remove' in Element.prototype)) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      } else {
        node.remove();
      }
    }
  }
};

let Util = new _Util();
export { Util };