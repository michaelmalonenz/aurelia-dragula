import {Container} from 'aurelia-dependency-injection'
import {touchy} from './touchy'
import {GLOBAL_OPTIONS} from './options'
import {Util} from './util'
import {Emitter} from './emitter'
import * as classes from './classes'

const MIN_TIME_BETWEEN_REDRAWS_MS = 20

export class Dragula {

  constructor (options) {
    let globalOptions = Container.instance.get(GLOBAL_OPTIONS)
    this.options = Object.assign({}, globalOptions, options)
    this._emitter = new Emitter()
    this.dragging = false

    if (this.options.removeOnSpill === true) {
      this._emitter.on('over', this.spillOver.bind(this))
      this._emitter.on('out', this.spillOut.bind(this))
    }

    this.boundStart = this._startBecauseMouseMoved.bind(this)
    this.boundGrab = this._grab.bind(this)
    this.boundRelease = this._release.bind(this)
    this.boundPreventGrabbed = this._preventGrabbed.bind(this)
    this.boundDrag = this.drag.bind(this)

    this._addEvents()

    this._mirror // mirror image
    this._source // source container
    this._item // item being dragged
    this._offsetX // reference x
    this._offsetY // reference y
    this._moveX // reference move x
    this._moveY // reference move y
    this._initialSibling // reference sibling when grabbed
    this._currentSibling // reference sibling now
    this._copy // item used for copying
    this._lastRenderTime = null // last time we rendered the mirror
    this._lastDropTarget = null // last container item was over
    this._grabbed // holds mousedown context until first mousemove
  }

  on (eventName, callback) {
    this._emitter.on(eventName, callback)
  }

  once (eventName, callback) {
    this._emitter.once(eventName, callback)
  }

  off (eventName, fn) {
    this._emitter.off(eventName, fn)
  }

  get containers () {
    return this.options.containers
  }

  set containers (value) {
    this.options.containers = value
  }

  isContainer (el) {
    return this.options.containers.indexOf(el) !== -1 || this.options.isContainer(el)
  }

  _addEvents () {
    touchy(document.documentElement, 'addEventListener', 'mousedown', this.boundGrab)
    touchy(document.documentElement, 'addEventListener', 'mouseup', this.boundRelease)
  }

  _removeEvents () {
    touchy(document.documentElement, 'removeEventListener', 'mousedown', this.boundGrab)
    touchy(document.documentElement, 'removeEventListener', 'mouseup', this.boundRelease)
  }

  _eventualMovements (remove) {
    let op = remove ? 'removeEventListener' : 'addEventListener'
    touchy(document.documentElement, op, 'mousemove', this.boundStart)
  }

  _movements (remove) {
    let op = remove ? 'removeEventListener' : 'addEventListener'
    touchy(document.documentElement, op, 'click', this.boundPreventGrabbed)
  }

  destroy () {
    this._removeEvents()
    this._release({clientX: -1, clientY: -1})
    this._emitter.destroy()
  }

  _preventGrabbed (e) {
    if (this._grabbed) {
      e.preventDefault()
    }
  }

  _grab (e) {
    this._moveX = e.clientX
    this._moveY = e.clientY

    let ignore = Util.whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey
    if (ignore) {
      return // we only care about honest-to-god left clicks and touch events
    }
    let item = e.target
    let context = this._canStart(item)
    if (!context) {
      return
    }
    this._grabbed = context
    this._eventualMovements()
    if (Util.isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
      item.focus() // fixes https://github.com/bevacqua/dragula/issues/176
    } else {
      e.preventDefault() // fixes https://github.com/bevacqua/dragula/issues/155
    }
  }

