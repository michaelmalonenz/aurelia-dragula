import {customElement,bindable,inlineView} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';
import {inject,Container} from 'aurelia-dependency-injection';

/** This is purportedly necessary to support Internet Explorer (not Edge) properly (it doesn't support classList on SVG elements!) */

let cache = {};
const start = '(?:^|\\s)';
const end = '(?:\\s|$)';

function lookupClass(className) {
  var cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cache[className] = cached = new RegExp(start + className + end, 'g');
  }
  return cached;
}

export function add(el, className) {
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

export function rm(el, className) {
  if (el.classList) {
    el.classList.remove(className);
    return;
  }
  el.className = el.className.replace(lookupClass(className), ' ').trim();
}

@bindable({ name: 'moves', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'accepts', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'invalid', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'containers', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'isContainer', attribute: 'is-container', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copy', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'copySortSource', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'revertOnSpill', attribute: 'revert-on-spill', defaultBindingMode: bindingMode.oneTime, defaultValue: true })
@bindable({ name: 'removeOnSpill', attribute: 'remove-on-spill', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'direction', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'ignoreInputTextSelection', attribute: 'ingore-input-text-selection', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'mirrorContainer', attribute: 'mirror-container', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'targetClass', attribute: 'target-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drop-target' })
@bindable({ name: 'sourceClass', attribute: 'source-class', defaultBindingMode: bindingMode.oneTime, defaultValue: 'drag-source' })
@bindable({ name: 'dragFn', attribute: 'drag-fn', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'dropFn', attribute: 'drop-fn', defaultBindingMode: bindingMode.oneTime })
@bindable({ name: 'dragEndFn', attribute: 'drag-end-fn', defaultBindingMode: bindingMode.oneTime })
@customElement('dragula-and-drop')
@inlineView('<template><require from="./dragula.css"></require></template>')
@inject(GLOBAL_OPTIONS)
export class DragulaAndDrop {

  constructor(globalOptions) {
    this.dragula = {};
    this.globalOptions = globalOptions;
  }

  bind() {
    let boundOptions = this._setupOptions();

    let aureliaOptions = {
      isContainer: this._isContainer.bind(this),
      moves: this._moves.bind(this),
      accepts: this._accepts.bind(this),
      invalid: this._invalid.bind(this)
    };

    let options = Object.assign(aureliaOptions, boundOptions);
    this.dragula = new Dragula(options);

    this.dragula.on('drop', this._dropFunction.bind(this));

    this.dragula.on('drag', (item, source) => {
      if (typeof this.dragFn === 'function')
        this.dragFn({ item: item, source: source});
    });

    this.dragula.on('dragend', (item) => {
      if (typeof this.dragEndFn === 'function')
        this.dragEndFn({ item: item });
    })
  }

  unbind() {
    this.dragula.destroy();
  }

  _dropFunction(item, target, source, sibling) {
    this.dragula.cancel();
    if (typeof this.dropFn === 'function')
      this.dropFn({ item: item, target: target, source: source, sibling: sibling });
  }

  _isContainer(el) {
    if (!el) {
      return false;
    }
    if (typeof this.isContainer === 'function') {
      return this.isContainer({ item: el });
    }

    if (this.dragula.dragging) {
      return el.classList.contains(this.targetClass);
    }
    return el.classList.contains(this.sourceClass);
  }

  _moves(item, source, handle, sibling) {
    if (typeof this.moves === 'function') {
      return this.moves({ item: item, source: source, handle: handle, sibling: sibling });
    }
    else {
      return this.globalOptions.moves(item, source, handle, sibling);
    }
  }

  _accepts(item, target, source, sibling) {
    if (typeof this.accepts === 'function') {
      return this.accepts({ item: item, target: target, source: source, sibling: sibling });
    }
    else {
      return this.globalOptions.accepts(item, target, source, sibling);
    }
  }

  _invalid(item, handle) {
    if (typeof this.invalid === 'function') {
      return this.invalid({ item: item, handle: handle });
    }
    else {
      return this.globalOptions.invalid(item, handle);
    }
  }

  _setupOptions() {
    let result = {
      containers: this._getOption('containers'),
      copy: this._getOption('copy'),
      copySortSource: this._getOption('copySortSource'),
      revertOnSpill: this._getOption('revertOnSpill'),
      removeOnSpill: this._getOption('removeOnSpill'),
      direction: this._getOption('direction'),
      ignoreInputTextSelection: this._getOption('ignoreInputTextSelection'),
      mirrorContainer: this._getOption('mirrorContainer')
    };
    return result;
  }

  _getOption(option) {
    if (this[option] == null) {
      return this.globalOptions[option];
    }
    return this[option];
  }
}

import * as classes from './classes';

const MIN_TIME_BETWEEN_REDRAWS_MS = 20;

export class Dragula {

  constructor(options) {
    let len = arguments.length;
    let globalOptions = Container.instance.get(GLOBAL_OPTIONS);
    this.options = Object.assign({}, globalOptions, options);
    this._emitter = new Emitter();
    this.dragging = false;

    if (this.options.removeOnSpill === true) {
      this._emitter.on('over', this.spillOver.bind(this));
      this._emitter.on('out', this.spillOut.bind(this));
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
    this._lastRenderTime = null; // last time we rendered the mirror
    this._lastDropTarget = null; // last container item was over
    this._grabbed; // holds mousedown context until first mousemove
  }

  on(eventName, callback) {
    this._emitter.on(eventName, callback);
  }

  once(eventName, callback) {
    this._emitter.once(eventName, callback);
  }

  off(eventName, fn) {
    this._emitter.off(eventName, fn);
  }

  get containers() {
    return this.options.containers;
  }

  set containers(value) {
    this.options.containers = value;
  }

  isContainer(el) {
    return this.options.containers.indexOf(el) !== -1 || this.options.isContainer(el);
  }

  _events(remove) {
    let op = remove ? 'removeEventListener' : 'addEventListener';
    touchy(document.body, op, 'mousedown', this._grab.bind(this));
    touchy(document.body, op, 'mouseup', this._release.bind(this));
  }

  _eventualMovements(remove) {
    let op = remove ? 'removeEventListener' : 'addEventListener';
    touchy(document.body, op, 'mousemove', this._startBecauseMouseMoved.bind(this));
  }

  _movements(remove) {
    let op = remove ? 'removeEventListener' : 'addEventListener';
    touchy(document.body, op, 'click', this._preventGrabbed.bind(this));
  }

  destroy() {
    this._events(true);
    this._release({});
  }

  _preventGrabbed(e) {
    if (this._grabbed) {
      e.preventDefault();
    }
  }

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
    this._eventualMovements();
    if (e.type === 'mousedown') {
      if (Util.isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    }
  }

  _startBecauseMouseMoved (e) {
    if (!this._grabbed || this.dragging) {
      return;
    }
    if (Util.whichMouseButton(e) === 0) {
      this._release({});
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }
    // truthy check fixes #239, equality fixes #207
    if (e.clientX !== void 0 && e.clientX === this._moveX && e.clientY !== void 0 && e.clientY === this._moveY) {
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

    let offset = Util.getOffset(this._item);
    this._offsetX = Util.getCoord('pageX', e) - offset.left;
    this._offsetY = Util.getCoord('pageY', e) - offset.top;

    classes.add(this._copy || this._item, 'gu-transit');
    this.renderMirrorImage();
  }

  _canStart(item) {
    if (this.dragging && this._mirror) {
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
      this._emitter.emit('cloned', this._copy, context.item, 'copy');
    }

    this._source = context.source;
    this._item = context.item;
    this._initialSibling = context.item.nextSibling;
    this._currentSibling = Util.nextEl(context.item);

    this.dragging = true;
    this._emitter.emit('drag', this._item, this._source);
  }

  end() {
    if (!this.dragging) {
      return;
    }
    let item = this._copy || this._item;
    this.drop(item, Util.getParent(item));
  }

  _ungrab() {
    this._grabbed = false;
    this._eventualMovements(true);
    this._movements(true);
  }

  _release(e) {
    this._ungrab();

    if (!this.dragging) {
      return;
    }
    let item = this._copy || this._item;
    let clientX = Util.getCoord('clientX', e);
    let clientY = Util.getCoord('clientY', e);
    let elementBehindCursor = Util.getElementBehindPoint(this._mirror, clientX, clientY);
    let dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY);
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
      this._emitter.emit('cancel', item, this._source, this._source);
    } else {
      this._emitter.emit('drop', item, target, this._source, this._currentSibling);
    }
    this._cleanup();
  }

  remove() {
    if (!this.dragging) {
      return;
    }
    let item = this._copy || this._item;
    let parent = Util.getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    this._emitter.emit(this._copy ? 'cancel' : 'remove', item, parent, this._source);
    this._cleanup();
  }

  cancel(revert) {
    if (!this.dragging) {
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
      this._emitter.emit('cancel', item, this._source, this._source);
    } else {
      this._emitter.emit('drop', item, parent, this._source, this._currentSibling);
    }
    this._cleanup();
  }

  _cleanup () {
    let item = this._copy || this._item;
    this._ungrab();
    this.removeMirrorImage();
    if (item) {
      classes.rm(item, 'gu-transit');
    }
    this.dragging = false;
    if (this._lastDropTarget) {
      this._emitter.emit('out', item, this._lastDropTarget, this._source);
    }
    this._emitter.emit('dragend', item);
    this._source = this._item = this._copy = this._initialSibling = this._currentSibling = this._lastRenderTime = this._lastDropTarget = null;
  }

  _isInitialPlacement(target, s) {
    let sibling;
    if (s !== void 0) {
      sibling = s;
    } else if (this._mirror) {
      sibling = this._currentSibling;
    } else {
      sibling = (this._copy || this._item).nextSibling;
    }
    return target === this._source && sibling === this._initialSibling;
  }

  _findDropTarget(elementBehindCursor, clientX, clientY) {
    let accepted = () => {
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

    let target = elementBehindCursor;
    while (target && !accepted()) {
      target = Util.getParent(target);
    }
    return target;
  }

  drag(e) {
    if (!this._mirror) {
      return;
    }

    if (this._lastRenderTime !== null && Date.now() - this._lastRenderTime < MIN_TIME_BETWEEN_REDRAWS_MS) {
      return;
    }
    this._lastRenderTime = Date.now();
    e.preventDefault();

    let moved = (type) => { this._emitter.emit(type, item, this._lastDropTarget, this._source); }
    let over = () => { if (changed) { moved('over'); } }
    let out = () => { if (this._lastDropTarget) { moved('out'); } }

    let clientX = Util.getCoord('clientX', e);
    let clientY = Util.getCoord('clientY', e);
    let x = clientX - this._offsetX;
    let y = clientY - this._offsetY;

    this._mirror.style.left = x + 'px';
    this._mirror.style.top = y + 'px';

    let item = this._copy || this._item;
    let elementBehindCursor = Util.getElementBehindPoint(this._mirror, clientX, clientY);
    let dropTarget = this._findDropTarget(elementBehindCursor, clientX, clientY);
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
      this._emitter.emit('shadow', item, dropTarget, this._source);
    }
  }

  spillOver(el) {
    classes.rm(el, 'gu-hide');
  }

  spillOut(el) {
    if (this.dragging) { classes.add(el, 'gu-hide'); }
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
    touchy(document.documentElement, 'addEventListener', 'mousemove', this.drag.bind(this));
    classes.add(this.options.mirrorContainer, 'gu-unselectable');
    this._emitter.emit('cloned', this._mirror, this._item, 'mirror');
  }

  removeMirrorImage() {
    if (this._mirror) {
      classes.rm(this.options.mirrorContainer, 'gu-unselectable');
      touchy(document.documentElement, 'removeEventListener', 'mousemove', this.drag.bind(this));
      Util.getParent(this._mirror).removeChild(this._mirror);
      this._mirror = null;
    }
  }

  getReference(dropTarget, target, x, y) {
    let outside = () => { // slower, but able to figure out any position
      let len = dropTarget.children.length;
      let i;
      let el;
      let rect;
      for (i = 0; i < len; i++) {
        el = dropTarget.children[i];
        rect = el.getBoundingClientRect();
        if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
        if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
      }
      return null;
    }

    let resolve = (after) => {
      return after ? Util.nextEl(target) : target;
    }

    let inside = () => { // faster, but only available if dropped inside a child element
      let rect = target.getBoundingClientRect();
      if (horizontal) {
        return resolve(x > rect.left + Util.getRectWidth(rect) / 2);
      }
      return resolve(y > rect.top + Util.getRectHeight(rect) / 2);
    }


    let horizontal = this.options.direction === 'horizontal';
    let reference = target !== dropTarget ? inside() : outside();
    return reference;
  }

  _isCopy(item, container) {
    return typeof this.options.copy === 'boolean' ? this.options.copy : this.options.copy(item, container);
  }

}
//let debounce = require('./debounce');

class EventListener {

  constructor(func, once = false) {
    this.func = func;
    this.once = once;
  }
}

export class Emitter {

  constructor(options) {
    this.options = options || {};
    this.events = {};
  }

  on(type, fn, once = false) {
    let newEvent = new EventListener(fn, once);
    if (this.events[type] === undefined) {
      this.events[type] = [];
    }
    this.events[type].push(newEvent);
  }

  once(type, fn) {
    this.on(type, fn, true);
  }

  off(type, fn) {
    if (arguments.length === 1) {
      delete this.events[type];
    }
    else if (arguments.length === 0) {
      this.events = {};
    }
    else {
      let eventList = this.events[type];
      if (eventList) {
        let index = eventList.findIndex(x => x.func === fn);
        if (index >= 0)
          eventList.splice(index, 1);
      }
    }
  }

  emit() {
    let args = arguments ? [...arguments] : [];
    let type = args.shift();
    let et = (this.events[type] || []).slice(0);
    if (type === 'error' && this.options.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
    let toDeregister = [];
    et.forEach(listener => {
      if (this.options.async) {
        debounce(listener.func, ...args);
      }
      else {
        listener.func(...args);
      }
      if (listener.once) {
        toDeregister.push(listener);
      }
    });
    toDeregister.forEach(listener => {
      this.off(type, listener.func);
    });
  }
}

export function moveBefore(array, itemMatcherFn, siblingMatcherFn) {
  let removedItem = remove(array, itemMatcherFn);
  let nextIndex = array.findIndex(siblingMatcherFn);
  array.splice(nextIndex >= 0 ? nextIndex : array.length, 0, removedItem);
}

function remove(array, matcherFn) {
  let index = array.findIndex(matcherFn);
  if (index >= 0) {
    return array.splice(index, 1)[0];
  }
}
export const GLOBAL_OPTIONS = 'GlobalOptions';

export const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

export class Options {

  constructor() {
    this.moves = Options.always;
    this.accepts = Options.always;
    this.invalid = Options.invalidTarget;
    this.containers = [];
    this.isContainer = Options.never;
    this.copy = false;
    this.copySortSource = false;
    this.revertOnSpill = false;
    this.removeOnSpill = false;
    this.direction = DIRECTION.VERTICAL,
    this.ignoreInputTextSelection = true;
    this.mirrorContainer = document.body;
  }

  static always() {
    return true;
  }

  static never() {
    return false;
  }

  static invalidTarget() {
    return false;
  }
}
const touch = {
  mouseup: 'touchend',
  mousedown: 'touchstart',
  mousemove: 'touchmove'
};
const pointers = {
  mouseup: 'pointerup',
  mousedown: 'pointerdown',
  mousemove: 'pointermove'
};
const microsoft = {
  mouseup: 'MSPointerUp',
  mousedown: 'MSPointerDown',
  mousemove: 'MSPointerMove'
};

export function touchy(el, op, type, fn) {
  if (window.navigator.pointerEnabled) {
    el[op](pointers[type], fn);
  } else if (window.navigator.msPointerEnabled) {
    el[op](microsoft[type], fn);
  } else {
    el[op](touch[type], fn);
    el[op](type, fn);
  }
}
export class Util {
    //nextEl
  static nextEl(el) {
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
  static whichMouseButton(e) {
    if (e.touches !== void 0) { return e.touches.length; }
    if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
    if (e.buttons !== void 0) { return e.buttons; }
    let button = e.button;
    if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
      return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
    }
  }

  //getElementBehindPoint
  static getElementBehindPoint(point, x, y) {
    let p = point || {};
    let state = p.className;
    let el;
    p.className += ' gu-hide';
    el = document.elementFromPoint(x, y);
    p.className = state;
    return el;
  }

  static getParent(el) { return el.parentNode === document ? null : el.parentNode; }
  static getRectWidth(rect) { return rect.width || (rect.right - rect.left); }
  static getRectHeight(rect) { return rect.height || (rect.bottom - rect.top); }
  static isInput(el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || Util.isEditable(el); }
  static isEditable(el) {
    if (!el) { return false; } // no parents were editable
    if (el.contentEditable === 'false') { return false; } // stop the lookup
    if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
    return Util.isEditable(Util.getParent(el)); // contentEditable is set to 'inherit'
  }

  static getOffset(el) {
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + Util.getScroll('scrollLeft', 'pageXOffset'),
      top: rect.top + Util.getScroll('scrollTop', 'pageYOffset')
    };
  }

  static getScroll(scrollProp, offsetProp) {
    if (typeof window[offsetProp] !== 'undefined') {
      return window[offsetProp];
    }
    if (document.documentElement.clientHeight) {
      return document.documentElement[scrollProp];
    }
    return document.body[scrollProp];
  }

  static getElementBehindPoint(point, x, y) {
    if (point)
      point.classList.add('gu-hide');

    let el = document.elementFromPoint(x, y);

    if (point)
      point.classList.remove('gu-hide');
    return el;
  }

  static getEventHost(e) {
    // on touchend event, we have to use `e.changedTouches`
    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
    // see https://github.com/bevacqua/dragula/issues/34
    if (e.targetTouches && e.targetTouches.length) {
      return e.targetTouches[0];
    }
    if (e.changedTouches && e.changedTouches.length) {
      return e.changedTouches[0];
    }
    return e;
  }

  static getCoord(coord, e) {
    let host = Util.getEventHost(e);
    return host[coord];
  }

  static getImmediateChild(dropTarget, target) {
    let immediate = target;
    while (immediate !== dropTarget && Util.getParent(immediate) !== dropTarget) {
      immediate = Util.getParent(immediate);
    }
    if (immediate === document.documentElement) {
      return null;
    }
    return immediate;
  }
}