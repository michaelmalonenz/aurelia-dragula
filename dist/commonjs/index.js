'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveBefore = exports.DIRECTION = exports.Options = exports.Dragula = undefined;
exports.configure = configure;

var _options = require('./options');

var _dragula = require('./dragula');

var _moveBefore = require('./move-before');

exports.Dragula = _dragula.Dragula;
exports.Options = _options.Options;
exports.DIRECTION = _options.DIRECTION;
exports.moveBefore = _moveBefore.moveBefore;
function configure(config, callback) {
  var defaults = new _options.Options();
  config.container.registerInstance(_options.GLOBAL_OPTIONS, defaults);

  if (callback !== undefined && typeof callback === 'function') {
    callback(defaults);
  }

  config.globalResources(['./dragula-and-drop']);
}