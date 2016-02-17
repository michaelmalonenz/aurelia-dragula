import {inject} from 'aurelia-dependency-injection';
import {touchy} from './touchy';
import {GLOBAL_OPTIONS, Options} from './options';
import {emitter} from 'contra';

@inject(GLOBAL_OPTIONS)
export class Dragula {

  constructor(options) {
    let len = arguments.length;
    this.options = options || new Options();
    this.options.containers = [];
    this.drake = emitter({
      containers: this.options.containers,
      start: ::this.start,
      end: ::this.end,
      cancel: ::this.cancel,
      remove: ::this.remove,
      destroy: ::this.destroy,
      dragging: false
    });

    if (this.options.removeOnSpill === true) {
      this.drake.on('over', spillOver).on('out', spillOut);
    }

    this._events();

    this._mirror; // mirror image
    this._source; // source container
    this._item; // item being dragged
    this._offsetX; // reference x
    this._offsetY; // reference y
    this._moveX; // reference move x
    this._moveY; // reference move y
    this._initialSibling; // reference sibling when grabbed
    this._currentSibling; // reference sibling now
    this._copy; // item used for copying
    this._renderTimer; // timer for setTimeout renderMirrorImage
    this._lastDropTarget = null; // last container item was over
    this._grabbed; // holds mousedown context until first mousemove

   // return drake;
  }

  on() {
    this.drake.on(...arguments);
  }

  get containers() {
    return this.options.containers;
  }

  set containers(value) {
    this.options.containers = value;
  }

  //manualStart
  start(item) {
    let context = this._canStart(item);
    if (context) {
      this._start(context);
    }
  }

  end () {
    if (!drake.dragging) {
      return;
    }
    let item = this._copy || this._item;
    drop(item, this._getParent(item));
  }

  drop(item, target) {
    let parent = this._getParent(item);
    if (this._copy && this.options.copySortSource && target === this._source) {
      parent.removeChild(_item);
    }
    if (this._isInitialPlacement(target)) {
      this.drake.emit('cancel', item, this._source, this._source);
    } else {
      this.drake.emit('drop', item, target, this._source, this._currentSibling);
    }
    this._cleanup();
  }

