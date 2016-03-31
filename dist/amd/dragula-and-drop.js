define(['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', './options', './dragula'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _options, _dragula) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DragulaAndDrop = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class;

  var DragulaAndDrop = exports.DragulaAndDrop = (_dec = (0, _aureliaTemplating.bindable)({ name: 'moves', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec2 = (0, _aureliaTemplating.bindable)({ name: 'accepts', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec3 = (0, _aureliaTemplating.bindable)({ name: 'invalid', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec4 = (0, _aureliaTemplating.bindable)({ name: 'containers', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec5 = (0, _aureliaTemplating.bindable)({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec6 = (0, _aureliaTemplating.bindable)({ name: 'copy', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec7 = (0, _aureliaTemplating.bindable)({ name: 'copySortSource', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec8 = (0, _aureliaTemplating.bindable)({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: true }), _dec9 = (0, _aureliaTemplating.bindable)({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec10 = (0, _aureliaTemplating.bindable)({ name: 'direction', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec11 = (0, _aureliaTemplating.bindable)({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec12 = (0, _aureliaTemplating.bindable)({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec13 = (0, _aureliaTemplating.bindable)({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: 'drop-target' }), _dec14 = (0, _aureliaTemplating.bindable)({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: _aureliaBinding.bindingMode.oneTime, defaultValue: 'drag-source' }), _dec15 = (0, _aureliaTemplating.bindable)({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec16 = (0, _aureliaTemplating.bindable)({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec17 = (0, _aureliaTemplating.bindable)({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec18 = (0, _aureliaTemplating.customElement)('dragula-and-drop'), _dec19 = (0, _aureliaTemplating.inlineView)('<template><require from="./dragula.css"></require></template>'), _dec20 = (0, _aureliaDependencyInjection.inject)(_options.GLOBAL_OPTIONS), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = _dec8(_class = _dec9(_class = _dec10(_class = _dec11(_class = _dec12(_class = _dec13(_class = _dec14(_class = _dec15(_class = _dec16(_class = _dec17(_class = _dec18(_class = _dec19(_class = _dec20(_class = function () {
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
      this.dragula = new _dragula.Dragula(options);

      this.dragula.on('drop', this._dropFunction.bind(this));

      this.dragula.on('drag', function (item, source) {
        if (typeof _this.dragFn === 'function') _this.dragFn({ item: item, source: source });
      });

      this.dragula.on('dragend', function (item) {
        if (typeof _this.dragEndFn === 'function') _this.dragEndFn({ item: item });
      });
    };

    DragulaAndDrop.prototype.unbind = function unbind() {
      this.dragula.destroy();
    };

    DragulaAndDrop.prototype._dropFunction = function _dropFunction(item, target, source, sibling) {
      this.dragula.cancel();
      if (typeof this.dropFn === 'function') this.dropFn({ item: item, target: target, source: source, sibling: sibling });
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
        copy: this._getOption('copy'),
        copySortSource: this._getOption('copySortSource'),
        revertOnSpill: this._getOption('revertOnSpill'),
        removeOnSpill: this._getOption('removeOnSpill'),
        direction: this._getOption('direction'),
        ignoreInputTextSelection: this._getOption('ignoreInputTextSelection'),
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

    return DragulaAndDrop;
  }()) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
});