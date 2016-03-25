define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var GLOBAL_OPTIONS = exports.GLOBAL_OPTIONS = 'GlobalOptions';

  var DIRECTION = exports.DIRECTION = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
  };

  var Options = exports.Options = function () {
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
  }();
});