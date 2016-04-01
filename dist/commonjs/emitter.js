'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventListener = function EventListener(func) {
  var once = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  _classCallCheck(this, EventListener);

  this.func = func;
  this.once = once;
};

var Emitter = exports.Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.events = {};
  }

  Emitter.prototype.on = function on(type, fn) {
    var once = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var newEvent = new EventListener(fn, once);
    if (this.events[type] === undefined) {
      this.events[type] = [];
    }
    this.events[type].push(newEvent);
  };

  Emitter.prototype.once = function once(type, fn) {
    this.on(type, fn, true);
  };

  Emitter.prototype.off = function off(type, fn) {
    if (arguments.length === 1) {
      delete this.events[type];
    } else if (arguments.length === 0) {
      this.events = {};
    } else {
      var eventList = this.events[type];
      if (eventList) {
        var index = eventList.findIndex(function (x) {
          return x.func === fn;
        });
        if (index >= 0) eventList.splice(index, 1);
      }
    }
  };

  Emitter.prototype.destroy = function destroy() {
    this.events = {};
  };

  Emitter.prototype.emit = function emit() {
    var _this = this;

    var args = arguments ? [].concat(Array.prototype.slice.call(arguments)) : [];
    var type = args.shift();
    var et = (this.events[type] || []).slice(0);
    if (type === 'error' && !et.length) {
      throw args.length === 1 ? args[0] : args;
    }
    var toDeregister = [];
    et.forEach(function (listener) {
      listener.func.apply(listener, args);
      if (listener.once) {
        toDeregister.push(listener);
      }
    });
    toDeregister.forEach(function (listener) {
      _this.off(type, listener.func);
    });
  };

  return Emitter;
}();