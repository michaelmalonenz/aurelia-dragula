const touch = {
  mouseup: 'touchend',
  mousedown: 'touchstart',
  mousemove: 'touchmove'
}
const pointers = {
  mouseup: 'pointerup',
  mousedown: 'pointerdown',
  mousemove: 'pointermove'
}
const microsoft = {
  mouseup: 'MSPointerUp',
  mousedown: 'MSPointerDown',
  mousemove: 'MSPointerMove'
}

export function touchy (el, op, type, fn) {
  if (window.navigator.pointerEnabled) {
    el[op](pointers[type], fn)
  } else if (window.navigator.msPointerEnabled) {
    el[op](microsoft[type], fn)
  } else {
    el[op](touch[type], fn)
    el[op](type, fn)
  }
}
