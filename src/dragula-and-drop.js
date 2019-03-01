import {customElement, bindable, useView} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';
import {PLATFORM} from 'aurelia-pal';

import {Options, GLOBAL_OPTIONS} from './options';
import {Dragula} from './dragula';

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
@bindable({ name: 'clonedFn', attribute: 'cloned-fn', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'overFn', attribute: 'over-fn', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'outFn', attribute: 'out-fn', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'shadowFn', attribute: 'shadow-fn', defaultBindingMode: bindingMode.oneTime })
@customElement('dragula-and-drop')
@useView('./dragula-and-drop.html')
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
      invalid: this._invalid.bind(this),
      copy: this._copy.bind(this)
    };

    this.options = Object.assign(aureliaOptions, boundOptions);
    this.dragula = new Dragula(this.options);

    this.dragula.on('drop', this._dropFunction.bind(this));

    this.dragula.on('drag', (item, source, itemVM) => {
      if (typeof this.dragFn === 'function')
        this.dragFn({ item, source, itemVM });
    });

    this.dragula.on('dragend', (item, itemVM) => {
      if (typeof this.dragEndFn === 'function')
        this.dragEndFn({ item, itemVM });
    });

    this.dragula.on('cloned', (copy, item, type, itemVM) => {
      if (typeof this.clonedFn === 'function')
        this.clonedFn({ copy, item, type, itemVM });
    });

    this.dragula.on('over', (item, target, source, itemVM) => {
      if (typeof this.overFn === 'function')
        this.overFn({ item, target, source, itemVM });
    });

    this.dragula.on('out', (item, target, source, itemVM) => {
      if (typeof this.outFn === 'function')
        this.outFn({ item, target, source, itemVM });
    });

    this.dragula.on('shadow', (item, target, source, itemVM) => {
      if (typeof this.shadowFn === 'function')
        this.shadowFn({ item, target, source, itemVM });
    });
  }

  unbind() {
    this.dragula.destroy();
  }

  _dropFunction(item, target, source, sibling, itemVM, siblingVM) {
    if (typeof this.dropFn === 'function')
      this.dropFn({ item, target, source, sibling, itemVM, siblingVM });
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
    }
    else {
      return this.globalOptions.moves(item, source, handle, sibling);
    }
  }

  _accepts(item, target, source, sibling) {
    if (typeof this.accepts === 'function') {
      return this.accepts({ item, target, source, sibling });
    }
    else {
      return this.globalOptions.accepts(item, target, source, sibling);
    }
  }

  _invalid(item, handle) {
    if (typeof this.invalid === 'function') {
      return this.invalid({ item, handle });
    }
    else {
      return this.globalOptions.invalid(item, handle);
    }
  }

  _copy(item, container) {
    if (typeof this.copy === 'function') {
      return this.copy({ item, container });
    }
    if (typeof this.globalOptions.copy === 'function') {
      return this.globalOptions.copy({ item, container })
    }
    return this._convertToBooleanIfRequired(this._getOption('copy'))
  }

  _setupOptions() {
    let result = {
      containers: this._getOption('containers'),
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
