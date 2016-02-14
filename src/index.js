import {Options, GLOBAL_OPTIONS} from './aurelia/options';

import {dragula} from './dragula';
export {dragula};

export function configure(config, callback) {
  let defaults = new Options();
  config.container.registerInstance(GLOBAL_OPTIONS, defaults);

  if (callback !== undefined && typeof(callback) === 'function') {
    callback(defaults);
  }
}
