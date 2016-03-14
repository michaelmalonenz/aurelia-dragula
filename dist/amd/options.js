define(['exports', 'babel-runtime/helpers/create-class', 'babel-runtime/helpers/class-call-check'], function (exports, _babelRuntimeHelpersCreateClass, _babelRuntimeHelpersClassCallCheck) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var GLOBAL_OPTIONS = 'GlobalOptions';

  exports.GLOBAL_OPTIONS = GLOBAL_OPTIONS;
  var DIRECTION = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
  };

  exports.DIRECTION = DIRECTION;

  var Options = (function () {
    function Options() {
      (0, _babelRuntimeHelpersClassCallCheck['default'])(this, Options);

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

    (0, _babelRuntimeHelpersCreateClass['default'])(Options, null, [{
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

  exports.Options = Options;
});