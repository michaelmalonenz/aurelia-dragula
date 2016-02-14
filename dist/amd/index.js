define(['exports', './aurelia/options', './dragula'], function (exports, _aureliaOptions, _dragula) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.configure = configure;
  exports.dragula = _dragula.dragula;

  function configure(config, callback) {
    var defaults = new _aureliaOptions.Options();
    config.container.registerInstance(_aureliaOptions.GLOBAL_OPTIONS, defaults);

    if (callback !== undefined && typeof callback === 'function') {
      callback(defaults);
    }
  }
});