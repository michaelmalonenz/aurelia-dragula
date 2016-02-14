import {Options, GLOBAL_OPTIONS} from './aurelia/options';

export function configure(config, callback) {
  config.globalResources(['./dragula.js', './aurelia/options']);

  let defaults = new Options();
  config.container.registerInstance(GLOBAL_OPTIONS, defaults);

  if (callback !== undefined && typeof(callback) === 'function') {
    callback(defaults);
  }
}
