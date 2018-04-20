# Aurelia-Dragula

aurelia-dragula is an [Aurelia](https://aurelia.io) plugin which provides a simple (but not simplistic) library to add drag and drop functionality.

Because of the way Aurelia works, I have decided to fork [Dragula](https://github.com/bevacqua/dragula) and make it a bit more friendly to the framework.

To develop for the library, run `npm install`, `jspm install`, `gulp build`, `gulp test`

If installing in an aurelia application, `jspm install npm:aurelia-dragula` and remember to `aurelia.use.plugin('aurelia-dragula')` in your initialisation code.  Aurelia-dragula is also webpack compatible.

As Aurelia doesn't support IE < 9, Aurelia-Dragula won't, either.  Aurelia-dragula has zero external dependencies.  None. Nada. Keine. Not a one.

Aurelia Dragula differs from the upstream library, in that it also passes the view-models for the `item` (and `sibling` on the drop event) if the item being dragged corresponds to an Aurelia Custom Element.

## Usage

The element itself is called `dragula-and-drop` and you can bind all the options available for the main library (with camel-case converted to hyphenated attribute names in the standard way) to it as well as a couple of extras.  The functions are short-hand for binding to the equivalent events and should be bound with `.call` and if you want to receive arguments, they should be named the same as in the Type column below:

<table>
  <tr>
    <th>Attribute</th><th>Type</th><th>Default Value</th>
  </tr>
  <tr><th colspan="3">Description</th></tr>
  <tr>
    <td>target-class</td><td>string</td><td>'drop-target'</td>
  </tr>
  <tr>
    <td colspan="3">The css class name describing any container element which can be a drop target.</td>
  </tr>
  <tr>
    <td>source-class</td><td>string</td><td>'drag-source'</td>
  </tr>
  <tr>
    <td colspan="3">The css class name describing any container element which can be a drag source.</td>
  </tr>
  <tr>
    <td>drag-fn</td><td>function(item, source, itemVM)</td><td>null</td>
  </tr>
  <tr>
    <td colspan="3">A function to be called when dragging begins.</td>
  </tr>

  <tr>
    <td>drop-fn</td><td>function(item, target, source, sibling, itemVM, siblingVM</td><td>null</td>
  </tr>
  <tr>
    <td colspan="3">A function to be called when the item is dropped.</td>
  </tr>
  <tr>
    <td>drag-end-fn</td><td>function(item, itemVM)</td><td>null</td>
  </tr>
  <tr>
    <td colspan="3">A function to be called when the drag operation completes.</td>
  </tr>
</table>

E.g:
viewmodel.html:
```html
<template>
  <dragula-and-drop drop-fn.call="itemDropped(item, target, source, sibling, itemVM, siblingVM)"></dragula-and-drop>
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

  itemDropped(item, target, source, sibling, itemVM, siblingVM) {
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


### Options
`import {Options} from 'aurelia-dragula;`

The options can either be passed in as a parameter to the Dragula constructor for individual instances, or can be set globally during plugin configuration:

```javascript
let options = new Options();
options.revertOnSpill = false;
let dragula = new Dragula(options);
```
or
```javascript
aurelia.use
  .plugin('aurelia-dragula', (options) => {
    options.revertOnSpill = false;
  });
```

They can be used in conjunction with one another, with the individually set settings taking precedence over the global settings.

<table>
  <tr>
    <th>Attribute</th><th>Type</th><th>Default Value</th>
  </tr>
  <tr><th colspan="3">Description</th></tr>
  <tr>
    <td>moves</td><td>function(item, source, handle, sibling):boolean</td><td>Options.always</td>
  </tr>
  <tr>
    <td colspan="3">When the drag operation is set to begin, this function is called to see whether the item, just before sibling in the DOM, to be dragged from source, by clicking on handle is allowed to be dragged.  Returning true begins the drag operation, returning false stops the drag from happening.</td>
  </tr>
  <tr>
    <td>accepts</td><td>function(item, target, source, sibling):boolean</td><td>Options.always</td>
  </tr>
  <tr>
    <td colspan="3">When the item, just before sibling, being dragged from source is dropped, this function is called to see whether the target container is allowed to accept the drop.  The resulting action depends on other options (revertOnSpill and removeOnSpill).  Returning true allows the drop, returning false causes the Spill action to complete.</td>
  </tr>
  <tr>
    <td>invalid</td><td>function(item, handle):boolean</td><td>Options.invalidTarget</td>
  </tr>
  <tr>
    <td colspan="3">When starting to drag an item, by clicking on handle, this function can decide that it's not valid to drag that item after all.</td>
  </tr>
  <tr>
    <td>containers</td><td>Array&lt;HTMLElement&gt;</td><td>[]</td>
  </tr>
  <tr>
    <td colspan="3">Can pre-load an array of HTMLElements which are considered to be containers.  This list takes priority over the isContainer and accepts functions.  Containers are used to determine whether elements can be dragged and can be dropped.</td>
  </tr>
  <tr>
    <td>isContainer</td><td>function(item)</td><td>Options.never</td>
  </tr>
  <tr>
    <td colspan="3">This function returns whether the item can be considered a container.  This is lower precedence than the containers and accepts options, but higher precendence than the moves function.</td>
  </tr>
  <tr>
    <td>copy</td><td>boolean</td><td>false</td>
  </tr>
  <tr>
    <td colspan="3">If this is set to true, then dragging an item will cause it to be copied, rather than moved.</td>
  </tr>
  <tr>
    <td>copySortSource</td><td>boolean</td><td>false</td>
  </tr>
  <tr>
    <td colspan="3"></td>
  </tr>
  <tr>
    <td>revertOnSpill</td><td>boolean</td><td>true</td>
  </tr>
  <tr>
    <td colspan="3">If the item is dropped outside of a valid container, then the drag operation will be reverted.</td>
  </tr>
  <tr>
    <td>removeOnSpill</td><td>boolean</td><td>false</td>
  </tr>
  <tr>
    <td colspan="3">If the item is dropped outside of a valid container, then the item will be removed from the DOM.</td>
  </tr>
  <tr>
    <td>direction</td><td>DIRECTION</td><td>DIRECTION.VERTICAL</td>
  </tr>
  <tr>
    <td colspan="3">DIRECTION can be imported from aurelia-dragula and the other valid option is HORIZONTAL.  This tells aurelia-dragula which direction the drag operations are expected to happen in.</td>
  </tr>
  <tr>
    <td>ignoreInputTextSelection</td><td>boolean</td><td>true</td>
  </tr>
  <tr>
    <td colspan="3">If set to true, if the user clicks inside an input element, then the drag operations won't be started, allowing the user to select text inside an input without causing the element to drag.</td>
  </tr>
  <tr>
    <td>mirrorContainer</td><td>Node</td><td>document.body</td>
  </tr>
  <tr>
    <td colspan="3">This is the container to which the mirror elements are added.  The mirror element is element being moved around with the mouse (not the semi-transparent placeholder element).</td>
  </tr>
</table>


### Events
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
dragula.once('drag', (item, source, itemVM) => {
  //do a thing here
});
```

<table>
  <tr>
    <th>Event Name</th><th>Listener Arguments</th>
  </tr>
  <tr><th colspan="2">Event Description</th></tr>
  <tr>
    <td>drag</td><td>item, source, itemVM</td>
  </tr>
  <tr>
    <td colspan="2">item was lifted from source</td>
  </tr>
  <tr>
    <td>dragend</td><td>item, itemVM</td>
  </tr>
  <tr>
    <td colspan="2">Dragging event for item ended with either cancel, remove, or drop</td>
  </tr>
  <tr>
    <td>drop</td><td>item, target, source, sibling, itemVM, siblingVM</td>
  </tr>
  <tr>
    <td colspan="2">item was dropped into target, before a sibling element, and originall came from source</td>
  </tr>
  <tr>
    <td>cancel</td><td>item, container, source, itemVM</td>
  </tr>
  <tr>
    <td colspan="2">item was being dragged but it got nowhere and went back into container, its last stable parent; item originally came from source</td>
  </tr>
  <tr>
    <td>remove</td><td>item, container, source, itemVM</td>
  </tr>
  <tr>
    <td colspan="2">item was being dragged but it got nowhere and was removed from the DOM.  Its last stable parent; item originally came from source</td>
  </tr>
  <tr>
    <td>shadow</td><td>item, container, source, itemVM</td>
  </tr>
  <tr>
    <td colspan="2">item, the visual aid shadow, was moved into container.  May trigger many times as the position of item changes, even within the same container.  item originally came from source.</td>
  </tr>
  <tr>
    <td>over</td><td>item, container, source, itemVM</td>
  </tr>
  <tr>
    <td colspan="2">item is over container, and originally came from source</td>
  </tr>
  <tr>
    <td>out</td><td>item, container, source, itemVM</td>
  </tr>
  <tr>
    <td colspan="2">item was dragged out of container and originally came from source</td>
  </tr>
  <tr>
    <td>cloned</td><td>clone, original, type</td>
  </tr>
  <tr>
    <td colspan="2">DOM element original was cloned as clone, of type ('mirror' or 'copy').  Fired for mirror images and when copy: true</td>
  </tr>
</table>

