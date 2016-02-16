import {Container} from 'aurelia-dependency-injection';
import {touchy} from './touchy';

export class Dragula {

  constructor(initialContainers, options) {
    let len = arguments.length;
    if (len === 1 && Array.isArray(initialContainers) === false) {
      options = initialContainers;
      initialContainers = [];
    }
    this.options = Object.assign({}, Container.instance.get(GLOBAL_OPTIONS), options);
    this.options.containers = initialContainers;
    this.drake = emitter({
      containers: this.options.containers,
      start: manualStart,
      end: end,
      cancel: cancel,
      remove: remove,
      destroy: destroy,
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
    
  isContainer (el) {
    return this.drake.containers.indexOf(el) !== -1 || this.options.isContainer(el);
  }

  //events
  _events (remove) {
    let op = remove ? 'remove' : 'add';
    touchy(documentElement, op, 'mousedown', grab);
    touchy(documentElement, op, 'mouseup', release);
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

  //getParent
  _getParent(el) { return el.parentNode === document ? null : el.parentNode; }

}