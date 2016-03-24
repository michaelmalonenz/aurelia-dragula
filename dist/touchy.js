'use strict';

System.register([], function (_export, _context) {
  var touch, pointers, microsoft;
  return {
    setters: [],
    execute: function () {
      touch = {
        mouseup: 'touchend',
        mousedown: 'touchstart',
        mousemove: 'touchmove'
      };
      pointers = {
        mouseup: 'pointerup',
        mousedown: 'pointerdown',
        mousemove: 'pointermove'
      };
      microsoft = {
        mouseup: 'MSPointerUp',
        mousedown: 'MSPointerDown',
        mousemove: 'MSPointerMove'
      };
      function touchy(el, op, type, fn) {
        if (window.navigator.pointerEnabled) {
          el[op](pointers[type], fn);
        } else if (window.navigator.msPointerEnabled) {
          el[op](microsoft[type], fn);
        } else {
          el[op](touch[type], fn);
          el[op](type, fn);
        }
      }

      _export('touchy', touchy);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvdWNoeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQU0sY0FBUTtBQUNaLGlCQUFTLFVBQVQ7QUFDQSxtQkFBVyxZQUFYO0FBQ0EsbUJBQVcsV0FBWDs7QUFFSSxpQkFBVztBQUNmLGlCQUFTLFdBQVQ7QUFDQSxtQkFBVyxhQUFYO0FBQ0EsbUJBQVcsYUFBWDs7QUFFSSxrQkFBWTtBQUNoQixpQkFBUyxhQUFUO0FBQ0EsbUJBQVcsZUFBWDtBQUNBLG1CQUFXLGVBQVg7O0FBR0ssZUFBUyxNQUFULENBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLElBQXhCLEVBQThCLEVBQTlCLEVBQWtDO0FBQ3ZDLFlBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLEVBQWlDO0FBQ25DLGFBQUcsRUFBSCxFQUFPLFNBQVMsSUFBVCxDQUFQLEVBQXVCLEVBQXZCLEVBRG1DO1NBQXJDLE1BRU8sSUFBSSxPQUFPLFNBQVAsQ0FBaUIsZ0JBQWpCLEVBQW1DO0FBQzVDLGFBQUcsRUFBSCxFQUFPLFVBQVUsSUFBVixDQUFQLEVBQXdCLEVBQXhCLEVBRDRDO1NBQXZDLE1BRUE7QUFDTCxhQUFHLEVBQUgsRUFBTyxNQUFNLElBQU4sQ0FBUCxFQUFvQixFQUFwQixFQURLO0FBRUwsYUFBRyxFQUFILEVBQU8sSUFBUCxFQUFhLEVBQWIsRUFGSztTQUZBO09BSEYiLCJmaWxlIjoidG91Y2h5LmpzIiwic291cmNlUm9vdCI6Ii9zcmMifQ==
