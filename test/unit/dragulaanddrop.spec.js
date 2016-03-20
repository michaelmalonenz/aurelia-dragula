import {raise} from './lib/events';

import {DragulaAndDrop} from '../../src/dragula-and-drop';

describe('the Dragula and Drop Custom Element', function() {

  beforeEach(function() {
    //these represent the bindings with defaultValues
    this.options = {
      revertOnSpill: true,
      targetClass: 'drop-target',
      sourceClass: 'drag-source',
      dragFn: (item, source) => {},
      dropFn: (item, target, source, sibling) => {},
      dragEndFn: (item) => {}
    };

    this.item = document.createElement('div');
    this.sibling = document.createElement('div');
    this.container = document.createElement('div');
    this.container.classList.add('drag-source');
    this.container.classList.add('drop-target');

    this.commentBegin = document.createComment('<view>');
    this.commentEnd = document.createComment('</view>');

    this.container.appendChild(this.commentBegin);
    this.container.appendChild(this.item);
    this.container.appendChild(this.commentEnd);

    this.container.appendChild(this.commentBegin);
    this.container.appendChild(this.sibling);
    this.container.appendChild(this.commentEnd);

    document.body.appendChild(this.container);

    this.createDragula = () => {
      this.dragulaAndDrop = new DragulaAndDrop();
      Object.assign(this.dragulaAndDrop, this.options);
      this.dragulaAndDrop.bind();
    };
  });

  afterEach(function() {
    this.dragulaAndDrop.unbind();
    document.body.removeChild(this.container);
  });

  it('should use the isContainer function if it is bound', function() {
    //arrange
    let wasCalled = false;
    this.options.isContainer = (argsObj) => {
      wasCalled = true;
    };
    this.createDragula();

    //act
    this.dragulaAndDrop.dragula.options.isContainer(this.container);

    //assert
    expect(wasCalled).toBeTruthy();
  });

  it('should be able to determine container-ness from the classes if isContainer is not bound', function() {
    //arrange
    this.createDragula();
    let result = false;

    //act
    let test = () => {
      result = this.dragulaAndDrop.dragula.options.isContainer(this.container);
    };

    //assert
    expect(test).not.toThrow();
    expect(result).toBeTruthy();
  });

  it('should use the moves function if it is bound', function() {
    //arrange
    let wasCalled = false;
    this.options.moves = (argsObj) => {
      wasCalled = true;
    };
    this.createDragula();

    //act
    this.dragulaAndDrop.dragula.options.moves(this.item);

    //assert
    expect(wasCalled).toBeTruthy();
  });

  it('should not throw is the moves function is not bound', function() {
    //arrange
    this.createDragula();

    //act
    let test = () => this.dragulaAndDrop.dragula.options.moves(this.item);

    //assert
    expect(test).not.toThrow();
  });

  it('should use the accepts function if it is bound', function() {
    //arrange
    let wasCalled = false;
    this.options.accepts = (argsObj) => {
      wasCalled = true;
    };
    this.createDragula();

    //act
    this.dragulaAndDrop.dragula.options.accepts(this.item);

    //assert
    expect(wasCalled).toBeTruthy();
  });

  it('should not throw is the accepts function is not bound', function() {
    //arrange
    this.createDragula();

    //act
    let test = () => {
      this.dragulaAndDrop.dragula.options.accepts(this.item);
    }

    //assert
    expect(test).not.toThrow();
  });
});