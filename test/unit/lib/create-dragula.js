import {Dragula} from '../../../src/aurelia/dragula';
import {Options} from '../../../src/aurelia/options';

export function createDragula(initialContainers, options = new Options()) {
  options.containers = initialContainers || [];
  return new Dragula(options);
}