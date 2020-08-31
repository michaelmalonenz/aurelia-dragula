"use strict";

exports.__esModule = true;
exports.Emitter = void 0;

var EventListener = function EventListener(func, once) {
  if (once === void 0) {
    once = false;
  }

  this.func = func;
  this.once = once;
};

var Emitter = /*#__PURE__*/function () {
  function Emitter() {
    this.events = {};
  }

  var _proto = Emitter.prototype;

  _proto.on = function on(type, fn, once) {
    if (once === void 0) {
      once = false;
    }

    var newEvent = new EventListener(fn, once);

    if (this.events[type] === undefined) {
      this.events[type] = [];
    }

    this.events[type].push(newEvent);
  };

  _proto.once = function once(type, fn) {
    this.on(type, fn, true);
  };

  _proto.off = function off(type, fn) {
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

        if (index >= 0) {
          eventList.splice(index, 1);
        }
      }
    }
  };

  _proto.destroy = function destroy() {
    this.events = {};
  };

  _proto.emit = function emit() {
    var _this = this;

    var args = arguments ? Array.prototype.slice.call(arguments) : [];
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

exports.Emitter = Emitter;
//# sourceMappingURL=emitter.js.map
