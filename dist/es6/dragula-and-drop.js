import {customElement, bindable, noView} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';

import {Options} from './options';
import {Dragula} from './dragula';

@bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'targetClass', attribute: 'target-class', defaultValue: 'drop-target', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'sourceClass', attribute: 'source-class', defaultValue: 'drag-source', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: (item, source) => {}})
@bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: (item, target, source, sibling) => {}})
@bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime, defaultValue: (item) => {}})
@customElement('dragula-and-drop')
@noView()
export class DragulaAndDrop {

  constructor() {
    this.drake;
  }

  bind() {
    let boundOptions = {
      containers: this.containers,
      copy: this.copy,
      copySortSource: this.copySortSource,
      revertOnSpill: this.revertOnSpill,
      removeOnSpill: this.removeOnSpill,
      direction: this.direction,
      ignoreInputTextSelection: this.ignoreInputTextSelection,
      mirrorContainer: this.mirrorContainer
    };

    let aureliaOptions = {
      isContainer: el => {
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
      },
      moves: (item, source, handle, sibling) => {
        if (typeof this.moves === 'function') {
          return this.moves({ item: item, source: source, handle: handle, sibling: sibling });
        }
      },
      accepts: (item, target, source, currentSibling) => {
        if (typeof this.accepts === 'function') {
          return this.accepts({ item: item, target: target, source: source, currentSibling });
        }
      },
      invalid: (item, handle) => {
        if (typeof this.invalid === 'function') {
          return this.invalid({ item: item, handle: handle });
        }
      }
    };

    let options = Object.assign(aureliaOptions, boundOptions);
    this.dragula = new Dragula(options);

    this.dragula.on('drop', (item, target, source, sibling) => {
      this.dragula.cancel();
      this.dropFn({ item: item, target: target, source: source, sibling: sibling });
    });

    this.dragula.on('drag', (item, source) => {
      this.dragFn({ item: item, source: source});
    });

    this.dragula.on('dragend', (item) => {
      this.dragEndFn({ item: item });
    })
  }

  unbind() {
    this.dragula.destroy();
  }

}
