define(['exports', 'babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check', 'babel-runtime/core-js/object/assign', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', './options', './dragula'], function (exports, _babelRuntimeHelpersCreateClass, _babelRuntimeHelpersClassCallCheck, _babelRuntimeCoreJsObjectAssign, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _options, _dragula) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var DragulaAndDrop = (function () {
    function DragulaAndDrop() {
      (0, _babelRuntimeHelpersClassCallCheck['default'])(this, _DragulaAndDrop);

      this.dragula = {};
    }

    (0, _babelRuntimeHelpersCreateClass['default'])(DragulaAndDrop, [{
      key: 'bind',
      value: function bind() {
        var _this = this;

        this.globalOptions = _aureliaDependencyInjection.Container.instance.get(_options.GLOBAL_OPTIONS);
        var boundOptions = this._setupOptions();

        var aureliaOptions = {
          isContainer: this._isContainer.bind(this),
          moves: this._moves.bind(this),
          accepts: this._accepts.bind(this),
          invalid: this._invalid.bind(this)
        };

        var options = (0, _babelRuntimeCoreJsObjectAssign['default'])(aureliaOptions, boundOptions);
        this.dragula = new _dragula.Dragula(options);

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
    DragulaAndDrop = (0, _aureliaTemplating.noView)()(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.customElement)('dragula-and-drop')(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: function defaultValue(item) {} })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: function defaultValue(item, target, source, sibling) {} })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: function defaultValue(item, source) {} })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: 'drag-source' })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: 'drop-target' })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'direction', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: true })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'copySortSource', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'copy', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'containers', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'invalid', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'accepts', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'moves', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    return DragulaAndDrop;
  })();

  exports.DragulaAndDrop = DragulaAndDrop;
});