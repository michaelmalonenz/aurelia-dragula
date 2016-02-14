System.register(['aurelia-dependency-injection'], function (_export) {
  'use strict';

  var Container, Dragula;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }],
    execute: function () {
      Dragula = (function () {
        function Dragula(options) {
          _classCallCheck(this, Dragula);

          this.options = Object.assign({}, Container.instance.get(GLOBAL_OPTIONS), options);
        }

        _createClass(Dragula, [{
          key: 'containers',
          get: function get() {
            return this.options.containers;
          },
          set: function set(value) {
            this.options.containers = value;
          }
        }]);

        return Dragula;
      })();

      _export('Dragula', Dragula);
    }
  };
});