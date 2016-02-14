import {Container} from 'aurelia-dependency-injection';

export class Dragula {

  constructor(options) {
    this.options = Object.assign({}, Container.instance.get(GLOBAL_OPTIONS), options);
  //    var drake = emitter({
  //   containers: o.containers,
  //   start: manualStart,
  //   end: end,
  //   cancel: cancel,
  //   remove: remove,
  //   destroy: destroy,
  //   dragging: false
  // });
  }

  get containers() {
    return this.options.containers;
  }

  set containers(value) {
    this.options.containers = value;
  }

}