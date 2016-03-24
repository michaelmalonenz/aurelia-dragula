'use strict';

System.register(['aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', './options', './dragula'], function (_export, _context) {
  var customElement, bindable, noView, bindingMode, Container, Options, GLOBAL_OPTIONS, Dragula, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, DragulaAndDrop;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplating) {
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
      _export('DragulaAndDrop', DragulaAndDrop = (_dec = bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime }), _dec2 = bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime }), _dec3 = bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime }), _dec4 = bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime }), _dec5 = bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime }), _dec6 = bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime }), _dec7 = bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime }), _dec8 = bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime, defaultValue: true }), _dec9 = bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime }), _dec10 = bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime }), _dec11 = bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime }), _dec12 = bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime }), _dec13 = bindable({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drop-target' }), _dec14 = bindable({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drag-source' }), _dec15 = bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item, source) {} }), _dec16 = bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item, target, source, sibling) {} }), _dec17 = bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: function defaultValue(item) {} }), _dec18 = customElement('dragula-and-drop'), _dec19 = noView(), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = _dec8(_class = _dec9(_class = _dec10(_class = _dec11(_class = _dec12(_class = _dec13(_class = _dec14(_class = _dec15(_class = _dec16(_class = _dec17(_class = _dec18(_class = _dec19(_class = function () {
        function DragulaAndDrop() {
          _classCallCheck(this, DragulaAndDrop);

          this.dragula = {};
        }

        DragulaAndDrop.prototype.bind = function bind() {
          var _this = this;

          this.globalOptions = Container.instance.get(GLOBAL_OPTIONS);
          var boundOptions = this._setupOptions();

          var aureliaOptions = {
            isContainer: this._isContainer.bind(this),
            moves: this._moves.bind(this),
            accepts: this._accepts.bind(this),
            invalid: this._invalid.bind(this)
          };

          var options = Object.assign(aureliaOptions, boundOptions);
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
        };

        DragulaAndDrop.prototype.unbind = function unbind() {
          this.dragula.destroy();
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
      }()) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class));

      _export('DragulaAndDrop', DragulaAndDrop);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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
