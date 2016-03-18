'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _touchy = require('./touchy');

var _options = require('./options');

var _util = require('./util');

var _emitter = require('./emitter');

var _classes = require('./classes');

var classes = _interopRequireWildcard(_classes);

var MIN_TIME_BETWEEN_REDRAWS_MS = 20;

var Dragula = (function () {
  function Dragula(options) {
    _classCallCheck(this, Dragula);

    var len = arguments.length;
    var globalOptions = _aureliaDependencyInjection.Container.instance.get(_options.GLOBAL_OPTIONS);
    this.options = _Object$assign({}, globalOptions, options);
    this.emitter = new _emitter.Emitter();
    this.dragging = false;

    if (this.options.removeOnSpill === true) {
      this.emitter.on('over', this.spillOver.bind(this));
      this.emitter.on('out', this.spillOut.bind(this));
    }

    this._events();

    this._mirror;
    this._source;
    this._item;
    this._offsetX;
    this._offsetY;
    this._moveX;
    this._moveY;
    this._initialSibling;
    this._currentSibling;
    this._copy;
    this._lastRenderTime = null;
    this._lastDropTarget = null;
    this._grabbed;
  }

  _createClass(Dragula, [{
    key: 'on',
    value: function on(eventName, callback) {
      this.emitter.on(eventName, callback);
    }
  }, {
    key: 'once',
    value: function once(eventName, callback) {
      this.emitter.once(eventName, callback);
    }
  }, {
    key: 'off',
    value: function off(eventName, fn) {
      this.emitter.off(eventName, fn);
    }
  }, {
    key: 'isContainer',
    value: function isContainer(el) {
      return this.options.containers.indexOf(el) !== -1 || this.options.isContainer(el);
    }
  }, {
    key: '_events',
    value: function _events(remove) {
      var op = remove ? 'removeEventListener' : 'addEventListener';
      (0, _touchy.touchy)(document.documentElement, op, 'mousedown', this._grab.bind(this));
      (0, _touchy.touchy)(document.documentElement, op, 'mouseup', this._release.bind(this));
    }
  }, {
    key: '_eventualMovements',
    value: function _eventualMovements(remove) {
      var op = remove ? 'removeEventListener' : 'addEventListener';
      (0, _touchy.touchy)(document.documentElement, op, 'mousemove', this._startBecauseMouseMoved.bind(this));
    }
  }, {
    key: '_movements',
    value: function _movements(remove) {
      var op = remove ? 'removeEventListener' : 'addEventListener';
      document.documentElement[op]('click', this._preventGrabbed);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._events(true);
      this._release({});
    }
  }, {
    key: '_preventGrabbed',
    value: function _preventGrabbed(e) {
      if (this._grabbed) {
        e.preventDefault();
      }
    }
  }, {
    key: '_grab',
    value: function _grab(e) {
      this._moveX = e.clientX;
      this._moveY = e.clientY;

      var ignore = _util.Util.whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
      if (ignore) {
        return;
      }
      var item = e.target;
      var context = this._canStart(item);
      if (!context) {
        return;
      }
      this._grabbed = context;
      this._eventualMovements();
      if (e.type === 'mousedown') {
        if (_util.Util.isInput(item)) {
          item.focus();
        } else {
            e.preventDefault();
          }
      }
    }
  }, {
    key: '_startBecauseMouseMoved',
    value: function _startBecauseMouseMoved(e) {
      if (!this._grabbed) {
        return;
      }
      if (_util.Util.whichMouseButton(e) === 0) {
        this._release({});
        return;
      }

      if (e.clientX !== void 0 && e.clientX === this._moveX && e.clientY !== void 0 && e.clientY === this._moveY) {
        return;
      }
      if (this.options.ignoreInputTextSelection) {
        var clientX = _util.Util.getCoord('clientX', e);
        var clientY = _util.Util.getCoord('clientY', e);
        var elementBehindCursor = document.elementFromPoint(clientX, clientY);
        if (_util.Util.isInput(elementBehindCursor)) {
          return;
        }
      }

      var grabbed = this._grabbed;
      this._eventualMovements(true);
      this._movements();
      this.end();
      this.start(grabbed);

      var offset = _util.Util.getOffset(this._item);
      this._offsetX = _util.Util.getCoord('pageX', e) - offset.left;
      this._offsetY = _util.Util.getCoord('pageY', e) - offset.top;

      classes.add(this._copy || this._item, 'gu-transit');
      this.renderMirrorImage();
      this.drag(e);
    }
  }, {
    key: '_canStart',
    value: function _canStart(item) {
      if (this.dragging && this._mirror) {
        return;
      }
      if (this.isContainer(item)) {
        return;
      }
      var handle = item;
      while (_util.Util.getParent(item) && this.isContainer(_util.Util.getParent(item)) === false) {
        if (this.options.invalid(item, handle)) {
          return;
        }
        item = _util.Util.getParent(item);
        if (!item) {
          return;
        }
      }
      var source = _util.Util.getParent(item);
      if (!source) {
        return;
      }
      if (this.options.invalid(item, handle)) {
        return;
      }

      var movable = this.options.moves(item, source, handle, _util.Util.nextEl(item));
      if (!movable) {
        return;
      }

      return {
        item: item,
        source: source
      };
    }
  }, {
    key: 'manualStart',
    value: function manualStart(item) {
      var context = this._canStart(item);
      if (context) {
        this.start(context);
      }
    }
  }, {
    key: 'start',
    value: function start(context) {
      if (this._isCopy(context.item, context.source)) {
        this._copy = context.item.cloneNode(true);
        this.emitter.emit('cloned', this._copy, context.item, 'copy');
      }

      this._source = context.source;
      this._item = context.item;
      this._initialSibling = context.item.nextSibling;
      this._currentSibling = _util.Util.nextEl(context.item);

      this.dragging = true;
      this.emitter.emit('drag', this._item, this._source);
    }
  }, {
    key: 'end',
    value: function end() {
      if (!this.dragging) {
        return;
      }
      var item = this._copy || this._item;
      this.drop(item, _util.Util.getParent(item));
    }
  }, {
    key: '_ungrab',
    value: function _ungrab() {
      this._grabbed = false;
      this._eventualMovements(true);
      this._movements(true);
    }
  }, {
    key: '_release',
    value: function _release(e) {
      this._ungrab();

      if (!this.dragging) {
        return;
      }
      var item = this._copy || this._item;
      var clientX = _util.Util.getCoord('clientX', e);
      var clientY = _util.Util.getCoord('clientY', e);
      var elementBehindCursor = _util.Util.getElementBehindPoint(this._mirror, clientX, clientY);
      var dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY);
      if (dropTarget && (this._copy && this.options.copySortSource || !this._copy || dropTarget !== this._source)) {
        this.drop(item, dropTarget);
      } else if (this.options.removeOnSpill) {
        this.remove();
      } else {
        this.cancel();
      }
    }
  }, {
    key: 'drop',
    value: function drop(item, target) {
      var parent = _util.Util.getParent(item);
      if (this._copy && this.options.copySortSource && target === this._source) {
        parent.removeChild(_item);
      }
      if (this._isInitialPlacement(target)) {
        this.emitter.emit('cancel', item, this._source, this._source);
      } else {
        this.emitter.emit('drop', item, target, this._source, this._currentSibling);
      }
      this._cleanup();
    }
  }, {
    key: 'remove',
    value: function remove() {
      if (!this.dragging) {
        return;
      }
      var item = this._copy || this._item;
      var parent = _util.Util.getParent(item);
      if (parent) {
        parent.removeChild(item);
      }
      this.emitter.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source);
      this._cleanup();
    }
  }, {
    key: 'cancel',
    value: function cancel(revert) {
      if (!this.dragging) {
        return;
      }
      var reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
      var item = this._copy || this._item;
      var parent = _util.Util.getParent(item);
      if (parent === this._source && this._copy) {
        parent.removeChild(this._copy);
      }
      var initial = this._isInitialPlacement(parent);
      if (initial === false && !this._copy && reverts) {
        this._source.insertBefore(item, this._initialSibling);
      }
      if (initial || reverts) {
        this.emitter.emit('cancel', item, this._source, this._source);
      } else {
        this.emitter.emit('drop', item, parent, this._source, this._currentSibling);
      }
      this._cleanup();
    }
  }, {
    key: '_cleanup',
    value: function _cleanup() {
      var item = this._copy || this._item;
      this._ungrab();
      this.removeMirrorImage();
      if (item) {
        classes.rm(item, 'gu-transit');
      }
      this.dragging = false;
      if (this._lastDropTarget) {
        this.emitter.emit('out', item, this._lastDropTarget, this._source);
      }
      this.emitter.emit('dragend', item);
      this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._lastRenderTime = this._lastDropTarget = null;
    }
  }, {
    key: '_isInitialPlacement',
    value: function _isInitialPlacement(target, s) {
      var sibling = undefined;
      if (s !== void 0) {
        sibling = s;
      } else if (this._mirror) {
        sibling = this._currentSibling;
      } else {
        sibling = (this._copy || this._item).nextSibling;
      }
      return target === this._source && sibling === this._initialSibling;
    }
  }, {
    key: '_findDropTarget',
    value: function _findDropTarget(elementBehindCursor, clientX, clientY) {
      var _this = this;

      var accepted = function accepted() {
        var droppable = _this.isContainer(target);
        if (droppable === false) {
          return false;
        }

        var immediate = _util.Util.getImmediateChild(target, elementBehindCursor);
        var reference = _this.getReference(target, immediate, clientX, clientY);
        var initial = _this._isInitialPlacement(target, reference);
        if (initial) {
          return true;
        }
        return _this.options.accepts(_this._item, target, _this._source, reference);
      };

      var target = elementBehindCursor;
      while (target && !accepted()) {
        target = _util.Util.getParent(target);
      }
      return target;
    }
  }, {
    key: 'drag',
    value: function drag(e) {
      var _this2 = this;

      if (!this._mirror) {
        return;
      }

      if (this._lastRenderTime !== null && Date.now() - this._lastRenderTime < MIN_TIME_BETWEEN_REDRAWS_MS) {
        return;
      }
      this._lastRenderTime = Date.now();
      e.preventDefault();

      var moved = function moved(type) {
        _this2.emitter.emit(type, item, _this2._lastDropTarget, _this2._source);
      };
      var over = function over() {
        if (changed) {
          moved('over');
        }
      };
      var out = function out() {
        if (_this2._lastDropTarget) {
          moved('out');
        }
      };

      var clientX = _util.Util.getCoord('clientX', e);
      var clientY = _util.Util.getCoord('clientY', e);
      var x = clientX - this._offsetX;
      var y = clientY - this._offsetY;

      this._mirror.style.left = x + 'px';
      this._mirror.style.top = y + 'px';

      var item = this._copy || this._item;
      var elementBehindCursor = _util.Util.getElementBehindPoint(this._mirror, clientX, clientY);
      var dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY);
      var changed = dropTarget !== null && dropTarget !== this._lastDropTarget;
      if (changed || dropTarget === null) {
        out();
        this._lastDropTarget = dropTarget;
        over();
      }
      var parent = _util.Util.getParent(item);
      if (dropTarget === this._source && this._copy && !this.options.copySortSource) {
        if (parent) {
          parent.removeChild(item);
        }
        return;
      }
      var reference = undefined;
      var immediate = _util.Util.getImmediateChild(dropTarget, elementBehindCursor);
      if (immediate !== null) {
        reference = this.getReference(dropTarget, immediate, clientX, clientY);
      } else if (this.options.revertOnSpill === true && !this._copy) {
        reference = this._initialSibling;
        dropTarget = this._source;
      } else {
        if (this._copy && parent) {
          parent.removeChild(item);
        }
        return;
      }
      if (reference === null && changed || reference !== item && reference !== _util.Util.nextEl(item)) {
        this._currentSibling = reference;
        dropTarget.insertBefore(item, reference);
        this.emitter.emit('shadow', item, dropTarget, this._source);
      }
    }
  }, {
    key: 'spillOver',
    value: function spillOver(el) {
      classes.rm(el, 'gu-hide');
    }
  }, {
    key: 'spillOut',
    value: function spillOut(el) {
      if (this.dragging) {
        classes.add(el, 'gu-hide');
      }
    }
  }, {
    key: 'renderMirrorImage',
    value: function renderMirrorImage() {
      if (this._mirror) {
        return;
      }
      var rect = this._item.getBoundingClientRect();
      this._mirror = this._item.cloneNode(true);
      this._mirror.style.width = _util.Util.getRectWidth(rect) + 'px';
      this._mirror.style.height = _util.Util.getRectHeight(rect) + 'px';
      classes.rm(this._mirror, 'gu-transit');
      classes.add(this._mirror, 'gu-mirror');
      this.options.mirrorContainer.appendChild(this._mirror);
      (0, _touchy.touchy)(document.documentElement, 'addEventListener', 'mousemove', this.drag.bind(this));
      classes.add(this.options.mirrorContainer, 'gu-unselectable');
      this.emitter.emit('cloned', this._mirror, this._item, 'mirror');
    }
  }, {
    key: 'removeMirrorImage',
    value: function removeMirrorImage() {
      if (this._mirror) {
        classes.rm(this.options.mirrorContainer, 'gu-unselectable');
        (0, _touchy.touchy)(document.documentElement, 'removeEventListener', 'mousemove', this.drag.bind(this));
        _util.Util.getParent(this._mirror).removeChild(this._mirror);
        this._mirror = null;
      }
    }
  }, {
    key: 'getReference',
    value: function getReference(dropTarget, target, x, y) {
      var outside = function outside() {
        var len = dropTarget.children.length;
        var i = undefined;
        var el = undefined;
        var rect = undefined;
        for (i = 0; i < len; i++) {
          el = dropTarget.children[i];
          rect = el.getBoundingClientRect();
          if (horizontal && rect.left + rect.width / 2 > x) {
            return el;
          }
          if (!horizontal && rect.top + rect.height / 2 > y) {
            return el;
          }
        }
        return null;
      };

      var resolve = function resolve(after) {
        return after ? _util.Util.nextEl(target) : target;
      };

      var inside = function inside() {
        var rect = target.getBoundingClientRect();
        if (horizontal) {
          return resolve(x > rect.left + _util.Util.getRectWidth(rect) / 2);
        }
        return resolve(y > rect.top + _util.Util.getRectHeight(rect) / 2);
      };

      var horizontal = this.options.direction === 'horizontal';
      var reference = target !== dropTarget ? inside() : outside();
      return reference;
    }
  }, {
    key: '_isCopy',
    value: function _isCopy(item, container) {
      return typeof this.options.copy === 'boolean' ? this.options.copy : this.options.copy(item, container);
    }
  }, {
    key: 'containers',
    get: function get() {
      return this.options.containers;
    },
    set: function set(value) {
      this.options.containers = value;
    }
  }]);

  return Dragula;
})();

exports.Dragula = Dragula;