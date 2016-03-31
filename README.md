# Aurelia-Dragula

aurelia-dragula is an [Aurelia](https://aurelia.io) plugin which provides a simple (but not simplistic) library to add drag and drop functionality.

Because of the way Aurelia works, I have decided to fork [Dragula](https://github.com/bevacqua/dragula) and make it a bit more friendly to the framework.

I intend to make large structural and philosophical changes to the code (which is why I forked, rather than submit pull requests).  It is not that I thought the original is a bad library - far from it, it's a great, pure javascript interface for something that has traditionally been difficult, that suddenly isn't.  I just want a specialised version of it, which I didn't think I could achieve by making a wrapper of it.

To develop for the library, run `npm install`, `jspm install`, `gulp build`, `gulp test`

If installing in an aurelia application, `jspm install npm:aurelia-dragula` and remember to `aurelia.use.plugin('aurelia-dragula')` in your initialisation code.

As Aurelia doesn't support IE <= 9, Aurelia-Dragula won't, either.  Aurelia-dragula has zero external dependencies.  None. Nada. Keine. Not a one.

##Usage

```javascript
import {Dragula} from 'aurelia-dragula';

let dragula = new Dragula();
```

Because of the way aurelia works, it is recommended that the `dragend` event is subscribed to and `cancel` is then called, doing the manipulation of the view-models in JavaScript and letting aurelia re-render the changes.  This is not only recommended, but vital inside of a `repeat.for`.

In fact, if you use the Aurelia Custom Element provided, instead of the raw Dragula object, then the `cancel`ling is done for you.

###Custom Element
The Custom Element is a convenience for Aurelia.  One can place an element on the page, set the selectors for the source and target containers and immediately get some Drag and Drop functionality.  It becomes a little more involved once actually moving things around on the page, but not a lot.  The main differences with this Element and using the raw API yourself, is that the `revertOnSpill` option is set to true by default and the drag operation is automatically cancelled.

The element itself is called `dragula-and-drop` and you can bind all the options available for the main library (with camel-case converted to hyphenated attribute names in the standard way) to it as well as a couple of extras.  The functions are short-hand for binding to the equivalent events and should be bound with `.call` and if you want to receive arguments, they should be named the same as in the Type column below:

Attribute | Type | Default Value | Description
--------|------|---------------|------------
target-class | `string` | 'drop-target' | The css class name describing any container element which can be a drop target.
source-class | `string` | 'drag-source' | The css class name describing any container element which can be a drag source.
drag-fn | `function(item, source)` | null | A function to be called when dragging begins
drop-fn | `function(item, target, source, sibling)` | null | A function to be called when the item is dropped.
drag-end-fn | `function(item)` | null | A function to be called when the drag operation has completed.

E.g:  
viewmodel.html:
```html
<template>
  <dragula-and-drop drop-fn.call="itemDropped(item, target, source, sibling)"></dragula-and-drop>
  <div class="drag-source drop-target">
    <compose repeat.for="thing of things" view-model.bind="thing"></compose>
  </div>
</template>
```
viewmodel.js:
```javascript
export class ViewModel {

  constructor() {
    this.things = [];
  }

  itemDropped(item, target, source, sibling) {
    //do things in here
  }
}
```

As an extra helping hand, I have also exposed a helper function for moving an item before the sibling in an array (for such bindings as the previous ones):
`function moveBefore(array, itemMatcherFn, siblingMatcherFn)`
Where `array` is the array in which to move the objects,
`itemMatcherFn` is a function which takes one of the items in `array` as an argument and returns a boolean, to say whether the js Object matches the item HTMLElement being dragged or not.
`siblingMatcherFn` is a function which takes one of the items in `array` as an argument and returns a boolean, to say whether the js Object matches the sibling HTMLElement.

A more complete example is available [here](https://github.com/michaelmalonenz/aurelia-dragula-example).



###Options
`import {Options} from 'aurelia-dragula;`

The options can either be passed in as a parameter to the Dragula constructor for individual instances, or can be set globally during plugin configuration:

```javascript
let options = new Options();
options.revertOnSpill = false;
let dragula = new Dragula(options);
```
or
```javascript
aurelia.use('aurelia-dragula', (options) => {
  options.revertOnSpill = false;
});
```

They can be used in conjunction with one another, with the individually set settings taking precedence over the global settings.

Option | Type | Default Value | Description
-------|------|---------------|-------------
moves | `function(item, source, handle, sibling):bool` | Options.always | When the drag operation is set to begin, this function is called to see whether the `item`, just before `sibling` in the DOM, to be dragged from `source`, by clicking on `handle` is allowed to be dragged.  Returning true begins the drag operation, returning false stops the drag from happening.
accepts | `function(item, target, source, sibling):bool` | Options.always | When the `item`, just before `sibling`, being dragged from `source` is dropped, this function is called to see whether the `target` container is allowed to accept the drop.  The resulting action depends on other options (`revertOnSpill` and `removeOnSpill`).  Returning true allows the drop, returning false causes the Spill action to complete.
invalid | `function(item, handle):bool` | Options.invalidTarget | When starting to drag an item, by clicking on handle, this function can decide that it's not valid to drag that item after all.
containers | `Array<HTMLElement>` | [] | Can pre-load an array of HTMLElements which are considered to be containers.  This list takes priority over the `isContainer` and `accepts` functions.  Containers are used to determine whether elements can be dragged and can be dropped.
isContainer | `function(item):bool` | Options.never | This function returns whether the item can be considered a container.  This is lower precedence than the `containers` and `accepts` options, but higher precendence than the `moves` function.
copy | `bool` | false | If this is set to true, then dropping an item will cause it to be copied, rather than moved.
copySortSource | `bool` | false |
revertOnSpill | `bool` | false | If the item is dropped outside of a valid container, then the drag operation will be reverted.
removeOnSpill | `bool` | false | If the item is dropped outside of a valid container, then the item will be removed from the DOM.
direction | `DIRECTION` | DIRECTION.VERTICAL | `DIRECTION` can be imported from aurelia-dragula and the other valid option is `HORIZONTAL`.  This tells aurelia-dragula which direction the drag operations are expected to happen in.
ignoreInputTextSelection | `bool` | true | If set to true, if the user clicks inside an input element, then the drag operations won't be started, allowing the user to select text inside an input without causing the element to drag.
mirrorContainer | `Node` | document.body | This is the container to which the mirror elements are added.  The mirror element is element being moved around with the mouse (not the semi-transparent placeholder element).


###Events
Events can be subscribed to by calling `dragula.on` with the event name and a callback.  They can be registered for multiple times, with different callbacks.

```javascript
dragula.on('drag', (el, source) => {
  //do a thing here
});
```

Events can be unsubscribed from by calling the `dragula.off` function.  If only an event type is passed, then all subscribers for that event will be unsubscribed.  If a function is also given, then only the subscriber with the matching callback will be unsubscribed:

```javascript
let fn = (el, source) => {
  //do a thing here
};
dragula.on('drag', fn);

dragula.off('drag', fn);
dragula.off('dragend');
```

If you only want the event to fire exactly once, then instead of registering and de-registering manually, the `dragula.once` registration function may be used:

```javascript
dragula.once('drag', (el, source) => {
  //do a thing here
});
```

Event Name | Listener Arguments               | Event Description
-----------|----------------------------------|-------------------------------------------------------------------------------------
`drag`     | `el, source`                     | `el` was lifted from `source`
`dragend`  | `el`                             | Dragging event for `el` ended with either `cancel`, `remove`, or `drop`
`drop`     | `el, target, source, sibling`    | `el` was dropped into `target` before a `sibling` element, and originally came from `source`
`cancel`   | `el, container, source`          | `el` was being dragged but it got nowhere and went back into `container`, its last stable parent; `el` originally came from `source`
`remove`   | `el, container, source`          | `el` was being dragged but it got nowhere and it was removed from the DOM. Its last stable parent was `container`, and originally came from `source`
`shadow`   | `el, container, source`          | `el`, _the visual aid shadow_, was moved into `container`. May trigger many times as the position of `el` changes, even within the same `container`; `el` originally came from `source`
`over`     | `el, container, source`          | `el` is over `container`, and originally came from `source`
`out`      | `el, container, source`          | `el` was dragged out of `container` or dropped, and originally came from `source`
`cloned`   | `clone, original, type`          | DOM element `original` was cloned as `clone`, of `type` _(`'mirror'` or `'copy'`)_. Fired for mirror images and when `copy: true`
