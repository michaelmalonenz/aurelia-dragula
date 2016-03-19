System.register(['babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check', 'babel-runtime/core-js/object/assign', 'aurelia-templating', 'aurelia-binding', './options', './dragula'], function (_export) {
  var _createClass, _classCallCheck, _Object$assign, customElement, bindable, noView, bindingMode, Options, Dragula, DragulaAndDrop;

  return {
    setters: [function (_babelRuntimeHelpersCreateClass) {
      _createClass = _babelRuntimeHelpersCreateClass['default'];
    }, function (_babelRuntimeHelpersClassCallCheck) {
      _classCallCheck = _babelRuntimeHelpersClassCallCheck['default'];
    }, function (_babelRuntimeCoreJsObjectAssign) {
      _Object$assign = _babelRuntimeCoreJsObjectAssign['default'];
    }, function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
      noView = _aureliaTemplating.noView;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_options) {
      Options = _options.Options;
    }, function (_dragula) {
      Dragula = _dragula.Dragula;
    }],
    execute: function () {
      'use strict';

      DragulaAndDrop = (function () {
        function DragulaAndDrop() {
          _classCallCheck(this, _DragulaAndDrop);

          this.drake;
        }

        _createClass(DragulaAndDrop, [{
          key: 'bind',
          value: function bind() {
            var _this = this;

            var boundOptions = {
              containers: this.containers,
              copy: this.copy,
              copySortSource: this.copySortSource,
              revertOnSpill: this.revertOnSpill,
              removeOnSpill: this.removeOnSpill,
              direction: this.direction,
              ignoreInputTextSelection: this.ignoreInputTextSelection,
              mirrorContainer: this.mirrorContainer
            };

            var aureliaOptions = {
              isContainer: function isContainer(el) {
                if (!el) {
                  return false;
                }
                if (typeof _this.isContainer === 'function') {
                  return _this.isContainer({ item: el });
                }

                if (_this.dragula.dragging) {
                  return el.classList.contains(_this.targetClass);
                }
                return el.classList.contains(_this.sourceClass);
              },
              moves: function moves(item, source, handle, sibling) {
                if (typeof _this.moves === 'function') {
                  return _this.moves({ item: item, source: source, handle: handle, sibling: sibling });
                }
              },
              accepts: function accepts(item, target, source, currentSibling) {
                if (typeof _this.accepts === 'function') {
                  return _this.accepts({ item: item, target: target, source: source, currentSibling: currentSibling });
                }
              },
              invalid: function invalid(item, handle) {
                if (typeof _this.invalid === 'function') {
                  return _this.invalid({ item: item, handle: handle });
                }
              }
            };

            var options = _Object$assign(aureliaOptions, boundOptions);
            this.dragula = new Dragula(options);

            this.dragula.on('drop', function (item, target, source, sibling) {
              _this.dragula.cancel();
              _this.dropFn({ item: item, target: target, source: source, sibling: sibling });
            });

            this.dragula.on('drag', function (item, source) {
              _this.dragFn({ item: item, source: source });
            });

            this.dragula.on('dragend', function (item) {
              _this.dragEndFn({ item: item });
            });
          }
        }, {
          key: 'unbind',
          value: function unbind() {
            this.dragula.destroy();
          }
        }]);

        var _DragulaAndDrop = DragulaAndDrop;
        DragulaAndDrop = noView()(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = customElement('dragula-and-drop')(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item) {} })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item, target, source, sibling) {} })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item, source) {} })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'sourceClass', attribute: 'source-class', defaultValue: 'drag-source', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'targetClass', attribute: 'target-class', defaultValue: 'drop-target', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        return DragulaAndDrop;
      })();

      _export('DragulaAndDrop', DragulaAndDrop);
    }
  };
});