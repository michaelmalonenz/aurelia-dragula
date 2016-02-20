import {Dragula} from '../../../src/aurelia/dragula';
import {Options} from '../../../src/aurelia/options';

export function createDragula(initialContainers, options = {}) {
  let opts = Object.assign(new Options(), options);
  opts.containers = initialContainers || [];
  return new Dragula(opts);
}