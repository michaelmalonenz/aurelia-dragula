import {Dragula} from '../../../src/dragula';
import {Options} from '../../../src/options';

export function createDragula(initialContainers, options = {}) {
  let opts = Object.assign(new Options(), options);
  opts.containers = initialContainers || [];
  return new Dragula(opts);
}