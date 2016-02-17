import {dragula} from '../../src/dragula';
import {raise} from './lib/events';

describe('when dragging and remove is called', function() {

  describe('does not throw', function() {

    beforeEach(function() {
      this.drake = dragula();
    });

    it('a single time', function() {
      let test = () => this.drake.remove();
      expect(test).not.toThrow();
    });

    it('multiple times', function() {
      let test = () => {
        this.drake.remove();
        this.drake.remove();
        this.drake.remove();
        this.drake.remove();
      };

      expect(test).not.toThrow();
    });
  });

  beforeEach(function() {
    this.div = document.createElement('div');
    this.item = document.createElement('div');
  });  

  it('when dragging and remove gets called, element is removed', function() {
    //arrange
    let drake = dragula([this.div]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    drake.start(this.item);

    //act
    drake.remove();

    //assert
    expect(this.div.children.length).toBe(0);
    expect(drake.dragging).toBeFalsy();
  });

  it('when dragging and remove gets called, remove event is emitted', function() {
    //arrange
    let dragendCalled = false;
    let drake = dragula([this.div]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    drake.start(this.item);
    drake.on('remove', (target, container) => {
      expect(target).toBe(this.item);
      expect(container).toBe(this.div);
    });
    drake.on('dragend', () => dragendCalled = true);

    //act
    drake.remove();

    //assert
    expect(dragendCalled).toBeTruthy();
  });


  it('cancel event is emitted', function() {
    let dragendCalled = false;
    let drake = dragula([this.div], { copy: true });
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    raise(this.item, 'mousedown', { which: 1 });
    raise(this.item, 'mousemove', { which: 1 });
    drake.on('cancel', (target, container) => {
      expect(target.className).toBe('gu-transit');
      expect(target).not.toBe(this.item, 'item is a copy and not the original');
      expect(container).toBe(null);
    });
    drake.on('dragend', () => dragendCalled = true);

    //act
    drake.remove();

    //assert
    expect(dragendCalled).toBeTruthy();
  });
});