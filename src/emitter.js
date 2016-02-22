//let debounce = require('./debounce');

class EventListener {

  constructor(func, once = false) {
    this.func = func;
    this.once = once;
  }
}

export class Emitter {

  constructor(options) {
    this.options = options || {};
    this.events = {};
  }

  on(type, fn, once = false) {
    let newEvent = new EventListener(fn, once);
    if (this.events[type] === undefined) {
      this.events[type] = [];
    }
    this.events[type].push(newEvent);
  }

  once(type, fn) {
    thing.on(type, fn, true);
  }

  off(type, fn) {
    if (arguments.length === 1) {
      delete this.events[type];
    }
    else if (arguments.length === 0) {
      this.events = {};
    }
    else {
      let eventList = this.events[type];
      if (eventList) {
        let index = eventList.findIndex(x => x.func === fn);
        if (index >= 0)
          eventList.splice(index, 1);
      }
    }
  }

  emit() {
    let args = [...arguments];
    return this._emitterSnapshot(args.shift()).func(...args);
  }

  _emitterSnapshot(type) {
    let et = (this.events[type] || []).slice(0);
    return function() {
      let args = [...arguments];
      if (type === 'error' && this.options.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
      et.forEach(listener => {
        if (this.options.async) {
          debounce(listener.func, args);
        }
        else {
          listener.func(...args);
        }
        if (listener.once) {
          thing.off(type, listener);
        }
      });
    }
  }
}