  remove() {
    if (!this.drake.dragging) {
      return;
    }
    let item = this._copy || this._item;
    let parent = this._getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    this.drake.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source);
    this._cleanup();
  }

  cancel(revert) {
    if (!this.drake.dragging) {
      return;
    }
    let reverts = arguments.length > 0 ? revert : this.options.revertOnSpill;
    let item = this._copy || this._item;
    let parent = this._getParent(item);
    if (parent === this._source && this._copy) {
      parent.removeChild(this._copy);
    }
    let initial = this._isInitialPlacement(parent);
    if (initial === false && !this._copy && reverts) {
      this._source.insertBefore(item, this._initialSibling);
    }
    if (initial || reverts) {
      this.drake.emit('cancel', item, this._source, this._source);
    } else {
      this.drake.emit('drop', item, parent, _source, _currentSibling);
    }
    this._cleanup();
  }

  //cleanup
  _cleanup () {
    let item = this._copy || this._item;
    ungrab();
    removeMirrorImage();
    if (item) {
      classes.rm(item, 'gu-transit');
    }
    if (this._renderTimer) {
      clearTimeout(this._renderTimer);
    }
    this.drake.dragging = false;
    if (this._lastDropTarget) {
      this.drake.emit('out', item, this._lastDropTarget, this._source);
    }
    this.drake.emit('dragend', item);
    this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._renderTimer = this._lastDropTarget = null;
  }

    
  isContainer (el) {
    return this.drake.containers.indexOf(el) !== -1 || this.options.isContainer(el);
  }

  //events
  _events (remove) {
    let op = remove ? 'remove' : 'add';
    touchy(document.documentElement, op, 'mousedown', ::this._grab);
    touchy(document.documentElement, op, 'mouseup', ::this._release);
  }


  //eventualMovements
  _eventualMovements(remove) {
    let op = remove ? 'remove' : 'add';
    touchy(document.documentElement, op, 'mousemove', ::this._startBecauseMouseMoved);
  }

  //grab
  _grab(e) {
    this._moveX = e.clientX;
    this._moveY = e.clientY;

    let ignore = this._whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
    if (ignore) {
      return; // we only care about honest-to-god left clicks and touch events
    }
    let item = e.target;
    let context = this._canStart(item);
    if (!context) {
      return;
    }
    this._grabbed = context;
    eventualMovements();
    if (e.type === 'mousedown') {
      if (isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    }
  }

  _release(e) {
    this._ungrab();

    if (!this.drake.dragging) {
      return;
    }
    let item = this._copy || this._item;
    let clientX = getCoord('clientX', e);
    let clientY = getCoord('clientY', e);
    let elementBehindCursor = getElementBehindPoint(this._mirror, clientX, clientY);
    let dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    if (dropTarget && ((this._copy && this.options.copySortSource) || (!this._copy || dropTarget !== this._source))) {
      this._drop(item, dropTarget);
    } else if (this.options.removeOnSpill) {
      this._remove();
    } else {
      this._cancel();
    }
  }

  //start
  _start(context) {
    if (this._isCopy(context.item, context.source)) {
      this._copy = context.item.cloneNode(true);
      this.drake.emit('cloned', this._copy, context.item, 'copy');
    }

    this._source = context.source;
    this._item = context.item;
    this._initialSibling = context.item.nextElement;
    this._currentSibling = nextEl(context.item);

    this.drake.dragging = true;
    this.drake.emit('drag', this._item, this._source);
  }

  //startBecauseMouseMoved
  _startBecauseMouseMoved (e) {
    if (!_grabbed) {
      return;
    }
    if (this._whichMouseButton(e) === 0) {
      release({});
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }
    // truthy check fixes #239, equality fixes #207
    if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
      return;
    }
    if (this.options.ignoreInputTextSelection) {
      let clientX = getCoord('clientX', e);
      let clientY = getCoord('clientY', e);
      let elementBehindCursor = document.elementFromPoint(clientX, clientY);
      if (this._isInput(elementBehindCursor)) {
        return;
      }
    }

    let grabbed = this._grabbed; // call to end() unsets _grabbed
    this._eventualMovements(true);
    movements();
    this.end();
    this._start(grabbed);

    let offset = getOffset(_item);
    _offsetX = getCoord('pageX', e) - offset.left;
    _offsetY = getCoord('pageY', e) - offset.top;

    classes.add(_copy || _item, 'gu-transit');
    renderMirrorImage();
    drag(e);
  }
  //isCopy
  _isCopy(item, container) {
    return typeof this.options.copy === 'boolean' ? this.options.copy : this.options.copy(item, container);
  }

  //canStart
  _canStart(item) {
    if (this.drake.dragging && this._mirror) {
      return;
    }
    if (this.isContainer(item)) {
      return; // don't drag container itself
    }
    let handle = item;
    while (this._getParent(item) && this.isContainer(this._getParent(item)) === false) {
      if (this.options.invalid(item, handle)) {
        return;
      }
      item = this._getParent(item); // drag target should be a top element
      if (!item) {
        return;
      }
    }
    let source = this._getParent(item);
    if (!source) {
      return;
    }
    if (this.options.invalid(item, handle)) {
      return;
    }

    let movable = this.options.moves(item, source, handle, this._nextEl(item));
    if (!movable) {
      return;
    }

    return {
      item: item,
      source: source
    };
  }

  destroy () {
    this._events(true);
    this._release({});
  }

  //nextEl
  _nextEl(el) {
    return el.nextElementSibling || manually();
    function manually () {
      let sibling = el;
      do {
        sibling = sibling.nextSibling;
      } while (sibling && sibling.nodeType !== 1);
      return sibling;
    }
  }

  //whichMouseButton
  _whichMouseButton(e) {
    if (e.touches !== void 0) { return e.touches.length; }
    if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
    if (e.buttons !== void 0) { return e.buttons; }
    let button = e.button;
    if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
      return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
    }
  }

  //getElementBehindPoint
  _getElementBehindPoint(point, x, y) {
    let p = point || {};
    let state = p.className;
    let el;
    p.className += ' gu-hide';
    el = document.elementFromPoint(x, y);
    p.className = state;
    return el;
  }

  //getParent
  _getParent(el) { return el.parentNode === document ? null : el.parentNode; }

  //isInput
  _isInput(el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || this._isEditable(el); }
  //isEditable
  _isEditable(el) {
    if (!el) { return false; } // no parents were editable
    if (el.contentEditable === 'false') { return false; } // stop the lookup
    if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
    return this._isEditable(this._getParent(el)); // contentEditable is set to 'inherit'
  }
}