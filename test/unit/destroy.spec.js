import {dragula} from '../../src/dragula';

describe('destroy', function() {
  beforeEach(function() {
    this.drake = dragula();
  })

  it('does not throw when not dragging, destroyed, or whatever when called once', function() {
    expect(this.drake.destroy).not.toThrow();
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
    let drake = dragula([this.div]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    drake.start(this.item);

    //act
    drake.destroy();

    //assert
    expect(this.div.children.length).toBe(1);
    expect(drake.dragging).toBe(false);
  });

  it('when dragging and destroy gets called, dragend event is emitted gracefully', function() {
    //arrange
    let drake = dragula([this.div]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    drake.on('dragend', () => this.dragendCalled = true);
    drake.start(this.item);
    
    //act
    drake.destroy();

    //assert
    expect(this.dragendCalled).toBeTruthy();
  });

  it('when dragging a copy and destroy gets called, default does not revert', function() {
    let div2 = document.createElement('div');
    let drake = dragula([this.div, div2]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    document.body.appendChild(div2);
    drake.start(this.item);
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
    let drake = dragula([this.div, div2], { revertOnSpill: true });
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    document.body.appendChild(div2);
    drake.start(this.item);
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
