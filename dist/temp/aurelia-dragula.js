'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Util = exports.Options = exports.DIRECTION = exports.GLOBAL_OPTIONS = exports.Emitter = exports.Dragula = exports.DragulaAndDrop = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class;

exports.add = add;
exports.rm = rm;
exports.moveBefore = moveBefore;
exports.touchy = touchy;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaPal = require('aurelia-pal');

var _classes = require('./classes');

var classes = _interopRequireWildcard(_classes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cache = {};
var start = '(?:^|\\s)';
var end = '(?:\\s|$)';

function lookupClass(className) {
  var cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cache[className] = cached = new RegExp(start + className + end, 'g');
  }
  return cached;
}

function add(el, className) {
  if (el.classList) {
    el.classList.add(className);
    return;
  }
  var current = el.className;
  if (!current.length) {
    el.className = className;
  } else if (!lookupClass(className).test(current)) {
    el.className += ' ' + className;
  }
}

function rm(el, className) {
  if (el.classList) {
    el.classList.remove(className);
    return;
  }
  el.className = el.className.replace(lookupClass(className), ' ').trim();
}

var DragulaAndDrop = exports.DragulaAndDrop = (_dec = (0, _aureliaTemplating.bindable)({ name: 'moves', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec2 = (0, _aureliaTemplating.bindable)({ name: 'accepts', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec3 = (0, _aureliaTemplating.bindable)({ name: 'invalid', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec4 = (0, _aureliaTemplating.bindable)({ name: 'containers', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec5 = (0, _aureliaTemplating.bindable)({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec6 = (0, _aureliaTemplating.bindable)({ name: 'copy', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec7 = (0, _aureliaTemplating.bindable)({ name: 'copySortSource', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec8 = (0, _aureliaTemplating.bindable)({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: true }), _dec9 = (0, _aureliaTemplating.bindable)({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec10 = (0, _aureliaTemplating.bindable)({ name: 'direction', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec11 = (0, _aureliaTemplating.bindable)({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec12 = (0, _aureliaTemplating.bindable)({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec13 = (0, _aureliaTemplating.bindable)({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: 'drop-target' }), _dec14 = (0, _aureliaTemplating.bindable)({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: 'drag-source' }), _dec15 = (0, _aureliaTemplating.bindable)({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec16 = (0, _aureliaTemplating.bindable)({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec17 = (0, _aureliaTemplating.bindable)({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec18 = (0, _aureliaTemplating.bindable)({ name: 'clonedFn', attribute: 'cloned-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec19 = (0, _aureliaTemplating.bindable)({ name: 'overFn', attribute: 'over-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec20 = (0, _aureliaTemplating.bindable)({ name: 'outFn', attribute: 'out-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec21 = (0, _aureliaTemplating.bindable)({ name: 'shadowFn', attribute: 'shadow-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec22 = (0, _aureliaTemplating.useView)(_aureliaPal.PLATFORM.moduleName('./dragula-and-drop')), _dec23 = (0, _aureliaTemplating.customElement)('dragula-and-drop'), _dec24 = (0, _aureliaDependencyInjection.inject)(GLOBAL_OPTIONS), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = _dec8(_class = _dec9(_class = _dec10(_class = _dec11(_class = _dec12(_class = _dec13(_class = _dec14(_class = _dec15(_class = _dec16(_class = _dec17(_class = _dec18(_class = _dec19(_class = _dec20(_class = _dec21(_class = _dec22(_class = _dec23(_class = _dec24(_class = function () {
  function DragulaAndDrop(globalOptions) {
    _classCallCheck(this, DragulaAndDrop);

    this.dragula = {};
    this.globalOptions = globalOptions;
  }

  DragulaAndDrop.prototype.bind = function bind() {
    var _this = this;

    var boundOptions = this._setupOptions();

    var aureliaOptions = {
      isContainer: this._isContainer.bind(this),
      moves: this._moves.bind(this),
      accepts: this._accepts.bind(this),
      invalid: this._invalid.bind(this)
    };

    var options = Object.assign(aureliaOptions, boundOptions);
    this.dragula = new Dragula(options);

    this.dragula.on('drop', this._dropFunction.bind(this));

    this.dragula.on('drag', function (item, source, itemVM) {
      if (typeof _this.dragFn === 'function') _this.dragFn({ item: item, source: source, itemVM: itemVM });
    });

    this.dragula.on('dragend', function (item, itemVM) {
      if (typeof _this.dragEndFn === 'function') _this.dragEndFn({ item: item, itemVM: itemVM });
    });

    this.dragula.on('cloned', function (copy, item, type, itemVM) {
      if (typeof _this.clonedFn === 'function') _this.clonedFn({ copy: copy, item: item, type: type, itemVM: itemVM });
    });

    this.dragula.on('over', function (item, target, source, itemVM) {
      if (typeof _this.overFn === 'function') _this.overFn({ item: item, target: target, source: source, itemVM: itemVM });
    });

    this.dragula.on('out', function (item, target, source, itemVM) {
      if (typeof _this.outFn === 'function') _this.outFn({ item: item, target: target, source: source, itemVM: itemVM });
    });

    this.dragula.on('shadow', function (item, target, source, itemVM) {
      if (typeof _this.shadowFn === 'function') _this.shadowFn({ item: item, target: target, source: source, itemVM: itemVM });
    });
  };

  DragulaAndDrop.prototype.unbind = function unbind() {
    this.dragula.destroy();
  };

  DragulaAndDrop.prototype._dropFunction = function _dropFunction(item, target, source, sibling, itemVM, siblingVM) {
    this.dragula.cancel();
    if (typeof this.dropFn === 'function') this.dropFn({ item: item, target: target, source: source, sibling: sibling, itemVM: itemVM, siblingVM: siblingVM });
  };

  DragulaAndDrop.prototype._isContainer = function _isContainer(el) {
    if (!el) {
      return false;
    }
    if (typeof this.isContainer === 'function') {
      return this.isContainer({ item: el });
    }

    if (this.dragula.dragging) {
      return el.classList.contains(this.targetClass);
    }
    return el.classList.contains(this.sourceClass);
  };

  DragulaAndDrop.prototype._moves = function _moves(item, source, handle, sibling) {
    if (typeof this.moves === 'function') {
      return this.moves({ item: item, source: source, handle: handle, sibling: sibling });
    } else {
      return this.globalOptions.moves(item, source, handle, sibling);
    }
  };

  DragulaAndDrop.prototype._accepts = function _accepts(item, target, source, sibling) {
    if (typeof this.accepts === 'function') {
      return this.accepts({ item: item, target: target, source: source, sibling: sibling });
    } else {
      return this.globalOptions.accepts(item, target, source, sibling);
    }
  };

  DragulaAndDrop.prototype._invalid = function _invalid(item, handle) {
    if (typeof this.invalid === 'function') {
      return this.invalid({ item: item, handle: handle });
    } else {
      return this.globalOptions.invalid(item, handle);
    }
  };

  DragulaAndDrop.prototype._setupOptions = function _setupOptions() {
    var result = {
      containers: this._getOption('containers'),
      copy: this._convertToBooleanIfRequired(this._getOption('copy')),
      copySortSource: this._convertToBooleanIfRequired(this._getOption('copySortSource')),
      revertOnSpill: this._convertToBooleanIfRequired(this._getOption('revertOnSpill')),
      removeOnSpill: this._convertToBooleanIfRequired(this._getOption('removeOnSpill')),
      direction: this._getOption('direction'),
      ignoreInputTextSelection: this._convertToBooleanIfRequired(this._getOption('ignoreInputTextSelection')),
      mirrorContainer: this._getOption('mirrorContainer')
    };

    return result;
  };

  DragulaAndDrop.prototype._getOption = function _getOption(option) {
    if (this[option] == null) {
      return this.globalOptions[option];
    }
    return this[option];
  };

  DragulaAndDrop.prototype._convertToBooleanIfRequired = function _convertToBooleanIfRequired(option) {
    if (typeof option === 'function') {
      return option;
    }
    if (typeof option === 'string') {
      return option.toLowerCase() === 'true';
    }
    return new Boolean(option).valueOf();
  };

  return DragulaAndDrop;
}()) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class);


var MIN_TIME_BETWEEN_REDRAWS_MS = 20;

var Dragula = exports.Dragula = function () {
  function Dragula(options) {
    _classCallCheck(this, Dragula);

    var len = arguments.length;
    var globalOptions = _aureliaDependencyInjection.Container.instance.get(GLOBAL_OPTIONS);
    this.options = Object.assign({}, globalOptions, options);
    this._emitter = new Emitter();
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

  Dragula.prototype._events = function _events(remove) {
    var op = remove ? 'removeEventListener' : 'addEventListener';
    touchy(document.documentElement, op, 'mousedown', this.boundGrab);
    touchy(document.documentElement, op, 'mouseup', this.boundRelease);
  };

  Dragula.prototype._eventualMovements = function _eventualMovements(remove) {
    var op = remove ? 'removeEventListener' : 'addEventListener';
    touchy(document.documentElement, op, 'mousemove', this.boundStart);
  };

  Dragula.prototype._movements = function _movements(remove) {
    var op = remove ? 'removeEventListener' : 'addEventListener';
    touchy(document.documentElement, op, 'click', this.boundPreventGrabbed);
  };

  Dragula.prototype.destroy = function destroy() {
    this._events(true);
    this._release({});
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

    var ignore = Util.whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
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
    if (Util.isInput(item)) {
      item.focus();
    } else {
      e.preventDefault();
    }
  };

  Dragula.prototype._startBecauseMouseMoved = function _startBecauseMouseMoved(e) {
    if (!this._grabbed || this.dragging) {
      return;
    }
    if (Util.whichMouseButton(e) === 0) {
      this._release({});
      return;
    }

    if (e.clientX !== void 0 && e.clientX === this._moveX && e.clientY !== void 0 && e.clientY === this._moveY) {
      return;
    }
    if (this.options.ignoreInputTextSelection) {
      var clientX = Util.getCoord('clientX', e);
      var clientY = Util.getCoord('clientY', e);
      var elementBehindCursor = document.elementFromPoint(clientX, clientY);
      if (Util.isInput(elementBehindCursor)) {
        return;
      }
    }

    var grabbed = this._grabbed;
    this._eventualMovements(true);
    this._movements();
    this.end();
    this.start(grabbed);

    var offset = Util.getOffset(this._item);
    this._offsetX = Util.getCoord('pageX', e) - offset.left;
    this._offsetY = Util.getCoord('pageY', e) - offset.top;

    classes.add(this._copy || this._item, 'gu-transit');
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
    while (Util.getParent(item) && this.isContainer(Util.getParent(item)) === false) {
      if (this.options.invalid(item, handle)) {
        return;
      }
      item = Util.getParent(item);
      if (!item) {
        return;
      }
    }
    var source = Util.getParent(item);
    if (!source) {
      return;
    }
    if (this.options.invalid(item, handle)) {
      return;
    }

    var movable = this.options.moves(item, source, handle, Util.nextEl(item));
    if (!movable) {
      return;
    }

    return {
      item: item,
      source: source
    };
  };

  Dragula.prototype.manualStart = function manualStart(item) {
    var context = this._canStart(item);
    if (context) {
      this.start(context);
    }
  };

  Dragula.prototype.start = function start(context) {
    if (this._isCopy(context.item, context.source)) {
      this._copy = context.item.cloneNode(true);
      this._emitter.emit('cloned', this._copy, context.item, 'copy', Util.getViewModel(context.item));
    }

    this._source = context.source;
    this._item = context.item;
    this._initialSibling = context.item.nextSibling;
    this._currentSibling = Util.nextEl(context.item);

    this.dragging = true;
    this._emitter.emit('drag', this._item, this._source, Util.getViewModel(this._item));
  };

  Dragula.prototype.end = function end() {
    if (!this.dragging) {
      return;
    }
    var item = this._copy || this._item;
    this.drop(item, Util.getParent(item));
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
    var clientX = Util.getCoord('clientX', e);
    var clientY = Util.getCoord('clientY', e);
    var elementBehindCursor = Util.getElementBehindPoint(this._mirror, clientX, clientY);
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
      var parent = Util.getParent(this._item);
      if (parent) parent.removeChild(this._item);
    }
    if (this._isInitialPlacement(target)) {
      this._emitter.emit('cancel', item, this._source, this._source, Util.getViewModel(this._item));
    } else {
      this._emitter.emit('drop', item, target, this._source, this._currentSibling, Util.getViewModel(this._item), Util.getViewModel(this._currentSibling));
    }
    this._cleanup();
  };

  Dragula.prototype.remove = function remove() {
    if (!this.dragging) {
      return;
    }
    var item = this._copy || this._item;
    var parent = Util.getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    this._emitter.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source, Util.getViewModel(this._item));
    this._cleanup();
  };

  Dragula.prototype.cancel = function cancel(revert) {
    if (!this.dragging) {
      return;
    }
    var reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
    var item = this._copy || this._item;
    var parent = Util.getParent(item);
    if (this._copy && parent) {
      parent.removeChild(this._copy);
    }
    var initial = this._isInitialPlacement(parent);
    if (initial === false && !this._copy && reverts) {
      this._source.insertBefore(item, this._initialSibling);
    }
    if (initial || reverts) {
      this._emitter.emit('cancel', item, this._source, this._source, Util.getViewModel(this._item));
    } else {
      this._emitter.emit('drop', item, parent, this._source, this._currentSibling, Util.getViewModel(this._item), Util.getViewModel(this._currentSibling));
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
      this._emitter.emit('out', item, this._lastDropTarget, this._source, Util.getViewModel(item));
    }
    this._emitter.emit('dragend', item, Util.getViewModel(item));
    this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._lastRenderTime = this._lastDropTarget = null;
  };

  Dragula.prototype._isInitialPlacement = function _isInitialPlacement(target, s) {
    var sibling = void 0;
    if (s !== void 0) {
      sibling = s;
    } else if (this._mirror) {
      sibling = this._currentSibling;
    } else {
      sibling = (this._copy || this._item).nextSibling;
    }
    return target === this._source && sibling === this._initialSibling;
  };

  Dragula.prototype._findDropTarget = function _findDropTarget(elementBehindCursor, clientX, clientY) {
    var _this2 = this;

    var accepted = function accepted() {
      var droppable = _this2.isContainer(target);
      if (droppable === false) {
        return false;
      }

      var immediate = Util.getImmediateChild(target, elementBehindCursor);
      var reference = _this2.getReference(target, immediate, clientX, clientY);
      var initial = _this2._isInitialPlacement(target, reference);
      if (initial) {
        return true;
      }
      return _this2.options.accepts(_this2._item, target, _this2._source, reference);
    };

    var target = elementBehindCursor;
    while (target && !accepted()) {
      target = Util.getParent(target);
    }
    return target;
  };

  Dragula.prototype.drag = function drag(e) {
    var _this3 = this;

    e.preventDefault();
    if (!this._mirror) {
      return;
    }

    if (this._lastRenderTime !== null && Date.now() - this._lastRenderTime < MIN_TIME_BETWEEN_REDRAWS_MS) {
      return;
    }
    this._lastRenderTime = Date.now();

    var item = this._copy || this._item;

    var moved = function moved(type) {
      _this3._emitter.emit(type, item, _this3._lastDropTarget, _this3._source, Util.getViewModel(item));
    };
    var over = function over() {
      if (changed) {
        moved('over');
      }
    };
    var out = function out() {
      if (_this3._lastDropTarget) {
        moved('out');
      }
    };

    var clientX = Util.getCoord('clientX', e);
    var clientY = Util.getCoord('clientY', e);
    var x = clientX - this._offsetX;
    var y = clientY - this._offsetY;

    this._mirror.style.left = x + 'px';
    this._mirror.style.top = y + 'px';

    var elementBehindCursor = Util.getElementBehindPoint(this._mirror, clientX, clientY);
    var dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY);
    var changed = dropTarget !== null && dropTarget !== this._lastDropTarget;
    if (changed || dropTarget === null) {
      out();
      this._lastDropTarget = dropTarget;
      over();
    }
    var parent = Util.getParent(item);
    if (dropTarget === this._source && this._copy && !this.options.copySortSource) {
      if (parent) {
        parent.removeChild(item);
      }
      return;
    }
    var reference = void 0;
    var immediate = Util.getImmediateChild(dropTarget, elementBehindCursor);
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
    if (reference === null && changed || reference !== item && reference !== Util.nextEl(item)) {
      this._currentSibling = reference;
      dropTarget.insertBefore(item, reference);
      this._emitter.emit('shadow', item, dropTarget, this._source, Util.getViewModel(item));
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
    this._mirror = this._item.cloneNode(true);
    this._mirror.style.width = Util.getRectWidth(rect) + 'px';
    this._mirror.style.height = Util.getRectHeight(rect) + 'px';
    classes.rm(this._mirror, 'gu-transit');
    classes.add(this._mirror, 'gu-mirror');
    this.options.mirrorContainer.appendChild(this._mirror);
    touchy(document.documentElement, 'addEventListener', 'mousemove', this.boundDrag);
    classes.add(this.options.mirrorContainer, 'gu-unselectable');
    this._emitter.emit('cloned', this._mirror, this._item, 'mirror', Util.getViewModel(this._item));
  };

  Dragula.prototype.removeMirrorImage = function removeMirrorImage() {
    if (this._mirror) {
      classes.rm(this.options.mirrorContainer, 'gu-unselectable');
      touchy(document.documentElement, 'removeEventListener', 'mousemove', this.boundDrag);
      Util.getParent(this._mirror).removeChild(this._mirror);
      this._mirror = null;
    }
  };

  Dragula.prototype.getReference = function getReference(dropTarget, target, x, y) {
    var outside = function outside() {
      var len = dropTarget.children.length;
      var i = void 0;
      var el = void 0;
      var rect = void 0;
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
      return after ? Util.nextEl(target) : target;
    };

    var inside = function inside() {
      var rect = target.getBoundingClientRect();
      if (horizontal) {
        return resolve(x > rect.left + Util.getRectWidth(rect) / 2);
      }
      return resolve(y > rect.top + Util.getRectHeight(rect) / 2);
    };

    var horizontal = this.options.direction === 'horizontal';
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

var EventListener = function EventListener(func) {
  var once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  _classCallCheck(this, EventListener);

  this.func = func;
  this.once = once;
};

var Emitter = exports.Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.events = {};
  }

  Emitter.prototype.on = function on(type, fn) {
    var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var newEvent = new EventListener(fn, once);
    if (this.events[type] === undefined) {
      this.events[type] = [];
    }
    this.events[type].push(newEvent);
  };

  Emitter.prototype.once = function once(type, fn) {
    this.on(type, fn, true);
  };

  Emitter.prototype.off = function off(type, fn) {
    if (arguments.length === 1) {
      delete this.events[type];
    } else if (arguments.length === 0) {
      this.events = {};
    } else {
      var eventList = this.events[type];
      if (eventList) {
        var index = eventList.findIndex(function (x) {
          return x.func === fn;
        });
        if (index >= 0) eventList.splice(index, 1);
      }
    }
  };

  Emitter.prototype.destroy = function destroy() {
    this.events = {};
  };

  Emitter.prototype.emit = function emit() {
    var _this4 = this;

    var args = arguments ? [].concat(Array.prototype.slice.call(arguments)) : [];
    var type = args.shift();
    var et = (this.events[type] || []).slice(0);
    if (type === 'error' && !et.length) {
      throw args.length === 1 ? args[0] : args;
    }
    var toDeregister = [];
    et.forEach(function (listener) {
      listener.func.apply(listener, args);
      if (listener.once) {
        toDeregister.push(listener);
      }
    });
    toDeregister.forEach(function (listener) {
      _this4.off(type, listener.func);
    });
  };

  return Emitter;
}();

function moveBefore(array, itemMatcherFn, siblingMatcherFn) {
  var removedItem = remove(array, itemMatcherFn);
  var nextIndex = array.findIndex(siblingMatcherFn);
  array.splice(nextIndex >= 0 ? nextIndex : array.length, 0, removedItem);
}

function remove(array, matcherFn) {
  var index = array.findIndex(matcherFn);
  if (index >= 0) {
    return array.splice(index, 1)[0];
  }
}
var GLOBAL_OPTIONS = exports.GLOBAL_OPTIONS = 'GlobalOptions';

var DIRECTION = exports.DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

var Options = exports.Options = function () {
  function Options() {
    _classCallCheck(this, Options);

    this.moves = Options.always;
    this.accepts = Options.always;
    this.invalid = Options.invalidTarget;
    this.containers = [];
    this.isContainer = Options.never;
    this.copy = false;
    this.copySortSource = false;
    this.revertOnSpill = false;
    this.removeOnSpill = false;
    this.direction = DIRECTION.VERTICAL, this.ignoreInputTextSelection = true;
    this.mirrorContainer = document.body;
  }

  Options.always = function always() {
    return true;
  };

  Options.never = function never() {
    return false;
  };

  Options.invalidTarget = function invalidTarget() {
    return false;
  };

  return Options;
}();

var touch = {
  mouseup: 'touchend',
  mousedown: 'touchstart',
  mousemove: 'touchmove'
};
var pointers = {
  mouseup: 'pointerup',
  mousedown: 'pointerdown',
  mousemove: 'pointermove'
};
var microsoft = {
  mouseup: 'MSPointerUp',
  mousedown: 'MSPointerDown',
  mousemove: 'MSPointerMove'
};

function touchy(el, op, type, fn) {
  if (window.navigator.pointerEnabled) {
    el[op](pointers[type], fn);
  } else if (window.navigator.msPointerEnabled) {
    el[op](microsoft[type], fn);
  } else {
    el[op](touch[type], fn);
    el[op](type, fn);
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

  _Util.prototype.getViewModel = function getViewModel(element) {
    if (element && element.au && element.au.controller) {
      if (element.au.controller.viewModel.currentViewModel) return element.au.controller.viewModel.currentViewModel;else return element.au.controller.viewModel;
    }
    return null;
  };

  return _Util;
}();

var Util = new _Util();
exports.Util = Util;