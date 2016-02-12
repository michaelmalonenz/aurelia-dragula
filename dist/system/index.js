System.register([], function (_export) {
  'use strict';

  _export('configure', configure);

  function configure(config) {
    config.globalResources('./dragula.js');
  }

  return {
    setters: [],
    execute: function () {}
  };
});