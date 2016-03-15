define(['exports', 'babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check', 'babel-runtime/core-js/object/assign', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', './options', './dragula'], function (exports, _babelRuntimeHelpersCreateClass, _babelRuntimeHelpersClassCallCheck, _babelRuntimeCoreJsObjectAssign, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _options, _dragula) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var DragulaAndDrop = (function () {
    function DragulaAndDrop(globalOptions) {
      (0, _babelRuntimeHelpersClassCallCheck['default'])(this, _DragulaAndDrop);

      this.globalOptions = globalOptions;
      this.drake;
    }

    (0, _babelRuntimeHelpersCreateClass['default'])(DragulaAndDrop, [{
      key: 'bind',
      value: function bind() {
        var boundOptions = {
          moves: this.moves,
          accepts: this.accepts,
          invalid: this.invalid,
          containers: this.containers,
          isContainer: this.isContainer,
          copy: this.copy,
          copySortSource: this.copySortSource,
          revertOnSpill: this.revertOnSpill,
          removeOnSpill: this.removeOnSpill,
          direction: this.direction,
          ignoreInputTextSelection: this.ignoreInputTextSelection,
          mirrorContainer: this.mirrorContainer
        };

        var options = (0, _babelRuntimeCoreJsObjectAssign['default'])({}, this.globalOptions, boundOptions);
        this.drake = new _dragula.Dragula(options);
      }
    }, {
      key: 'unbind',
      value: function unbind() {
        this.drake.destroy();
      }
    }]);
    var _DragulaAndDrop = DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.noView)()(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaDependencyInjection.inject)(_options.GLOBAL_OPTIONS)(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.customElement)('dragula-and-drop')(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'direction', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
    DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
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