'use strict';

System.register(['aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-pal', './options', './dragula'], function (_export, _context) {
  "use strict";

  var customElement, bindable, useView, bindingMode, inject, PLATFORM, Options, GLOBAL_OPTIONS, Dragula, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class, DragulaAndDrop;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplating) {
      customElement = _aureliaTemplating.customElement;
      bindable = _aureliaTemplating.bindable;
      useView = _aureliaTemplating.useView;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaPal) {
      PLATFORM = _aureliaPal.PLATFORM;
    }, function (_options) {
      Options = _options.Options;
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
    }, function (_dragula) {
      Dragula = _dragula.Dragula;
    }],
    execute: function () {
      _export('DragulaAndDrop', DragulaAndDrop = (_dec = bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime }), _dec2 = bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime }), _dec3 = bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime }), _dec4 = bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime }), _dec5 = bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime }), _dec6 = bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime }), _dec7 = bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime }), _dec8 = bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime, defaultValue: true }), _dec9 = bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime }), _dec10 = bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime }), _dec11 = bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime }), _dec12 = bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime }), _dec13 = bindable({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drop-target' }), _dec14 = bindable({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drag-source' }), _dec15 = bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime }), _dec16 = bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime }), _dec17 = bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime }), _dec18 = bindable({ name: 'clonedFn', attribute: 'cloned-fn', defaultBindingMode: bindingMode.oneTime }), _dec19 = bindable({ name: 'overFn', attribute: 'over-fn', defaultBindingMode: bindingMode.oneTime }), _dec20 = bindable({ name: 'outFn', attribute: 'out-fn', defaultBindingMode: bindingMode.oneTime }), _dec21 = bindable({ name: 'shadowFn', attribute: 'shadow-fn', defaultBindingMode: bindingMode.oneTime }), _dec22 = customElement('dragula-and-drop'), _dec23 = useView('./dragula-and-drop.html'), _dec24 = inject(GLOBAL_OPTIONS), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = _dec8(_class = _dec9(_class = _dec10(_class = _dec11(_class = _dec12(_class = _dec13(_class = _dec14(_class = _dec15(_class = _dec16(_class = _dec17(_class = _dec18(_class = _dec19(_class = _dec20(_class = _dec21(_class = _dec22(_class = _dec23(_class = _dec24(_class = function () {
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
            invalid: this._invalid.bind(this),
            copy: this._copy.bind(this)
          };

          this.options = Object.assign(aureliaOptions, boundOptions);
          this.dragula = new Dragula(this.options);

          this.dragula.on('drop', this._dropFunction.bind(this));

          this.dragula.on('drag', function (item, source, itemVM) {
            if (typeof _this.dragFn === 'function') _this.dragFn({ item: item, source: source, itemVM: itemVM });
          });

          this.dragula.on('dragend', function (item, itemVM) {
            if (typeof _this.dragEndFn === 'function') _this.dragEndFn({ item: item, itemVM: itemVM });
          });

          this.dragula.on('cloned', function (copy, item, type, itemVM) {
            if (typeof _this.clonedFn === 'function') _this.clonedFn({ copy: copy, item: item, type: type, itemVM: itemVM });
          });

          this.dragula.on('over', function (item, target, source, itemVM) {
            if (typeof _this.overFn === 'function') _this.overFn({ item: item, target: target, source: source, itemVM: itemVM });
          });

          this.dragula.on('out', function (item, target, source, itemVM) {
            if (typeof _this.outFn === 'function') _this.outFn({ item: item, target: target, source: source, itemVM: itemVM });
          });

          this.dragula.on('shadow', function (item, target, source, itemVM) {
            if (typeof _this.shadowFn === 'function') _this.shadowFn({ item: item, target: target, source: source, itemVM: itemVM });
          });
        };

        DragulaAndDrop.prototype.unbind = function unbind() {
          this.dragula.destroy();
        };

        DragulaAndDrop.prototype._dropFunction = function _dropFunction(item, target, source, sibling, itemVM, siblingVM) {
          if (typeof this.dropFn === 'function') this.dropFn({ item: item, target: target, source: source, sibling: sibling, itemVM: itemVM, siblingVM: siblingVM });
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

        DragulaAndDrop.prototype._copy = function _copy(item, container) {
          if (typeof this.copy === 'function') {
            return this.copy({ item: item, container: container });
          }
          if (typeof this.globalOptions.copy === 'function') {
            return this.globalOptions.copy({ item: item, container: container });
          }
          return this._convertToBooleanIfRequired(this._getOption('copy'));
        };

        DragulaAndDrop.prototype._setupOptions = function _setupOptions() {
          var result = {
            containers: this._getOption('containers'),
            copySortSource: this._convertToBooleanIfRequired(this._getOption('copySortSource')),
            revertOnSpill: this._convertToBooleanIfRequired(this._getOption('revertOnSpill')),
            removeOnSpill: this._convertToBooleanIfRequired(this._getOption('removeOnSpill')),
            direction: this._getOption('direction'),
            ignoreInputTextSelection: this._convertToBooleanIfRequired(this._getOption('ignoreInputTextSelection')),
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

        DragulaAndDrop.prototype._convertToBooleanIfRequired = function _convertToBooleanIfRequired(option) {
          if (typeof option === 'function') {
            return option;
          }
          if (typeof option === 'string') {
            return option.toLowerCase() === 'true';
          }
          return new Boolean(option).valueOf();
        };

        return DragulaAndDrop;
      }()) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class));

      _export('DragulaAndDrop', DragulaAndDrop);
    }
  };
});