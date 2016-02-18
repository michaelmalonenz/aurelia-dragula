export function raise(el, type, eventProperties = {}, target = null) {
  let event = new Event(type, {"bubbles":true, "cancelable":false})
  Object.assign(event, eventProperties);
  (target || el).dispatchEvent(event);
}