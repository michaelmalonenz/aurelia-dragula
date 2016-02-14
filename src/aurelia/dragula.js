import {Container} from 'aurelia-dependency-injection';

export class Dragula {

  constructor(options) {
    this.options = Object.assign({}, Container.instance.get(GLOBAL_OPTIONS), options);
  }
}