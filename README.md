# Aurelia-Dragula is intended to be an [Aurelia](https://aurelia.io) plugin

Because of the way Aurelia works, I have decided to fork [Dragula](https://github.com/bevacqua/dragula) and make it a bit more friendly to the framework.

I intend to make large structural and philosophical changes to the code (which is why I forked, rather than submit pull requests).  It is not that I thought the original is a bad library - far from it, it's a great, pure javascript interface for something that has traditionally been difficult, that suddenly isn't.  I just want a specialised version of it, which I didn't think I could achieve by making a wrapper of it.

To develop for the library, run `npm install`, `jspm install`, `gulp build`, `gulp test`

If installing in an aurelia application, `jspm install aurelia-dragula=github:michaelmalonenz/aurelia-dragula` and remember to `aurelia.use.plugin('aurelia-dragula')` in your initialisation code.

As Aurelia doesn't support IE <= 9, Aurelia-Dragula won't, either.

##Usage

```javascript
import {Dragula} from 'aurelia-dragula';

let dragula = new Dragula();
```

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
accepts | `function(item, target, source, currentSibling):bool` | Options.always | When the `item`, just before `currentSibling`, being dragged from `source` is dropped, this function is called to see whether the `target` container is allowed to accept the drop.  The resulting action depends on other options (`revertOnSpill` and `removeOnSpill`).  Returning true allows the drop, returning false causes the Spill action to complete.
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
