'use strict';

System.register(['aurelia-dependency-injection', './touchy', './options', './util', './emitter', './classes'], function (_export, _context) {
  var inject, Container, touchy, GLOBAL_OPTIONS, Options, Util, Emitter, classes, _createClass, MIN_TIME_BETWEEN_REDRAWS_MS, Dragula;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      Container = _aureliaDependencyInjection.Container;
    }, function (_touchy) {
      touchy = _touchy.touchy;
    }, function (_options) {
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
      Options = _options.Options;
    }, function (_util) {
      Util = _util.Util;
    }, function (_emitter) {
      Emitter = _emitter.Emitter;
    }, function (_classes) {
      classes = _classes;
    }],
    execute: function () {
      _createClass = function () {
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

      MIN_TIME_BETWEEN_REDRAWS_MS = 20;

      _export('Dragula', Dragula = function () {
        function Dragula(options) {
          _classCallCheck(this, Dragula);

          var len = arguments.length;
          var globalOptions = Container.instance.get(GLOBAL_OPTIONS);
          this.options = Object.assign({}, globalOptions, options);
          this._emitter = new Emitter();
          this.dragging = false;

          if (this.options.removeOnSpill === true) {
            this._emitter.on('over', this.spillOver.bind(this));
            this._emitter.on('out', this.spillOut.bind(this));
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
          touchy(document.body, op, 'mousedown', this._grab.bind(this));
          touchy(document.body, op, 'mouseup', this._release.bind(this));
        };

        Dragula.prototype._eventualMovements = function _eventualMovements(remove) {
          var op = remove ? 'removeEventListener' : 'addEventListener';
          touchy(document.body, op, 'mousemove', this._startBecauseMouseMoved.bind(this));
        };

        Dragula.prototype._movements = function _movements(remove) {
          var op = remove ? 'removeEventListener' : 'addEventListener';
          touchy(document.body, op, 'click', this._preventGrabbed.bind(this));
        };

        Dragula.prototype.destroy = function destroy() {
          this._events(true);
          this._release({});
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
          if (e.type === 'mousedown') {
            if (Util.isInput(item)) {
              item.focus();
            } else {
                e.preventDefault();
              }
          }
        };

        Dragula.prototype._startBecauseMouseMoved = function _startBecauseMouseMoved(e) {
          if (!this._grabbed) {
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
            this._emitter.emit('cloned', this._copy, context.item, 'copy');
          }

          this._source = context.source;
          this._item = context.item;
          this._initialSibling = context.item.nextSibling;
          this._currentSibling = Util.nextEl(context.item);

          this.dragging = true;
          this._emitter.emit('drag', this._item, this._source);
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
          var parent = Util.getParent(item);
          if (this._copy && this.options.copySortSource && target === this._source) {
            parent.removeChild(_item);
          }
          if (this._isInitialPlacement(target)) {
            this._emitter.emit('cancel', item, this._source, this._source);
          } else {
            this._emitter.emit('drop', item, target, this._source, this._currentSibling);
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
          this._emitter.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source);
          this._cleanup();
        };

        Dragula.prototype.cancel = function cancel(revert) {
          if (!this.dragging) {
            return;
          }
          var reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
          var item = this._copy || this._item;
          var parent = Util.getParent(item);
          if (parent === this._source && this._copy) {
            parent.removeChild(this._copy);
          }
          var initial = this._isInitialPlacement(parent);
          if (initial === false && !this._copy && reverts) {
            this._source.insertBefore(item, this._initialSibling);
          }
          if (initial || reverts) {
            this._emitter.emit('cancel', item, this._source, this._source);
          } else {
            this._emitter.emit('drop', item, parent, this._source, this._currentSibling);
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
            this._emitter.emit('out', item, this._lastDropTarget, this._source);
          }
          this._emitter.emit('dragend', item);
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
          var _this = this;

          var accepted = function accepted() {
            var droppable = _this.isContainer(target);
            if (droppable === false) {
              return false;
            }

            var immediate = Util.getImmediateChild(target, elementBehindCursor);
            var reference = _this.getReference(target, immediate, clientX, clientY);
            var initial = _this._isInitialPlacement(target, reference);
            if (initial) {
              return true;
            }
            return _this.options.accepts(_this._item, target, _this._source, reference);
          };

          var target = elementBehindCursor;
          while (target && !accepted()) {
            target = Util.getParent(target);
          }
          return target;
        };

        Dragula.prototype.drag = function drag(e) {
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
            _this2._emitter.emit(type, item, _this2._lastDropTarget, _this2._source);
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

          var clientX = Util.getCoord('clientX', e);
          var clientY = Util.getCoord('clientY', e);
          var x = clientX - this._offsetX;
          var y = clientY - this._offsetY;

          this._mirror.style.left = x + 'px';
          this._mirror.style.top = y + 'px';

          var item = this._copy || this._item;
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
            this._emitter.emit('shadow', item, dropTarget, this._source);
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
          touchy(document.documentElement, 'addEventListener', 'mousemove', this.drag.bind(this));
          classes.add(this.options.mirrorContainer, 'gu-unselectable');
          this._emitter.emit('cloned', this._mirror, this._item, 'mirror');
        };

        Dragula.prototype.removeMirrorImage = function removeMirrorImage() {
          if (this._mirror) {
            classes.rm(this.options.mirrorContainer, 'gu-unselectable');
            touchy(document.documentElement, 'removeEventListener', 'mousemove', this.drag.bind(this));
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
          return typeof this.options.copy === 'boolean' ? this.options.copy : this.options.copy(item, container);
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
      }());

      _export('Dragula', Dragula);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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
