'use strict';

System.register(['./options', './dragula', './move-before', 'aurelia-pal'], function (_export, _context) {
  "use strict";

  var Options, GLOBAL_OPTIONS, DIRECTION, Dragula, moveBefore, PLATFORM;
  function configure(config, callback) {
    var defaults = new Options();
    config.container.registerInstance(GLOBAL_OPTIONS, defaults);

    if (callback !== undefined && typeof callback === 'function') {
      callback(defaults);
    }

    config.globalResources([PLATFORM.moduleName('dragula-and-drop')]);
  }

  _export('configure', configure);

  return {
    setters: [function (_options) {
      Options = _options.Options;
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
      DIRECTION = _options.DIRECTION;
    }, function (_dragula) {
      Dragula = _dragula.Dragula;
    }, function (_moveBefore) {
      moveBefore = _moveBefore.moveBefore;
    }, function (_aureliaPal) {
      PLATFORM = _aureliaPal.PLATFORM;
    }],
    execute: function () {
      _export('Dragula', Dragula);

      _export('Options', Options);

      _export('DIRECTION', DIRECTION);

      _export('moveBefore', moveBefore);
    }
  };
});