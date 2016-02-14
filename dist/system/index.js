System.register(['./aurelia/options'], function (_export) {
  'use strict';

  var Options, GLOBAL_OPTIONS;

  _export('configure', configure);

  function configure(config, callback) {
    config.globalResources(['./dragula.js', './aurelia/options']);

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
    }],
    execute: function () {}
  };
});