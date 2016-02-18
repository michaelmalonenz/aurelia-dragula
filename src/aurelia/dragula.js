import {inject} from 'aurelia-dependency-injection';
import {touchy} from './touchy';
import {GLOBAL_OPTIONS, Options} from './options';
import {Util} from './util';
import {emitter} from 'contra';
import * as crossvent from 'crossvent';
import * as classes from '../classes';


@inject(GLOBAL_OPTIONS)
export class Dragula {

  constructor(options) {
    let len = arguments.length;
    this.options = options || new Options();
    this.drake = emitter({
      containers: this.options.containers,
      start: ::this.manualStart,
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

  on(eventName, callback) {
    this.drake.on(eventName, callback);
  }

  get containers() {
    return this.options.containers;
  }

  set containers(value) {
    this.options.containers = value;
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

  //movements
  _movements (remove) {
    let op = remove ? 'remove' : 'add';
    crossvent[op](document.documentElement, 'selectstart', this._preventGrabbed); // IE8
    crossvent[op](document.documentElement, 'click', this._preventGrabbed);
  }

  destroy () {
    this._events(true);
    this._release({});
  }

  //preventGrabbed
  _preventGrabbed(e) {
    if (this._grabbed) {
      e.preventDefault();
    }
  }

  //grab
  _grab(e) {
    this._moveX = e.clientX;
    this._moveY = e.clientY;

    let ignore = Util.whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
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
      if (this._isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    }
  }

  //startBecauseMouseMoved
  _startBecauseMouseMoved (e) {
    if (!this._grabbed) {
      return;
    }
    if (Util.whichMouseButton(e) === 0) {
      this._release({});
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }
    // truthy check fixes #239, equality fixes #207
    if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
      return;
    }
    if (this.options.ignoreInputTextSelection) {
      let clientX = Util.getCoord('clientX', e);
      let clientY = Util.getCoord('clientY', e);
      let elementBehindCursor = document.elementFromPoint(clientX, clientY);
      if (Util.isInput(elementBehindCursor)) {
        return;
      }
    }

    let grabbed = this._grabbed; // call to end() unsets _grabbed
    this._eventualMovements(true);
    this._movements();
    this.end();
    this.start(grabbed);

    let offset = getOffset(_item);
    _offsetX = getCoord('pageX', e) - offset.left;
    _offsetY = getCoord('pageY', e) - offset.top;

    classes.add(_copy || _item, 'gu-transit');
    this._renderMirrorImage();
    this.drag(e);
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
    while (Util.getParent(item) && this.isContainer(Util.getParent(item)) === false) {
      if (this.options.invalid(item, handle)) {
        return;
      }
      item = Util.getParent(item); // drag target should be a top element
      if (!item) {
        return;
      }
    }
    let source = Util.getParent(item);
    if (!source) {
      return;
    }
    if (this.options.invalid(item, handle)) {
      return;
    }

    let movable = this.options.moves(item, source, handle, Util.nextEl(item));
    if (!movable) {
      return;
    }

    return {
      item: item,
      source: source
    };
  }

  manualStart(item) {
    let context = this._canStart(item);
    if (context) {
      this.start(context);
    }
  }

  start(context) {
    if (this._isCopy(context.item, context.source)) {
      this._copy = context.item.cloneNode(true);
      this.drake.emit('cloned', this._copy, context.item, 'copy');
    }

    this._source = context.source;
    this._item = context.item;
    this._initialSibling = context.item.nextElement;
    this._currentSibling = Util.nextEl(context.item);

    this.drake.dragging = true;
    this.drake.emit('drag', this._item, this._source);
  }

  end() {
    if (!this.drake.dragging) {
      return;
    }
    let item = this._copy || this._item;
    this.drop(item, Util.getParent(item));
  }

  //ungrab
  _ungrab() {
    this._grabbed = false;
    this._eventualMovements(true);
    this._movements(true);
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
      this.drop(item, dropTarget);
    } else if (this.options.removeOnSpill) {
      this.remove();
    } else {
      this.cancel();
    }
  }

  drop(item, target) {
    let parent = Util.getParent(item);
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
    let parent = Util.getParent(item);
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
    let parent = Util.getParent(item);
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
      this.drake.emit('drop', item, parent, this._source, this._currentSibling);
    }
    this._cleanup();
  }

  //cleanup
  _cleanup () {
    let item = this._copy || this._item;
    this._ungrab();
    this.removeMirrorImage();
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

  _isInitialPlacement(target, s) {
    let sibling;
    if (s !== void 0) {
      sibling = s;
    } else if (this._mirror) {
      sibling = this._currentSibling;
    } else {
      sibling = Util.nextEl(this._copy || this._item);
    }
    return target === this._source && sibling === this._initialSibling;
  }

  _findDropTarget (elementBehindCursor, clientX, clientY) {
    let target = elementBehindCursor;
    while (target && !accepted()) {
      target = Util.getParent(target);
    }
    return target;

    accepted = () => {
      let droppable = this.isContainer(target);
      if (droppable === false) {
        return false;
      }

      let immediate = Util.getImmediateChild(target, elementBehindCursor);
      let reference = this.getReference(target, immediate, clientX, clientY);
      let initial = this._isInitialPlacement(target, reference);
      if (initial) {
        return true; // should always be able to drop it right back where it was
      }
      return this.options.accepts(this._item, target, this._source, reference);
    }
  }

  drag(e) {
    if (!this._mirror) {
      return;
    }
    e.preventDefault();

    let clientX = Util.getCoord('clientX', e);
    let clientY = Util.getCoord('clientY', e);
    let x = clientX - this._offsetX;
    let y = clientY - this._offsetY;

    this._mirror.style.left = x + 'px';
    this._mirror.style.top = y + 'px';

    let item = this._copy || this._item;
    let elementBehindCursor = Util.getElementBehindPoint(_mirror, clientX, clientY);
    let dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    let changed = dropTarget !== null && dropTarget !== this._lastDropTarget;
    if (changed || dropTarget === null) {
      out();
      this._lastDropTarget = dropTarget;
      over();
    }
    let parent = Util.getParent(item);
    if (dropTarget === this._source && this._copy && !this.options.copySortSource) {
      if (parent) {
        parent.removeChild(item);
      }
      return;
    }
    let reference;
    let immediate = Util.getImmediateChild(dropTarget, elementBehindCursor);
    if (immediate !== null) {
      reference = this.getReference(dropTarget, immediate, clientX, clientY);
    } else if (this.options.revertOnSpill === true && !this._copy) {
      reference = this._initialSibling;
      dropTarget = this._source;
    } else {
      if (this._copy && parent) {
        parent.removeChild(item);
      }
      return;
    }
    if (
      (reference === null && changed) ||
      reference !== item &&
      reference !== Util.nextEl(item)
    ) {
      this._currentSibling = reference;
      dropTarget.insertBefore(item, reference);
      this.drake.emit('shadow', item, dropTarget, this._source);
    }
    moved = (type) => { this.drake.emit(type, item, this._lastDropTarget, this._source); }
    over = () => { if (changed) { moved('over'); } }
    out = () => { if (this._lastDropTarget) { moved('out'); } }
  }

  spillOver(el) {
    classes.rm(el, 'gu-hide');
  }

  spillOut(el) {
    if (this.drake.dragging) { classes.add(el, 'gu-hide'); }
  }

  renderMirrorImage() {
    if (this._mirror) {
      return;
    }
    let rect = this._item.getBoundingClientRect();
    this._mirror = this._item.cloneNode(true);
    this._mirror.style.width = Util.getRectWidth(rect) + 'px';
    this._mirror.style.height = Util.getRectHeight(rect) + 'px';
    classes.rm(this._mirror, 'gu-transit');
    classes.add(this._mirror, 'gu-mirror');
    this.options.mirrorContainer.appendChild(this._mirror);
    touchy(document.documentElement, 'add', 'mousemove', drag);
    classes.add(this.options.mirrorContainer, 'gu-unselectable');
    this.drake.emit('cloned', this._mirror, this._item, 'mirror');
  }

  removeMirrorImage() {
    if (this._mirror) {
      classes.rm(this.options.mirrorContainer, 'gu-unselectable');
      touchy(document.documentElement, 'remove', 'mousemove', drag);
      Util.getParent(this._mirror).removeChild(this._mirror);
      this._mirror = null;
    }
  }

  getReference(dropTarget, target, x, y) {
    let horizontal = this.options.direction === 'horizontal';
    let reference = target !== dropTarget ? inside() : outside();
    return reference;

    outside = () => { // slower, but able to figure out any position
      let len = dropTarget.children.length;
      let i;
      let el;
      let rect;
      for (i = 0; i < len; i++) {
        el = dropTarget.children[i];
        rect = el.getBoundingClientRect();
        if (horizontal && rect.left > x) { return el; }
        if (!horizontal && rect.top > y) { return el; }
      }
      return null;
    }

    inside = () => { // faster, but only available if dropped inside a child element
      let rect = target.getBoundingClientRect();
      if (horizontal) {
        return resolve(x > rect.left + getRectWidth(rect) / 2);
      }
      return resolve(y > rect.top + getRectHeight(rect) / 2);
    }

    resolve = (after) => {
      return after ? Util.nextEl(target) : target;
    }
  }

  //isCopy
  _isCopy(item, container) {
    return typeof this.options.copy === 'boolean' ? this.options.copy : this.options.copy(item, container);
  }

}