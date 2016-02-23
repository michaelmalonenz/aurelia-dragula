define(['exports', 'babel-runtime/helpers/class-call-check', 'babel-runtime/helpers/create-class', 'babel-runtime/helpers/slice', 'babel-runtime/helpers/to-consumable-array'], function (exports, _babelRuntimeHelpersClassCallCheck, _babelRuntimeHelpersCreateClass, _babelRuntimeHelpersSlice, _babelRuntimeHelpersToConsumableArray) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var EventListener = function EventListener(func) {
    var once = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    (0, _babelRuntimeHelpersClassCallCheck['default'])(this, EventListener);

    this.func = func;
    this.once = once;
  };

  var Emitter = (function () {
    function Emitter(options) {
      (0, _babelRuntimeHelpersClassCallCheck['default'])(this, Emitter);

      this.options = options || {};
      this.events = {};
    }

    (0, _babelRuntimeHelpersCreateClass['default'])(Emitter, [{
      key: 'on',
      value: function on(type, fn) {
        var once = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        var newEvent = new EventListener(fn, once);
        if (this.events[type] === undefined) {
          this.events[type] = [];
        }
        this.events[type].push(newEvent);
      }
    }, {
      key: 'once',
      value: function once(type, fn) {
        this.on(type, fn, true);
      }
    }, {
      key: 'off',
      value: function off(type, fn) {
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
      }
    }, {
      key: 'emit',
      value: function emit() {
        var args = [].concat(_babelRuntimeHelpersSlice['default'].call(arguments));
        return this._emitterSnapshot(args.shift()).apply(this, args);
      }
    }, {
      key: '_emitterSnapshot',
      value: function _emitterSnapshot(type) {
        var et = (this.events[type] || []).slice(0);
        return function () {
          var _this = this;

          var args = arguments ? [].concat(_babelRuntimeHelpersSlice['default'].call(arguments)) : [];
          if (type === 'error' && this.options.throws !== false && !et.length) {
            throw args.length === 1 ? args[0] : args;
          }
          et.forEach(function (listener) {
            if (_this.options.async) {
              debounce.apply(undefined, [listener.func].concat((0, _babelRuntimeHelpersToConsumableArray['default'])(args)));
            } else {
              listener.func.apply(listener, (0, _babelRuntimeHelpersToConsumableArray['default'])(args));
            }
            if (listener.once) {
              _this.off(type, listener);
            }
          });
        };
      }
    }]);
    return Emitter;
  })();

  exports.Emitter = Emitter;
});