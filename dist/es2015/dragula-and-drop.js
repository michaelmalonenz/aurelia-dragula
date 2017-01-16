var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class;

import { customElement, bindable, inlineView } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';

import { Options, GLOBAL_OPTIONS } from './options';
import { Dragula } from './dragula';

export let DragulaAndDrop = (_dec = bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime }), _dec2 = bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime }), _dec3 = bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime }), _dec4 = bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime }), _dec5 = bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime }), _dec6 = bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime }), _dec7 = bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime }), _dec8 = bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime, defaultValue: true }), _dec9 = bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime }), _dec10 = bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime }), _dec11 = bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime }), _dec12 = bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime }), _dec13 = bindable({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drop-target' }), _dec14 = bindable({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drag-source' }), _dec15 = bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime }), _dec16 = bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime }), _dec17 = bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime }), _dec18 = bindable({ name: 'clonedFn', attribute: 'cloned-fn', defaultBindingMode: bindingMode.oneTime }), _dec19 = bindable({ name: 'overFn', attribute: 'over-fn', defaultBindingMode: bindingMode.oneTime }), _dec20 = bindable({ name: 'outFn', attribute: 'out-fn', defaultBindingMode: bindingMode.oneTime }), _dec21 = bindable({ name: 'shadowFn', attribute: 'shadow-fn', defaultBindingMode: bindingMode.oneTime }), _dec22 = customElement('dragula-and-drop'), _dec23 = inlineView('<template><require from="./dragula.css"></require></template>'), _dec24 = inject(GLOBAL_OPTIONS), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = _dec8(_class = _dec9(_class = _dec10(_class = _dec11(_class = _dec12(_class = _dec13(_class = _dec14(_class = _dec15(_class = _dec16(_class = _dec17(_class = _dec18(_class = _dec19(_class = _dec20(_class = _dec21(_class = _dec22(_class = _dec23(_class = _dec24(_class = class DragulaAndDrop {

  constructor(globalOptions) {
    this.dragula = {};
    this.globalOptions = globalOptions;
  }

  bind() {
    let boundOptions = this._setupOptions();

    let aureliaOptions = {
      isContainer: this._isContainer.bind(this),
      moves: this._moves.bind(this),
      accepts: this._accepts.bind(this),
      invalid: this._invalid.bind(this)
    };

    let options = Object.assign(aureliaOptions, boundOptions);
    this.dragula = new Dragula(options);

    this.dragula.on('drop', this._dropFunction.bind(this));

    this.dragula.on('drag', (item, source, itemVM) => {
      if (typeof this.dragFn === 'function') this.dragFn({ item, source, itemVM });
    });

    this.dragula.on('dragend', (item, itemVM) => {
      if (typeof this.dragEndFn === 'function') this.dragEndFn({ item, itemVM });
    });

    this.dragula.on('cloned', (copy, item, type, itemVM) => {
      if (typeof this.clonedFn === 'function') this.clonedFn({ copy, item, type, itemVM });
    });

    this.dragula.on('over', (item, target, source, itemVM) => {
      if (typeof this.overFn === 'function') this.overFn({ item, target, source, itemVM });
    });

    this.dragula.on('out', (item, target, source, itemVM) => {
      if (typeof this.outFn === 'function') this.outFn({ item, target, source, itemVM });
    });

    this.dragula.on('shadow', (item, target, source, itemVM) => {
      if (typeof this.shadowFn === 'function') this.shadowFn({ item, target, source, itemVM });
    });
  }

  unbind() {
    this.dragula.destroy();
  }

  _dropFunction(item, target, source, sibling, itemVM, siblingVM) {
    this.dragula.cancel();
    if (typeof this.dropFn === 'function') this.dropFn({ item, target, source, sibling, itemVM, siblingVM });
  }

  _isContainer(el) {
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

  _moves(item, source, handle, sibling) {
    if (typeof this.moves === 'function') {
      return this.moves({ item, source, handle, sibling });
    } else {
      return this.globalOptions.moves(item, source, handle, sibling);
    }
  }

  _accepts(item, target, source, sibling) {
    if (typeof this.accepts === 'function') {
      return this.accepts({ item, target, source, sibling });
    } else {
      return this.globalOptions.accepts(item, target, source, sibling);
    }
  }

  _invalid(item, handle) {
    if (typeof this.invalid === 'function') {
      return this.invalid({ item, handle });
    } else {
      return this.globalOptions.invalid(item, handle);
    }
  }

  _setupOptions() {
    let result = {
      containers: this._getOption('containers'),
      copy: this._convertToBooleanIfRequired(this._getOption('copy')),
      copySortSource: this._convertToBooleanIfRequired(this._getOption('copySortSource')),
      revertOnSpill: this._convertToBooleanIfRequired(this._getOption('revertOnSpill')),
      removeOnSpill: this._convertToBooleanIfRequired(this._getOption('removeOnSpill')),
      direction: this._getOption('direction'),
      ignoreInputTextSelection: this._convertToBooleanIfRequired(this._getOption('ignoreInputTextSelection')),
      mirrorContainer: this._getOption('mirrorContainer')
    };

    return result;
  }

  _getOption(option) {
    if (this[option] == null) {
      return this.globalOptions[option];
    }
    return this[option];
  }

  _convertToBooleanIfRequired(option) {
    if (typeof option === 'function') {
      return option;
    }
    if (typeof option === 'string') {
      return option.toLowerCase() === 'true';
    }
    return new Boolean(option).valueOf();
  }
}) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class);