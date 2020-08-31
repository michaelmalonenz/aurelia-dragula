class EventListener {
  constructor (func, once = false) {
    this.func = func
    this.once = once
  }
}

export class Emitter {
  constructor () {
    this.events = {}
  }

  on (type, fn, once = false) {
    let newEvent = new EventListener(fn, once)
    if (this.events[type] === undefined) {
      this.events[type] = []
    }
    this.events[type].push(newEvent)
  }

  once (type, fn) {
    this.on(type, fn, true)
  }

  off (type, fn) {
    if (arguments.length === 1) {
      delete this.events[type]
    } else if (arguments.length === 0) {
      this.events = {}
    } else {
      let eventList = this.events[type]
      if (eventList) {
        let index = eventList.findIndex(x => x.func === fn)
        if (index >= 0) {
          eventList.splice(index, 1)
        }
      }
    }
  }

  destroy () {
    this.events = {}
  }

  emit () {
    let args = arguments ? [...arguments] : []
    let type = args.shift()
    let et = (this.events[type] || []).slice(0)
    if (type === 'error' && !et.length) { throw args.length === 1 ? args[0] : args }
    let toDeregister = []
    et.forEach(listener => {
      listener.func(...args)
      if (listener.once) {
        toDeregister.push(listener)
      }
    })
    toDeregister.forEach(listener => {
      this.off(type, listener.func)
    })
  }
}
