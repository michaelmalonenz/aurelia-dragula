import { Options, GLOBAL_OPTIONS, DIRECTION } from './options';
import { Dragula } from './dragula';
import { moveBefore } from './move-before';

export { Dragula, Options, DIRECTION, moveBefore };

export function configure(config, callback) {
  let defaults = new Options();
  config.container.registerInstance(GLOBAL_OPTIONS, defaults);

  if (callback !== undefined && typeof callback === 'function') {
    callback(defaults);
  }

  config.globalResources(['./dragula-and-drop']);
}