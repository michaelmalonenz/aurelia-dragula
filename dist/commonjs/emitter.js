'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _slice = require('babel-runtime/helpers/slice')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var EventListener = function EventListener(func) {
  var once = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  _classCallCheck(this, EventListener);

  this.func = func;
  this.once = once;
};

var Emitter = (function () {
  function Emitter(options) {
    _classCallCheck(this, Emitter);

    this.options = options || {};
    this.events = {};
  }

  _createClass(Emitter, [{
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
      var _this = this;

      var args = arguments ? [].concat(_slice.call(arguments)) : [];
      var type = args.shift();
      var et = (this.events[type] || []).slice(0);
      if (type === 'error' && this.options.throws !== false && !et.length) {
        throw args.length === 1 ? args[0] : args;
      }
      var toDeregister = [];
      et.forEach(function (listener) {
        if (_this.options.async) {
          debounce.apply(undefined, [listener.func].concat(_toConsumableArray(args)));
        } else {
          listener.func.apply(listener, _toConsumableArray(args));
        }
        if (listener.once) {
          toDeregister.push(listener);
        }
      });
      toDeregister.forEach(function (listener) {
        _this.off(type, listener.func);
      });
    }
  }]);

  return Emitter;
})();

exports.Emitter = Emitter;