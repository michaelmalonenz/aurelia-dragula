System.register(['babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check'], function (_export) {
  var _createClass, _classCallCheck, GLOBAL_OPTIONS, DIRECTION, Options;

  return {
    setters: [function (_babelRuntimeHelpersCreateClass) {
      _createClass = _babelRuntimeHelpersCreateClass['default'];
    }, function (_babelRuntimeHelpersClassCallCheck) {
      _classCallCheck = _babelRuntimeHelpersClassCallCheck['default'];
    }],
    execute: function () {
      'use strict';

      GLOBAL_OPTIONS = 'GlobalOptions';

      _export('GLOBAL_OPTIONS', GLOBAL_OPTIONS);

      DIRECTION = {
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal'
      };

      _export('DIRECTION', DIRECTION);

      Options = (function () {
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

        _createClass(Options, null, [{
          key: 'always',
          value: function always() {
            return true;
          }
        }, {
          key: 'never',
          value: function never() {
            return false;
          }
        }, {
          key: 'invalidTarget',
          value: function invalidTarget() {
            return false;
          }
        }]);

        return Options;
      })();

      _export('Options', Options);
    }
  };
});