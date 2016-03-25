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