import { Options, GLOBAL_OPTIONS } from './options';

import { Dragula } from './dragula';
export { Dragula, Options };

export function configure(config, callback) {
  let defaults = new Options();
  config.container.registerInstance(GLOBAL_OPTIONS, defaults);

  if (callback !== undefined && typeof callback === 'function') {
    callback(defaults);
  }

  config.globalResources(['./dragula-and-drop']);
}