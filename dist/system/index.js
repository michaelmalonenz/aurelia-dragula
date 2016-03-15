System.register(['./options', './dragula'], function (_export) {
  'use strict';

  var Options, GLOBAL_OPTIONS, Dragula;

  _export('configure', configure);

  function configure(config, callback) {
    var defaults = new Options();
    config.container.registerInstance(GLOBAL_OPTIONS, defaults);

    if (callback !== undefined && typeof callback === 'function') {
      callback(defaults);
    }

    config.globalResources(['./dragula-and-drop']);
  }

  return {
    setters: [function (_options) {
      Options = _options.Options;
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
    }, function (_dragula) {
      Dragula = _dragula.Dragula;
    }],
    execute: function () {
      _export('Dragula', Dragula);

      _export('Options', Options);
    }
  };
});