  _startBecauseMouseMoved (e) {
    if (!this._grabbed || this.dragging) {
      return
    }
    if (Util.whichMouseButton(e) === 0) {
      this._release({})
      return // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }
    // truthy check fixes #239, equality fixes #207
    if (e.clientX !== void 0 && e.clientX === this._moveX && e.clientY !== void 0 && e.clientY === this._moveY) {
      return
    }
    if (this.options.ignoreInputTextSelection) {
      let clientX = Util.getCoord('clientX', e)
      let clientY = Util.getCoord('clientY', e)
      let elementBehindCursor = document.elementFromPoint(clientX, clientY)
      if (Util.isInput(elementBehindCursor)) {
        return
      }
    }

    let grabbed = this._grabbed // call to end() unsets _grabbed
    this._eventualMovements(true)
    this._movements()
    this.end()
    this.start(grabbed)

    let offset = Util.getOffset(this._item)
    this._offsetX = Util.getCoord('pageX', e) - offset.left
    this._offsetY = Util.getCoord('pageY', e) - offset.top

    let item = this._copy || this._item
    classes.add(item, 'gu-transit')
    this.renderMirrorImage()
    this.drag(e)
  }

  _canStart (item) {
    if (this.dragging && this._mirror) {
      return
    }
    if (this.isContainer(item)) {
      return // don't drag container itself
    }
    let handle = item
    while (Util.getParent(item) && this.isContainer(Util.getParent(item)) === false) {
      if (this.options.invalid(item, handle)) {
        return
      }
      item = Util.getParent(item) // drag target should be a top element
      if (!item) {
        return
      }
    }
    let source = Util.getParent(item)
    if (!source) {
      return
    }
    if (this.options.invalid(item, handle)) {
      return
    }

    let movable = this.options.moves(item, source, handle, Util.nextEl(item))
    if (!movable) {
      return
    }

    return {
      item: item,
      source: source
    }
  }

  _cloneNodeWithoutCheckedRadios(el) {
    var mirror = el.cloneNode(true);
    var mirrorInputs = mirror.getElementsByTagName('input');
    var len = mirrorInputs.length;
    for (var i = 0; i < len; i++) {
      if (mirrorInputs[i].type === 'radio') {
        mirrorInputs[i].checked = false;
      }
    }
    return mirror;
  }

  manualStart (item) {
    let context = this._canStart(item)
    if (context) {
      this.start(context)
    }
  }

  start (context) {
    if (this._isCopy(context.item, context.source)) {
      this._copy = this._cloneNodeWithoutCheckedRadios(context.item)
      this._emitter.emit('cloned', this._copy, context.item, 'copy', Util.getViewModel(context.item))
    }

    this._source = context.source
    this._item = context.item
    // _initialSibling might be a comment node if it's the last item of the container
    this._initialSibling = context.item.nextSibling
    this._currentSibling = Util.nextEl(context.item)

    this.dragging = true
    this._emitter.emit('drag', this._item, this._source, Util.getViewModel(this._item))
  }

  end () {
    if (!this.dragging) {
      return
    }
    let item = this._copy || this._item
    this.drop(item, Util.getParent(item))
  }

  _ungrab () {
    this._grabbed = false
    this._eventualMovements(true)
    this._movements(true)
  }

  _release (e) {
    this._ungrab()

    if (!this.dragging) {
      return
    }
    let item = this._copy || this._item
    let clientX = Util.getCoord('clientX', e)
    let clientY = Util.getCoord('clientY', e)
    let elementBehindCursor = Util.getElementBehindPoint(this._mirror, clientX, clientY)
    let dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY)
    if (dropTarget && ((this._copy && this.options.copySortSource) || (!this._copy || dropTarget !== this._source))) {
      this.drop(item, dropTarget)
    } else if (this.options.removeOnSpill) {
      this.remove()
    } else {
      this.cancel()
    }
  }

