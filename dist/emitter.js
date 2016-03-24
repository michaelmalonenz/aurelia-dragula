'use strict';

System.register([], function (_export, _context) {
  var EventListener, Emitter;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      EventListener = function EventListener(func) {
        var once = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, EventListener);

        this.func = func;
        this.once = once;
      };

      _export('Emitter', Emitter = function () {
        function Emitter(options) {
          _classCallCheck(this, Emitter);

          this.options = options || {};
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

        Emitter.prototype.emit = function emit() {
          var _this = this;

          var args = arguments ? [].concat(Array.prototype.slice.call(arguments)) : [];
          var type = args.shift();
          var et = (this.events[type] || []).slice(0);
          if (type === 'error' && this.options.throws !== false && !et.length) {
            throw args.length === 1 ? args[0] : args;
          }
          var toDeregister = [];
          et.forEach(function (listener) {
            if (_this.options.async) {
              debounce.apply(undefined, [listener.func].concat(args));
            } else {
              listener.func.apply(listener, args);
            }
            if (listener.once) {
              toDeregister.push(listener);
            }
          });
          toDeregister.forEach(function (listener) {
            _this.off(type, listener.func);
          });
        };

        return Emitter;
      }());

      _export('Emitter', Emitter);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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
