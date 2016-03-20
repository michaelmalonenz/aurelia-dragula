System.register(['babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check', 'babel-runtime/core-js/object/assign', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', './options', './dragula'], function (_export) {
  var _createClass, _classCallCheck, _Object$assign, customElement, bindable, noView, bindingMode, Container, Options, GLOBAL_OPTIONS, Dragula, DragulaAndDrop;

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
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_options) {
      Options = _options.Options;
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
    }, function (_dragula) {
      Dragula = _dragula.Dragula;
    }],
    execute: function () {
      'use strict';

      DragulaAndDrop = (function () {
        function DragulaAndDrop() {
          _classCallCheck(this, _DragulaAndDrop);

          this.dragula = {};
        }

        _createClass(DragulaAndDrop, [{
          key: 'bind',
          value: function bind() {
            var _this = this;

            this.globalOptions = Container.instance.get(GLOBAL_OPTIONS);
            var boundOptions = this._setupOptions();

            var aureliaOptions = {
              isContainer: this._isContainer.bind(this),
              moves: this._moves.bind(this),
              accepts: this._accepts.bind(this),
              invalid: this._invalid.bind(this)
            };

            var options = _Object$assign(aureliaOptions, boundOptions);
            this.dragula = new Dragula(options);

            this.dragula.on('drop', function (item, target, source, sibling) {
              _this.dragula.cancel(false);
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
        }, {
          key: '_isContainer',
          value: function _isContainer(el) {
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
          }
        }, {
          key: '_moves',
          value: function _moves(item, source, handle, sibling) {
            if (typeof this.moves === 'function') {
              return this.moves({ item: item, source: source, handle: handle, sibling: sibling });
            } else {
              return this.globalOptions.moves(item, source, handle, sibling);
            }
          }
        }, {
          key: '_accepts',
          value: function _accepts(item, target, source, sibling) {
            if (typeof this.accepts === 'function') {
              return this.accepts({ item: item, target: target, source: source, sibling: sibling });
            } else {
              return this.globalOptions.accepts(item, target, source, sibling);
            }
          }
        }, {
          key: '_invalid',
          value: function _invalid(item, handle) {
            if (typeof this.invalid === 'function') {
              return this.invalid({ item: item, handle: handle });
            } else {
              return this.globalOptions.invalid(item, handle);
            }
          }
        }, {
          key: '_setupOptions',
          value: function _setupOptions() {
            var result = {
              containers: this._getOption('containers'),
              copy: this._getOption('copy'),
              copySortSource: this._getOption('copySortSource'),
              revertOnSpill: this._getOption('revertOnSpill'),
              removeOnSpill: this._getOption('removeOnSpill'),
              direction: this._getOption('direction'),
              ignoreInputTextSelection: this._getOption('ignoreInputTextSelection'),
              mirrorContainer: this._getOption('mirrorContainer')
            };
            return result;
          }
        }, {
          key: '_getOption',
          value: function _getOption(option) {
            if (this[option] == null) {
              return this.globalOptions[option];
            }
            return this[option];
          }
        }]);

        var _DragulaAndDrop = DragulaAndDrop;
        DragulaAndDrop = noView()(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = customElement('dragula-and-drop')(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item) {} })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item, target, source, sibling) {} })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item, source) {} })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drag-source' })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drop-target' })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime, defaultValue: true })(DragulaAndDrop) || DragulaAndDrop;
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