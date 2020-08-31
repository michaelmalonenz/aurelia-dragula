"use strict";

exports.__esModule = true;
exports.Options = exports.DIRECTION = exports.GLOBAL_OPTIONS = void 0;
var GLOBAL_OPTIONS = 'GlobalOptions';
exports.GLOBAL_OPTIONS = GLOBAL_OPTIONS;
var DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};
exports.DIRECTION = DIRECTION;

var Options = /*#__PURE__*/function () {
  function Options() {
    this.moves = Options.always;
    this.accepts = Options.always;
    this.invalid = Options.invalidTarget;
    this.containers = [];
    this.isContainer = Options.never;
    this.copy = false;
    this.copySortSource = false;
    this.revertOnSpill = true;
    this.removeOnSpill = false;
    this.direction = DIRECTION.VERTICAL;
    this.ignoreInputTextSelection = true;
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

exports.Options = Options;
//# sourceMappingURL=options.js.map
