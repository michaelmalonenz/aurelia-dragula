'use strict';

System.register(['./options', './dragula'], function (_export, _context) {
  var Options, GLOBAL_OPTIONS, Dragula;
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

      function configure(config, callback) {
        var defaults = new Options();
        config.container.registerInstance(GLOBAL_OPTIONS, defaults);

        if (callback !== undefined && typeof callback === 'function') {
          callback(defaults);
        }

        config.globalResources(['./dragula-and-drop']);
      }

      _export('configure', configure);
    }
  };
});