'use strict';

System.register([], function (_export, _context) {
  var GLOBAL_OPTIONS, DIRECTION, Options;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('GLOBAL_OPTIONS', GLOBAL_OPTIONS = 'GlobalOptions');

      _export('GLOBAL_OPTIONS', GLOBAL_OPTIONS);

      _export('DIRECTION', DIRECTION = {
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal'
      });

      _export('DIRECTION', DIRECTION);

      _export('Options', Options = function () {
        function Options() {
          _classCallCheck(this, Options);

          this.moves = Options.always;
          this.accepts = Options.always;
          this.invalid = Options.invalidTarget;
          this.containers = [];
          this.isContainer = Options.never;
          this.copy = false;
          this.copySortSource = false;
          this.revertOnSpill = false;
          this.removeOnSpill = false;
          this.direction = DIRECTION.VERTICAL, this.ignoreInputTextSelection = true;
          this.mirrorContainer = document.body;
        }

        Options.always = function always() {
          return true;
        };

        Options.never = function never() {
          return false;
        };

        Options.invalidTarget = function invalidTarget() {
          return false;
        };

        return Options;
      }());

      _export('Options', Options);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Z0NBQWEsaUJBQWlCOzs7OzJCQUVqQixZQUFZO0FBQ3ZCLGtCQUFVLFVBQVY7QUFDQSxvQkFBWSxZQUFaOzs7Ozt5QkFHVztBQUVYLGlCQUZXLE9BRVgsR0FBYztnQ0FGSCxTQUVHOztBQUNaLGVBQUssS0FBTCxHQUFhLFFBQVEsTUFBUixDQUREO0FBRVosZUFBSyxPQUFMLEdBQWUsUUFBUSxNQUFSLENBRkg7QUFHWixlQUFLLE9BQUwsR0FBZSxRQUFRLGFBQVIsQ0FISDtBQUlaLGVBQUssVUFBTCxHQUFrQixFQUFsQixDQUpZO0FBS1osZUFBSyxXQUFMLEdBQW1CLFFBQVEsS0FBUixDQUxQO0FBTVosZUFBSyxJQUFMLEdBQVksS0FBWixDQU5ZO0FBT1osZUFBSyxjQUFMLEdBQXNCLEtBQXRCLENBUFk7QUFRWixlQUFLLGFBQUwsR0FBcUIsS0FBckIsQ0FSWTtBQVNaLGVBQUssYUFBTCxHQUFxQixLQUFyQixDQVRZO0FBVVosZUFBSyxTQUFMLEdBQWlCLFVBQVUsUUFBVixFQUNqQixLQUFLLHdCQUFMLEdBQWdDLElBQWhDLENBWFk7QUFZWixlQUFLLGVBQUwsR0FBdUIsU0FBUyxJQUFULENBWlg7U0FBZDs7QUFGVyxnQkFpQkosMkJBQVM7QUFDZCxpQkFBTyxJQUFQLENBRGM7OztBQWpCTCxnQkFxQkoseUJBQVE7QUFDYixpQkFBTyxLQUFQLENBRGE7OztBQXJCSixnQkF5QkoseUNBQWdCO0FBQ3JCLGlCQUFPLEtBQVAsQ0FEcUI7OztlQXpCWiIsImZpbGUiOiJvcHRpb25zLmpzIiwic291cmNlUm9vdCI6Ii9zcmMifQ==
