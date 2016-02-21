export const GLOBAL_OPTIONS = 'GlobalOptions';

export const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

export class Options {

  constructor() {
    this.moves = this.always;
    this.accepts = this.always;
    this.invalid = this.invalidTarget;
    this.containers = [];
    this.isContainer = this.never;
    this.copy = false;
    this.copySortSource = false;
    this.revertOnSpill = false;
    this.removeOnSpill = false;
    this.direction = DIRECTION.VERTICAL,
    this.ignoreInputTextSelection = true;
    this.mirrorContainer = document.body;
  }

  always() {
    return true;
  }

  never() {
    return false;
  }

  invalidTarget() {
    return false;
  }
}