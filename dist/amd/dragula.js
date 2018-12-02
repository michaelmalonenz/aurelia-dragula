define(['exports', 'aurelia-dependency-injection', './touchy', './options', './util', './emitter', './classes'], function (exports, _aureliaDependencyInjection, _touchy, _options, _util, _emitter, _classes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Dragula = undefined;

  var classes = _interopRequireWildcard(_classes);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var MIN_TIME_BETWEEN_REDRAWS_MS = 20;

  var Dragula = exports.Dragula = function () {
    function Dragula(options) {
      _classCallCheck(this, Dragula);

      var globalOptions = _aureliaDependencyInjection.Container.instance.get(_options.GLOBAL_OPTIONS);
      this.options = Object.assign({}, globalOptions, options);
      this._emitter = new _emitter.Emitter();
      this.dragging = false;

      if (this.options.removeOnSpill === true) {
        this._emitter.on('over', this.spillOver.bind(this));
        this._emitter.on('out', this.spillOut.bind(this));
      }

      this.boundStart = this._startBecauseMouseMoved.bind(this);
      this.boundGrab = this._grab.bind(this);
      this.boundRelease = this._release.bind(this);
      this.boundPreventGrabbed = this._preventGrabbed.bind(this);
      this.boundDrag = this.drag.bind(this);

      this._addEvents();

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

    Dragula.prototype.on = function on(eventName, callback) {
      this._emitter.on(eventName, callback);
    };

    Dragula.prototype.once = function once(eventName, callback) {
      this._emitter.once(eventName, callback);
    };

    Dragula.prototype.off = function off(eventName, fn) {
      this._emitter.off(eventName, fn);
    };

    Dragula.prototype.isContainer = function isContainer(el) {
      return this.options.containers.indexOf(el) !== -1 || this.options.isContainer(el);
    };

    Dragula.prototype._addEvents = function _addEvents() {
      (0, _touchy.touchy)(document.documentElement, 'addEventListener', 'mousedown', this.boundGrab);
      (0, _touchy.touchy)(document.documentElement, 'addEventListener', 'mouseup', this.boundRelease);
    };

    Dragula.prototype._removeEvents = function _removeEvents() {
      (0, _touchy.touchy)(document.documentElement, 'removeEventListener', 'mousedown', this.boundGrab);
      (0, _touchy.touchy)(document.documentElement, 'removeEventListener', 'mouseup', this.boundRelease);
    };

    Dragula.prototype._eventualMovements = function _eventualMovements(remove) {
      var op = remove ? 'removeEventListener' : 'addEventListener';
      (0, _touchy.touchy)(document.documentElement, op, 'mousemove', this.boundStart);
    };

    Dragula.prototype._movements = function _movements(remove) {
      var op = remove ? 'removeEventListener' : 'addEventListener';
      (0, _touchy.touchy)(document.documentElement, op, 'click', this.boundPreventGrabbed);
    };

    Dragula.prototype.destroy = function destroy() {
      this._removeEvents();
      this._release({ clientX: -1, clientY: -1 });
      this._emitter.destroy();
    };

    Dragula.prototype._preventGrabbed = function _preventGrabbed(e) {
      if (this._grabbed) {
        e.preventDefault();
      }
    };

    Dragula.prototype._grab = function _grab(e) {
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
      if (_util.Util.isInput(item)) {
        item.focus();
      } else {
        e.preventDefault();
      }
    };

    Dragula.prototype._startBecauseMouseMoved = function _startBecauseMouseMoved(e) {
      if (!this._grabbed || this.dragging) {
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

      var item = this._copy || this._item;
      classes.add(item, 'gu-transit');
      this.renderMirrorImage();
      this.drag(e);
    };

    Dragula.prototype._canStart = function _canStart(item) {
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
    };

    Dragula.prototype._cloneNodeWithoutCheckedRadios = function _cloneNodeWithoutCheckedRadios(el) {
      var mirror = el.cloneNode(true);
      var mirrorInputs = mirror.getElementsByTagName('input');
      var len = mirrorInputs.length;
      for (var i = 0; i < len; i++) {
        if (mirrorInputs[i].type === 'radio') {
          mirrorInputs[i].checked = false;
        }
      }
      return mirror;
    };

    Dragula.prototype.manualStart = function manualStart(item) {
      var context = this._canStart(item);
      if (context) {
        this.start(context);
      }
    };

    Dragula.prototype.start = function start(context) {
      if (this._isCopy(context.item, context.source)) {
        this._copy = this._cloneNodeWithoutCheckedRadios(context.item);
        this._emitter.emit('cloned', this._copy, context.item, 'copy', _util.Util.getViewModel(context.item));
      }

      this._source = context.source;
      this._item = context.item;

      this._initialSibling = context.item.nextSibling;
      this._currentSibling = _util.Util.nextEl(context.item);

      this.dragging = true;
      this._emitter.emit('drag', this._item, this._source, _util.Util.getViewModel(this._item));
    };

    Dragula.prototype.end = function end() {
      if (!this.dragging) {
        return;
      }
      var item = this._copy || this._item;
      this.drop(item, _util.Util.getParent(item));
    };

    Dragula.prototype._ungrab = function _ungrab() {
      this._grabbed = false;
      this._eventualMovements(true);
      this._movements(true);
    };

    Dragula.prototype._release = function _release(e) {
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
    };

    Dragula.prototype.drop = function drop(item, target) {
      if (this._copy && this.options.copySortSource && target === this._source) {
        var parent = _util.Util.getParent(this._item);
        if (parent) {
          parent.removeChild(this._item);
        }
      }
      if (this._isInitialPlacement(target)) {
        this._emitter.emit('cancel', item, this._source, this._source, _util.Util.getViewModel(this._item));
      } else {
        this._emitter.emit('drop', item, target, this._source, this._currentSibling, _util.Util.getViewModel(this._item), _util.Util.getViewModel(this._currentSibling));
      }
      this._cleanup();
    };

    Dragula.prototype.remove = function remove() {
      if (!this.dragging) {
        return;
      }
      var item = this._copy || this._item;
      var parent = _util.Util.getParent(item);
      if (parent) {
        parent.removeChild(item);
      }
      this._emitter.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source, _util.Util.getViewModel(this._item));
      this._cleanup();
    };

    Dragula.prototype.cancel = function cancel(revert) {
      var forceIgnoreRevert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!this.dragging) {
        return;
      }

      if (this._initialSibling && this._initialSibling.nodeName === '#comment' && this._initialSibling.data === 'anchor') {
        forceIgnoreRevert = false;
      }
      var reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
      var item = this._copy || this._item;
      var parent = _util.Util.getParent(item);
      var initial = this._isInitialPlacement(parent);
      if (initial === false && reverts && this._copy && parent && parent !== this._source) {
        parent.removeChild(this._copy);
      } else {
        this._source.insertBefore(item, this._initialSibling);
      }
      if (initial || reverts) {
        this._emitter.emit('cancel', item, this._source, this._source, _util.Util.getViewModel(this._item));
      } else {
        this._emitter.emit('drop', item, parent, this._source, this._currentSibling, _util.Util.getViewModel(this._item), _util.Util.getViewModel(this._currentSibling));
      }
      this._cleanup();
    };

    Dragula.prototype._cleanup = function _cleanup() {
      var item = this._copy || this._item;
      this._ungrab();
      this.removeMirrorImage();
      if (item) {
        classes.rm(item, 'gu-transit');
      }
      this.dragging = false;
      if (this._lastDropTarget) {
        this._emitter.emit('out', item, this._lastDropTarget, this._source, _util.Util.getViewModel(item));
      }
      this._emitter.emit('dragend', item, _util.Util.getViewModel(item));
      this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._lastRenderTime = this._lastDropTarget = null;
    };

    Dragula.prototype._isInitialPlacement = function _isInitialPlacement(target, s) {
      var sibling = void 0;
      if (s !== void 0) {
        sibling = s;
      } else if (this._mirror) {
        sibling = this._currentSibling;
      } else {
        var item = this._copy || this._item;
        sibling = item.nextSibling;
      }
      return target === this._source && sibling === this._initialSibling;
    };

    Dragula.prototype._findDropTarget = function _findDropTarget(elementBehindCursor, clientX, clientY) {
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
    };

    Dragula.prototype.drag = function drag(e) {
      var _this2 = this;

      e.preventDefault();
      if (!this._mirror) {
        return;
      }

      if (this._lastRenderTime != null && Date.now() - this._lastRenderTime < MIN_TIME_BETWEEN_REDRAWS_MS) {
        return;
      }
      this._lastRenderTime = Date.now();

      var item = this._copy || this._item;

      var moved = function moved(type) {
        _this2._emitter.emit(type, item, _this2._lastDropTarget, _this2._source, _util.Util.getViewModel(item));
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

      var elementBehindCursor = _util.Util.getElementBehindPoint(this._mirror, clientX, clientY);
      var dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY);
      var changed = dropTarget != null && dropTarget !== this._lastDropTarget;
      if (changed || dropTarget == null) {
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
      var reference = void 0;
      var immediate = _util.Util.getImmediateChild(dropTarget, elementBehindCursor);
      if (immediate != null) {
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
      if (reference == null && changed || reference !== item && reference !== _util.Util.nextEl(item)) {
        this._currentSibling = reference;
        dropTarget.insertBefore(item, reference);
        this._emitter.emit('shadow', item, dropTarget, this._source, _util.Util.getViewModel(item));
      }
    };

    Dragula.prototype.spillOver = function spillOver(el) {
      classes.rm(el, 'gu-hide');
    };

    Dragula.prototype.spillOut = function spillOut(el) {
      if (this.dragging) {
        classes.add(el, 'gu-hide');
      }
    };

    Dragula.prototype.renderMirrorImage = function renderMirrorImage() {
      if (this._mirror) {
        return;
      }
      var rect = this._item.getBoundingClientRect();
      this._mirror = this._cloneNodeWithoutCheckedRadios(this._item);
      this._mirror.style.width = _util.Util.getRectWidth(rect) + 'px';
      this._mirror.style.height = _util.Util.getRectHeight(rect) + 'px';
      classes.rm(this._mirror, 'gu-transit');
      classes.add(this._mirror, 'gu-mirror');
      this.options.mirrorContainer.appendChild(this._mirror);
      (0, _touchy.touchy)(document.documentElement, 'addEventListener', 'mousemove', this.boundDrag);
      classes.add(this.options.mirrorContainer, 'gu-unselectable');
      this._emitter.emit('cloned', this._mirror, this._item, 'mirror', _util.Util.getViewModel(this._item));
    };

    Dragula.prototype.removeMirrorImage = function removeMirrorImage() {
      if (this._mirror) {
        classes.rm(this.options.mirrorContainer, 'gu-unselectable');
        (0, _touchy.touchy)(document.documentElement, 'removeEventListener', 'mousemove', this.boundDrag);
        _util.Util.getParent(this._mirror).removeChild(this._mirror);
        this._mirror = null;
      }
    };

    Dragula.prototype.getReference = function getReference(dropTarget, target, x, y) {
      var horizontal = this.options.direction === 'horizontal';
      var outside = function outside() {
        var len = dropTarget.children.length;
        var i = void 0,
            el = void 0,
            rect = void 0;
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

      var reference = target !== dropTarget ? inside() : outside();
      return reference;
    };

    Dragula.prototype._isCopy = function _isCopy(item, container) {
      var isBoolean = typeof this.options.copy === 'boolean' || _typeof(this.options.copy) === 'object' && typeof this.options.copy.valueOf() === 'boolean';

      return isBoolean ? this.options.copy : this.options.copy(item, container);
    };

    _createClass(Dragula, [{
      key: 'containers',
      get: function get() {
        return this.options.containers;
      },
      set: function set(value) {
        this.options.containers = value;
      }
    }]);

    return Dragula;
  }();
});