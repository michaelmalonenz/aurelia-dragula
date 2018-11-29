/* global Event */
export function raise (el, type, eventProperties = {}, target = null) {
  let event = new Event(type, { 'bubbles': true, 'cancelable': false })
  event.clientX = 0
  event.clientY = 0
  Object.assign(event, eventProperties)
  const e = target || el
  e.dispatchEvent(event)
}
