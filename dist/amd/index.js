define(['exports', './options', './dragula'], function (exports, _options, _dragula) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.configure = configure;
  exports.Dragula = _dragula.Dragula;

  function configure(config, callback) {
    var defaults = new _options.Options();
    config.container.registerInstance(_options.GLOBAL_OPTIONS, defaults);

    if (callback !== undefined && typeof callback === 'function') {
      callback(defaults);
    }
  }
});