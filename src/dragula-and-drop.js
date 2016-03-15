import {customElement, bindable} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';

import {Options, DIRECTION, GLOBAL_OPTIONS} from './options';
import {Dragula} from './dragula';

@bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'revertOnSpill', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'removeOnSpill', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime })
@customElement('dragula-and-drop')
@inject(GLOBAL_OPTIONS)
export class DragulaAndDrop {

  constructor(globalOptions) {
    this.globalOptions = globalOptions;
    this.drake;
  }

  bind() {
    let boundOptions = {
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

    let options = Object.assign({}, this.globalOptions, boundOptions);
    this.drake = new Dragula(options);
  }

  unbind() {
    this.drake.destroy();
  }
}