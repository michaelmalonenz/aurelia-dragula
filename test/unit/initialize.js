import 'aurelia-polyfills';
import {initialize} from 'aurelia-pal-browser';
import {Container} from 'aurelia-dependency-injection';
import {GLOBAL_OPTIONS, Options} from '../../src/options';

initialize();

let container = new Container();
container.registerInstance(GLOBAL_OPTIONS, new Options());
container.makeGlobal();