System.register(['./aurelia/options', './dragula'], function (_export) {
  'use strict';

  var Options, GLOBAL_OPTIONS, dragula;

  _export('configure', configure);

  function configure(config, callback) {
    var defaults = new Options();
    config.container.registerInstance(GLOBAL_OPTIONS, defaults);

    if (callback !== undefined && typeof callback === 'function') {
      callback(defaults);
    }
  }

  return {
    setters: [function (_aureliaOptions) {
      Options = _aureliaOptions.Options;
      GLOBAL_OPTIONS = _aureliaOptions.GLOBAL_OPTIONS;
    }, function (_dragula) {
      dragula = _dragula.dragula;
    }],
    execute: function () {
      _export('dragula', dragula);
    }
  };
});