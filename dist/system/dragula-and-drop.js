System.register(['babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check', 'babel-runtime/core-js/object/assign', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', './options', './dragula'], function (_export) {
  var _createClass, _classCallCheck, _Object$assign, customElement, bindable, noView, bindingMode, inject, Options, DIRECTION, GLOBAL_OPTIONS, Dragula, DragulaAndDrop;

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
      inject = _aureliaDependencyInjection.inject;
    }, function (_options) {
      Options = _options.Options;
      DIRECTION = _options.DIRECTION;
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
    }, function (_dragula) {
      Dragula = _dragula.Dragula;
    }],
    execute: function () {
      'use strict';

      DragulaAndDrop = (function () {
        function DragulaAndDrop(globalOptions) {
          _classCallCheck(this, _DragulaAndDrop);

          this.globalOptions = globalOptions;
          this.drake;
        }

        _createClass(DragulaAndDrop, [{
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

            var options = _Object$assign({}, this.globalOptions, boundOptions);
            this.drake = new Dragula(options);
          }
        }, {
          key: 'unbind',
          value: function unbind() {
            this.drake.destroy();
          }
        }]);

        var _DragulaAndDrop = DragulaAndDrop;
        DragulaAndDrop = noView()(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = inject(GLOBAL_OPTIONS)(DragulaAndDrop) || DragulaAndDrop;
        DragulaAndDrop = customElement('dragula-and-drop')(DragulaAndDrop) || DragulaAndDrop;
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