  drop (item, target) {
    if (this._copy && this.options.copySortSource && target === this._source) {
      let parent = Util.getParent(this._item)
      if (parent) {
        parent.removeChild(this._item)
      }
    }
    if (this._isInitialPlacement(target)) {
      this._emitter.emit('cancel', item, this._source, this._source, Util.getViewModel(this._item))
    } else {
      this._emitter.emit('drop', item, target, this._source, this._currentSibling,
        Util.getViewModel(this._item), Util.getViewModel(this._currentSibling))
    }
    this._cleanup()
  }

  remove () {
    if (!this.dragging) {
      return
    }
    let item = this._copy || this._item
    let parent = Util.getParent(item)
    if (parent) {
      parent.removeChild(item)
    }
    this._emitter.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source, Util.getViewModel(this._item))
    this._cleanup()
  }

  cancel (revert, forceIgnoreRevert = false) {
    if (!this.dragging) {
      return
    }
    // If the initial sibling is the Aurelia <!--anchor--> node, then we have to
    // re-render on Aurelia's behalf.
    if (this._initialSibling && this._initialSibling.nodeName === '#comment' && this._initialSibling.data === 'anchor') {
      forceIgnoreRevert = false
    }
    let reverts = arguments.length > 0 ? revert : this.options.revertOnSpill
    let item = this._copy || this._item
    let parent = Util.getParent(item)
    let initial = this._isInitialPlacement(parent)
    if (initial === false && reverts && this._copy && parent && parent !== this._source) {
      parent.removeChild(this._copy)
    } else {
      this._source.insertBefore(item, this._initialSibling)
    }
    if (initial || reverts) {
      this._emitter.emit('cancel', item, this._source, this._source, Util.getViewModel(this._item))
    } else {
      this._emitter.emit('drop', item, parent, this._source, this._currentSibling,
        Util.getViewModel(this._item), Util.getViewModel(this._currentSibling))
    }
    this._cleanup()
  }

  _cleanup () {
    let item = this._copy || this._item
    this._ungrab()
    this.removeMirrorImage()
    if (item) {
      classes.rm(item, 'gu-transit')
    }
    this.dragging = false
    if (this._lastDropTarget) {
      this._emitter.emit('out', item, this._lastDropTarget, this._source, Util.getViewModel(item))
    }
    this._emitter.emit('dragend', item, Util.getViewModel(item))
    this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._lastRenderTime = this._lastDropTarget = null
  }

  _isInitialPlacement (target, s) {
    let sibling
    if (s !== void 0) {
      sibling = s
    } else if (this._mirror) {
      sibling = this._currentSibling
    } else {
      let item = this._copy || this._item
      sibling = item.nextSibling
    }
    return target === this._source && sibling === this._initialSibling
  }

  _findDropTarget (elementBehindCursor, clientX, clientY) {
    let accepted = () => {
      let droppable = this.isContainer(target)
      if (droppable === false) {
        return false
      }

      let immediate = Util.getImmediateChild(target, elementBehindCursor)
      let reference = this.getReference(target, immediate, clientX, clientY)
      let initial = this._isInitialPlacement(target, reference)
      if (initial) {
        return true // should always be able to drop it right back where it was
      }
      return this.options.accepts(this._item, target, this._source, reference)
    }

    let target = elementBehindCursor
    while (target && !accepted()) {
      target = Util.getParent(target)
    }
    return target
  }

  drag (e) {
    e.preventDefault()
    if (!this._mirror) {
      return
    }

    if (this._lastRenderTime != null && Date.now() - this._lastRenderTime < MIN_TIME_BETWEEN_REDRAWS_MS) {
      return
    }
    this._lastRenderTime = Date.now()

    let item = this._copy || this._item

    let moved = (type) => { this._emitter.emit(type, item, this._lastDropTarget, this._source, Util.getViewModel(item)) }
    let over = () => { if (changed) { moved('over') } }
    let out = () => { if (this._lastDropTarget) { moved('out') } }

    let clientX = Util.getCoord('clientX', e)
    let clientY = Util.getCoord('clientY', e)
    let x = clientX - this._offsetX
    let y = clientY - this._offsetY

    this._mirror.style.left = x + 'px'
    this._mirror.style.top = y + 'px'

    let elementBehindCursor = Util.getElementBehindPoint(this._mirror, clientX, clientY)
    let dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY)
    let changed = dropTarget != null && dropTarget !== this._lastDropTarget
    if (changed || dropTarget == null) {
      out()
      this._lastDropTarget = dropTarget
      over()
    }
    let parent = Util.getParent(item)
    if (dropTarget === this._source && this._copy && !this.options.copySortSource) {
      if (parent) {
        parent.removeChild(item)
      }
      return
    }
    let reference
    let immediate = Util.getImmediateChild(dropTarget, elementBehindCursor)
    if (immediate != null) {
      reference = this.getReference(dropTarget, immediate, clientX, clientY)
    } else if (this.options.revertOnSpill === true && !this._copy) {
      reference = this._initialSibling
      dropTarget = this._source
    } else {
      if (this._copy && parent) {
        parent.removeChild(item)
      }
      return
    }
    if (
      (reference == null && changed) ||
      reference !== item &&
      reference !== Util.nextEl(item)
    ) {
      this._currentSibling = reference
      dropTarget.insertBefore(item, reference)
      this._emitter.emit('shadow', item, dropTarget, this._source, Util.getViewModel(item))
    }
  }

  spillOver (el) {
    classes.rm(el, 'gu-hide')
  }

  spillOut (el) {
    if (this.dragging) { classes.add(el, 'gu-hide') }
  }

  renderMirrorImage () {
    if (this._mirror) {
      return
    }
    let rect = this._item.getBoundingClientRect()
    this._mirror = this._cloneNodeWithoutCheckedRadios(this._item)
    this._mirror.style.width = Util.getRectWidth(rect) + 'px'
    this._mirror.style.height = Util.getRectHeight(rect) + 'px'
    classes.rm(this._mirror, 'gu-transit')
    classes.add(this._mirror, 'gu-mirror')
    this.options.mirrorContainer.appendChild(this._mirror)
    touchy(document.documentElement, 'addEventListener', 'mousemove', this.boundDrag)
    classes.add(this.options.mirrorContainer, 'gu-unselectable')
    this._emitter.emit('cloned', this._mirror, this._item, 'mirror', Util.getViewModel(this._item))
  }

  removeMirrorImage () {
    if (this._mirror) {
      classes.rm(this.options.mirrorContainer, 'gu-unselectable')
      touchy(document.documentElement, 'removeEventListener', 'mousemove', this.boundDrag)
      Util.getParent(this._mirror).removeChild(this._mirror)
      this._mirror = null
    }
  }

  getReference (dropTarget, target, x, y) {
    const horizontal = this.options.direction === 'horizontal'
    let outside = () => { // slower, but able to figure out any position
      let len = dropTarget.children.length
      let i, el, rect
      for (i = 0; i < len; i++) {
        el = dropTarget.children[i]
        rect = el.getBoundingClientRect()
        if (horizontal && (rect.left + rect.width / 2) > x) { return el }
        if (!horizontal && (rect.top + rect.height / 2) > y) { return el }
      }
      return null
    }

    let resolve = (after) => {
      return after ? Util.nextEl(target) : target
    }

    let inside = () => { // faster, but only available if dropped inside a child element
      let rect = target.getBoundingClientRect()
      if (horizontal) {
        return resolve(x > (rect.left + Util.getRectWidth(rect) / 2))
      }
      return resolve(y > (rect.top + Util.getRectHeight(rect) / 2))
    }

    let reference = target !== dropTarget ? inside() : outside()
    return reference
  }

  _isCopy (item, container) {
    let isBoolean = typeof this.options.copy === 'boolean' ||
      (typeof this.options.copy === 'object' && typeof this.options.copy.valueOf() === 'boolean')

    return isBoolean ? this.options.copy : this.options.copy(item, container)
  }

}
