import {createDragula} from '../lib/create-dragula';
import {Options} from '../../../src/aurelia/options';

describe('destroy', function() {
  beforeEach(function() {
    this.drake = createDragula();
  })

  it('does not throw when not dragging, destroyed, or whatever when called once', function() {
    expect(() => this.drake.destroy()).not.toThrow();
  });

  it('does not throw when not dragging, destroyed, or whatever when called multiple times', function() {
    let test = () => {
      this.drake.destroy();
      this.drake.destroy();
      this.drake.destroy();
      this.drake.destroy();
    };

    expect(test).not.toThrow();
  });
});

describe('destroy', function() {

  beforeEach(function() {
    this.div = document.createElement('div');
    this.item = document.createElement('div');
    this.dragendCalled = false;
  });

  it('when dragging, DOM is left in tact', function() {
    //arrange
    let drake = createDragula([this.div]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    drake.manualStart(this.item);

    //act
    drake.destroy();

    //assert
    expect(this.div.children.length).toBe(1);
    expect(drake.dragging).toBe(false);
  });

  it('when dragging and destroy gets called, dragend event is emitted gracefully', function() {
    //arrange
    let drake = createDragula([this.div]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    drake.on('dragend', () => this.dragendCalled = true);
    drake.manualStart(this.item);

    //act
    drake.destroy();

    //assert
    expect(this.dragendCalled).toBeTruthy();
  });

  it('when dragging a copy and destroy gets called, default does not revert', function() {
    let div2 = document.createElement('div');
    let drake = createDragula([this.div, div2]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    document.body.appendChild(div2);
    drake.manualStart(this.item);
    div2.appendChild(this.item);
    drake.on('drop', (target, parent, source) => {
      expect(target).toBe(this.item);
      expect(parent).toBe(div2);
      expect(source).toBe(this.div);
    });
    drake.on('dragend', () => this.dragendCalled = true);

    //act
    drake.destroy();

    //assert
    expect(this.dragendCalled).toBeTruthy();
  });

  it('when dragging a copy and destroy gets called, revert is executed', function() {
    //arrange
    let div2 = document.createElement('div');
    let options = new Options();
    options.revertOnSpill = true;
    let drake = createDragula([this.div, div2], options);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    document.body.appendChild(div2);
    drake.manualStart(this.item);
    div2.appendChild(this.item);

    drake.on('cancel', (target, container) => {
      expect(target).toBe(this.item);
      expect(container).toBe(this.div);
    });
    drake.on('dragend', () => this.dragendCalled = true);

    //act
    drake.destroy();

    //assert
    expect(this.dragendCalled).toBeTruthy();
  });
});
