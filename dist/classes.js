'use strict';

System.register([], function (_export, _context) {
  var cache, start, end;


  function lookupClass(className) {
    var cached = cache[className];
    if (cached) {
      cached.lastIndex = 0;
    } else {
      cache[className] = cached = new RegExp(start + className + end, 'g');
    }
    return cached;
  }

  return {
    setters: [],
    execute: function () {
      cache = {};
      start = '(?:^|\\s)';
      end = '(?:\\s|$)';
      function add(el, className) {
        if (el.classList) {
          el.classList.add(className);
          return;
        }
        var current = el.className;
        if (!current.length) {
          el.className = className;
        } else if (!lookupClass(className).test(current)) {
          el.className += ' ' + className;
        }
      }

      _export('add', add);

      function rm(el, className) {
        if (el.classList) {
          el.classList.remove(className);
          return;
        }
        el.className = el.className.replace(lookupClass(className), ' ').trim();
      }

      _export('rm', rm);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEsV0FBUyxXQUFULENBQXFCLFNBQXJCLEVBQWdDO0FBQzlCLFFBQUksU0FBUyxNQUFNLFNBQU4sQ0FBVCxDQUQwQjtBQUU5QixRQUFJLE1BQUosRUFBWTtBQUNWLGFBQU8sU0FBUCxHQUFtQixDQUFuQixDQURVO0tBQVosTUFFTztBQUNMLFlBQU0sU0FBTixJQUFtQixTQUFTLElBQUksTUFBSixDQUFXLFFBQVEsU0FBUixHQUFvQixHQUFwQixFQUF5QixHQUFwQyxDQUFULENBRGQ7S0FGUDtBQUtBLFdBQU8sTUFBUCxDQVA4QjtHQUFoQzs7Ozs7QUFKSSxjQUFRO0FBQ04sY0FBUTtBQUNSLFlBQU07QUFZTCxlQUFTLEdBQVQsQ0FBYSxFQUFiLEVBQWlCLFNBQWpCLEVBQTRCO0FBQ2pDLFlBQUksR0FBRyxTQUFILEVBQWM7QUFDaEIsYUFBRyxTQUFILENBQWEsR0FBYixDQUFpQixTQUFqQixFQURnQjtBQUVoQixpQkFGZ0I7U0FBbEI7QUFJQSxZQUFJLFVBQVUsR0FBRyxTQUFILENBTG1CO0FBTWpDLFlBQUksQ0FBQyxRQUFRLE1BQVIsRUFBZ0I7QUFDbkIsYUFBRyxTQUFILEdBQWUsU0FBZixDQURtQjtTQUFyQixNQUVPLElBQUksQ0FBQyxZQUFZLFNBQVosRUFBdUIsSUFBdkIsQ0FBNEIsT0FBNUIsQ0FBRCxFQUF1QztBQUNoRCxhQUFHLFNBQUgsSUFBZ0IsTUFBTSxTQUFOLENBRGdDO1NBQTNDO09BUkY7Ozs7QUFhQSxlQUFTLEVBQVQsQ0FBWSxFQUFaLEVBQWdCLFNBQWhCLEVBQTJCO0FBQ2hDLFlBQUksR0FBRyxTQUFILEVBQWM7QUFDaEIsYUFBRyxTQUFILENBQWEsTUFBYixDQUFvQixTQUFwQixFQURnQjtBQUVoQixpQkFGZ0I7U0FBbEI7QUFJQSxXQUFHLFNBQUgsR0FBZSxHQUFHLFNBQUgsQ0FBYSxPQUFiLENBQXFCLFlBQVksU0FBWixDQUFyQixFQUE2QyxHQUE3QyxFQUFrRCxJQUFsRCxFQUFmLENBTGdDO09BQTNCIiwiZmlsZSI6ImNsYXNzZXMuanMiLCJzb3VyY2VSb290IjoiL3NyYyJ9
