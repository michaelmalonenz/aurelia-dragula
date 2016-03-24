'use strict';

System.register(['./options', './dragula'], function (_export, _context) {
  var Options, GLOBAL_OPTIONS, Dragula;
  return {
    setters: [function (_options) {
      Options = _options.Options;
      GLOBAL_OPTIONS = _options.GLOBAL_OPTIONS;
    }, function (_dragula) {
      Dragula = _dragula.Dragula;
    }],
    execute: function () {
      _export('Dragula', Dragula);

      _export('Options', Options);

      function configure(config, callback) {
        var defaults = new Options();
        config.container.registerInstance(GLOBAL_OPTIONS, defaults);

        if (callback !== undefined && typeof callback === 'function') {
          callback(defaults);
        }

        config.globalResources(['./dragula-and-drop']);
      }

      _export('configure', configure);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFRO0FBQVM7O0FBRVQ7Ozt5QkFDQTs7eUJBQVM7O0FBRVYsZUFBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLFFBQTNCLEVBQXFDO0FBQzFDLFlBQUksV0FBVyxJQUFJLE9BQUosRUFBWCxDQURzQztBQUUxQyxlQUFPLFNBQVAsQ0FBaUIsZ0JBQWpCLENBQWtDLGNBQWxDLEVBQWtELFFBQWxELEVBRjBDOztBQUkxQyxZQUFJLGFBQWEsU0FBYixJQUEwQixPQUFPLFFBQVAsS0FBb0IsVUFBcEIsRUFBZ0M7QUFDNUQsbUJBQVMsUUFBVCxFQUQ0RDtTQUE5RDs7QUFJQSxlQUFPLGVBQVAsQ0FBdUIsQ0FBQyxvQkFBRCxDQUF2QixFQVIwQztPQUFyQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIn0=
