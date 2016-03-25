'use strict';

System.register([], function (_export, _context) {
  var GLOBAL_OPTIONS, DIRECTION, Options;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('GLOBAL_OPTIONS', GLOBAL_OPTIONS = 'GlobalOptions');

      _export('GLOBAL_OPTIONS', GLOBAL_OPTIONS);

      _export('DIRECTION', DIRECTION = {
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal'
      });

      _export('DIRECTION', DIRECTION);

      _export('Options', Options = function () {
        function Options() {
          _classCallCheck(this, Options);

          this.moves = Options.always;
          this.accepts = Options.always;
          this.invalid = Options.invalidTarget;
          this.containers = [];
          this.isContainer = Options.never;
          this.copy = false;
          this.copySortSource = false;
          this.revertOnSpill = false;
          this.removeOnSpill = false;
          this.direction = DIRECTION.VERTICAL, this.ignoreInputTextSelection = true;
          this.mirrorContainer = document.body;
        }

        Options.always = function always() {
          return true;
        };

        Options.never = function never() {
          return false;
        };

        Options.invalidTarget = function invalidTarget() {
          return false;
        };

        return Options;
      }());

      _export('Options', Options);
    }
  };
});