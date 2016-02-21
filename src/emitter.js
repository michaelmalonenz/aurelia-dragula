let debounce = require('./debounce');

export class Emitter {

  constructor(thing, options) {
    this.options = options || {};
    this.events = {};
    if (thing === undefined) { thing = {}; }
    this.thing = thing;
  }

  on(type, fn) {
    if (!this.events[type]) {
      this.events[type] = fn;
    }
    else {
      this.events[type] = fn;
    }
  }

  once(type, fn) {
    fn._once = true; // thing.off(fn) still works!
    thing.on(type, fn);
  }

  off(type, fn) {
    let c = arguments.length;
    if (c === 1) {
      delete this.events[type];
    } else if (c === 0) {
      this.events = {};
    } else {
      let et = this.events[type];
      if (!et) { return; }
      et.splice(et.indexOf(fn), 1);
    }
  }

  emit() {
    let args = [...arguments];
    return this._emitterSnapshot(args.shift()).apply(this.thing, args);
  }

  _emitterSnapshot(type) {
    let et = (this.events[type] || []).slice(0);
    return function() {
      let args = [...arguments];
      let context = this.thing;
      if (type === 'error' && this.options.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
      et.forEach(listen => {
        if (this.options.async) {
          debounce(listen, args, context);
        }
        else {
          listen.apply(context, args);
        }
        if (listen._once) {
          thing.off(type, listen);
        }
      });
    }
  }
}
