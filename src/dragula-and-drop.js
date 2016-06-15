import {customElement, bindable, noView} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';

import {Options, GLOBAL_OPTIONS} from './options';
import {Dragula} from './dragula';
import 'dragula.css!';

@bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime, defaultValue: true })
@bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drop-target' })
@bindable({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drag-source' })
@bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime })
@customElement('dragula-and-drop')
@noView()
@inject(GLOBAL_OPTIONS)
export class DragulaAndDrop {

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
      if (typeof this.dragFn === 'function')
        this.dragFn({ item: item, source: source, itemVM: itemVM });
    });

    this.dragula.on('dragend', (item, itemVM) => {
      if (typeof this.dragEndFn === 'function')
        this.dragEndFn({ item: item, itemVM: itemVM });
    })
  }

  unbind() {
    this.dragula.destroy();
  }

  _dropFunction(item, target, source, sibling, itemVM, siblingVM) {
    this.dragula.cancel();
    if (typeof this.dropFn === 'function')
      this.dropFn({ item: item, target: target, source: source, sibling: sibling, itemVM: itemVM, siblingVM: siblingVM });
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
      return this.moves({ item: item, source: source, handle: handle, sibling: sibling });
    }
    else {
      return this.globalOptions.moves(item, source, handle, sibling);
    }
  }

  _accepts(item, target, source, sibling) {
    if (typeof this.accepts === 'function') {
      return this.accepts({ item: item, target: target, source: source, sibling: sibling });
    }
    else {
      return this.globalOptions.accepts(item, target, source, sibling);
    }
  }

  _invalid(item, handle) {
    if (typeof this.invalid === 'function') {
      return this.invalid({ item: item, handle: handle });
    }
    else {
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
}
