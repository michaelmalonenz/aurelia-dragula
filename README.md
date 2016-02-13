# Aurelia-Dragula is intended to be an (Aurelia)[https://aurelia.io] plugin

Because of the way Aurelia works, I have decided to fork (Dragula)[https://github.com/bevacqua/dragula] and make it a bit more friendly to the framework.

I intend to make large structural and philosophical changes to the code (which is why I forked, rather than submit pull requests).  It is not that I thought the original is a bad library - far from it, it's a great, pure javascript interface for something that has traditionally been difficult, that suddenly isn't.  I just want a specialised version of it, which I didn't think I could achieve by making a wrapper of it.

To use the library, run `npm install`, `jspm install`, `gulp build`, `gulp test`

If installing in an aurelia application, `jspm install aurelia-dragula=github:michaelmalonenz/aurelia-dragula` and remember to `aurelia.use.plugin('aurelia-dragula')` in your initialisation code.