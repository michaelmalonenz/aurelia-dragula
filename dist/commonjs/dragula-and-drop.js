'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _aureliaTemplating = require('aurelia-templating');

var _aureliaBinding = require('aurelia-binding');

var _options = require('./options');

var _dragula = require('./dragula');

var DragulaAndDrop = (function () {
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
            return _this.isContainer({ el: el });
          }

          if (_this.dragula.dragging) {
            return el.classList.contains(_this.targetClass);
          }
          return el.classList.contains(_this.sourceClass);
        },
        moves: function moves(item, source, handle, sibling) {
          return _this.moves({ item: item, source: source, handle: handle, sibling: sibling });
        },
        accepts: function accepts(item, target, source, currentSibling) {
          return _this.accepts({ item: item, target: target, source: source, currentSibling: currentSibling });
        },
        invalid: function invalid(item, handle) {
          return _this.invalid({ item: item, handle: handle });
        }
      };

      var options = _Object$assign(aureliaOptions, boundOptions);
      this.dragula = new _dragula.Dragula(options);

      this.dragula.on('drop', function (el, target, source, sibling) {
        _this.dragula.cancel();
        _this.dropFn({ el: el, target: target, source: source, sibling: sibling });
      });
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      this.dragula.destroy();
    }
  }]);

  var _DragulaAndDrop = DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.noView)()(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.customElement)('dragula-and-drop')(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'sourceClass', attribute: 'source-class', defaultValue: 'drag-source', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'targetClass', attribute: 'target-class', defaultValue: 'drop-target', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'direction', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'copySortSource', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'copy', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'containers', defaultBindingMode: _aureliaBinding.bindingMode.oneTime })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'invalid', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: _options.Options.invalidTarget })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'accepts', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: _options.Options.always })(DragulaAndDrop) || DragulaAndDrop;
  DragulaAndDrop = (0, _aureliaTemplating.bindable)({ name: 'moves', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: _options.Options.always })(DragulaAndDrop) || DragulaAndDrop;
  return DragulaAndDrop;
})();

exports.DragulaAndDrop = DragulaAndDrop;