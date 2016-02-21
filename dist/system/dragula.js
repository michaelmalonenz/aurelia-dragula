System.register(['babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check', 'aurelia-dependency-injection', './touchy', './options', './util', 'contra', 'crossvent', './classes'], function (_export) {
  var _createClass, _classCallCheck, inject, touchy, GLOBAL_OPTIONS, Options, Util, emitter, crossvent, classes, Dragula;

  return {
    setters: [function (_babelRuntimeHelpersCreateClass) {
      _createClass = _babelRuntimeHelpersCreateClass['default'];
    }, function (_babelRuntimeHelpersClassCallCheck) {
      _classCallCheck = _babelRuntimeHelpersClassCallCheck['default'];
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_touchy) {
      touchy = _touchy.touchy;
    }, function (_options) {
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
      Options = _options.Options;
    }, function (_util) {
      Util = _util.Util;
    }, function (_contra) {
      emitter = _contra.emitter;
    }, function (_crossvent) {
      crossvent = _crossvent;
    }, function (_classes) {
      classes = _classes;
    }],
    execute: function () {
      'use strict';

      Dragula = (function () {
        function Dragula(options) {
          _classCallCheck(this, _Dragula);

          var len = arguments.length;
          this.options = options || new Options();
          this.drake = emitter({
            containers: this.options.containers,
            start: this.manualStart.bind(this),
            end: this.end.bind(this),
            cancel: this.cancel.bind(this),
            remove: this.remove.bind(this),
            destroy: this.destroy.bind(this),
            dragging: false
          });

          if (this.options.removeOnSpill === true) {
            this.drake.on('over', spillOver).on('out', spillOut);
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
          this._renderTimer;
          this._lastDropTarget = null;
          this._grabbed;
        }

        _createClass(Dragula, [{
          key: 'on',
          value: function on(eventName, callback) {
            this.drake.on(eventName, callback);
          }
        }, {
          key: 'isContainer',
          value: function isContainer(el) {
            return this.drake.containers.indexOf(el) !== -1 || this.options.isContainer(el);
          }
        }, {
          key: '_events',
          value: function _events(remove) {
            var op = remove ? 'remove' : 'add';
            touchy(document.documentElement, op, 'mousedown', this._grab.bind(this));
            touchy(document.documentElement, op, 'mouseup', this._release.bind(this));
          }
        }, {
          key: '_eventualMovements',
          value: function _eventualMovements(remove) {
            var op = remove ? 'remove' : 'add';
            touchy(document.documentElement, op, 'mousemove', this._startBecauseMouseMoved.bind(this));
          }
        }, {
          key: '_movements',
          value: function _movements(remove) {
            var op = remove ? 'remove' : 'add';
            crossvent[op](document.documentElement, 'selectstart', this._preventGrabbed);
            crossvent[op](document.documentElement, 'click', this._preventGrabbed);
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
          }
        }, {
          key: '_startBecauseMouseMoved',
          value: function _startBecauseMouseMoved(e) {
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
          }
        }, {
          key: '_canStart',
          value: function _canStart(item) {
            if (this.drake.dragging && this._mirror) {
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
              this.drake.emit('cloned', this._copy, context.item, 'copy');
            }

            this._source = context.source;
            this._item = context.item;
            this._initialSibling = this._currentSibling = Util.nextEl(context.item);

            this.drake.dragging = true;
            this.drake.emit('drag', this._item, this._source);
          }
        }, {
          key: 'end',
          value: function end() {
            if (!this.drake.dragging) {
              return;
            }
            var item = this._copy || this._item;
            this.drop(item, Util.getParent(item));
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

            if (!this.drake.dragging) {
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
          }
        }, {
          key: 'drop',
          value: function drop(item, target) {
            var parent = Util.getParent(item);
            if (this._copy && this.options.copySortSource && target === this._source) {
              parent.removeChild(_item);
            }
            if (this._isInitialPlacement(target)) {
              this.drake.emit('cancel', item, this._source, this._source);
            } else {
              this.drake.emit('drop', item, target, this._source, this._currentSibling);
            }
            this._cleanup();
          }
        }, {
          key: 'remove',
          value: function remove() {
            if (!this.drake.dragging) {
              return;
            }
            var item = this._copy || this._item;
            var parent = Util.getParent(item);
            if (parent) {
              parent.removeChild(item);
            }
            this.drake.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source);
            this._cleanup();
          }
        }, {
          key: 'cancel',
          value: function cancel(revert) {
            if (!this.drake.dragging) {
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
              this.drake.emit('cancel', item, this._source, this._source);
            } else {
              this.drake.emit('drop', item, parent, this._source, this._currentSibling);
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
            if (this._renderTimer) {
              clearTimeout(this._renderTimer);
            }
            this.drake.dragging = false;
            if (this._lastDropTarget) {
              this.drake.emit('out', item, this._lastDropTarget, this._source);
            }
            this.drake.emit('dragend', item);
            this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._renderTimer = this._lastDropTarget = null;
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
              sibling = Util.nextEl(this._copy || this._item);
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
          }
        }, {
          key: 'drag',
          value: function drag(e) {
            var _this2 = this;

            if (!this._mirror) {
              return;
            }
            e.preventDefault();

            var moved = function moved(type) {
              _this2.drake.emit(type, item, _this2._lastDropTarget, _this2._source);
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
            var reference = undefined;
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
              this.drake.emit('shadow', item, dropTarget, this._source);
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
            if (this.drake.dragging) {
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
            this._mirror.style.width = Util.getRectWidth(rect) + 'px';
            this._mirror.style.height = Util.getRectHeight(rect) + 'px';
            classes.rm(this._mirror, 'gu-transit');
            classes.add(this._mirror, 'gu-mirror');
            this.options.mirrorContainer.appendChild(this._mirror);
            touchy(document.documentElement, 'add', 'mousemove', this.drag.bind(this));
            classes.add(this.options.mirrorContainer, 'gu-unselectable');
            this.drake.emit('cloned', this._mirror, this._item, 'mirror');
          }
        }, {
          key: 'removeMirrorImage',
          value: function removeMirrorImage() {
            if (this._mirror) {
              classes.rm(this.options.mirrorContainer, 'gu-unselectable');
              touchy(document.documentElement, 'remove', 'mousemove', this.drag.bind(this));
              Util.getParent(this._mirror).removeChild(this._mirror);
              this._mirror = null;
            }
          }
        }, {
          key: 'getReference',
          value: function getReference(dropTarget, target, x, y) {
            var horizontal = this.options.direction === 'horizontal';
            var reference = target !== dropTarget ? inside() : outside();
            return reference;

            outside = function () {
              var len = dropTarget.children.length;
              var i = undefined;
              var el = undefined;
              var rect = undefined;
              for (i = 0; i < len; i++) {
                el = dropTarget.children[i];
                rect = el.getBoundingClientRect();
                if (horizontal && rect.left > x) {
                  return el;
                }
                if (!horizontal && rect.top > y) {
                  return el;
                }
              }
              return null;
            };

            inside = function () {
              var rect = target.getBoundingClientRect();
              if (horizontal) {
                return resolve(x > rect.left + getRectWidth(rect) / 2);
              }
              return resolve(y > rect.top + getRectHeight(rect) / 2);
            };

            resolve = function (after) {
              return after ? Util.nextEl(target) : target;
            };
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
        }, {
          key: 'dragging',
          get: function get() {
            return this.drake.dragging;
          }
        }]);

        var _Dragula = Dragula;
        Dragula = inject(GLOBAL_OPTIONS)(Dragula) || Dragula;
        return Dragula;
      })();

      _export('Dragula', Dragula);
    }
  };
});