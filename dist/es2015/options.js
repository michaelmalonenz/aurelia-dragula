export const GLOBAL_OPTIONS = 'GlobalOptions';

export const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

export let Options = class Options {

  constructor() {
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

  static always() {
    return true;
  }

  static never() {
    return false;
  }

  static invalidTarget() {
    return false;
  }
};