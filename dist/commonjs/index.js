'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.configure = configure;

var _options = require('./options');

var _dragula = require('./dragula');

exports.Dragula = _dragula.Dragula;

function configure(config, callback) {
  var defaults = new _options.Options();
  config.container.registerInstance(_options.GLOBAL_OPTIONS, defaults);

  if (callback !== undefined && typeof callback === 'function') {
    callback(defaults);
  }
}