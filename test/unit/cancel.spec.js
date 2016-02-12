import {dragula} from '../../src/dragula';

describe('cancel does not throw when not dragging', function () {
  beforeEach(function() {
    this.drake = dragula();
  })

  it('a single time', function() {
    let test = () => this.drake.cancel()
    expect(test).not.toThrow();
  });

  it('multiple times', function() {
    let test = () => {
      this.drake.cancel();
      this.drake.cancel();
      this.drake.cancel();
      this.drake.cancel();
    };
    expect(test).not.toThrow();
  });
});

describe('cancelling a drag operation', function() {
  beforeEach(function() {
    this.div = document.createElement('div');
    this.item = document.createElement('div');
    this.drake = dragula([this.div]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);

    this.targetParam;
    this.containerParam;
    this.sourceParam;

    this.dragendCalled = false;
    this.onDragend = () => {
      this.dragendCalled = true;
    };
    this.drake.on('dragend', this.onDragend);

    this.onCancel = (target, container, source) => {
      this.targetParam = target;
      this.containerParam = container;
      this.sourceParam = source;
    };
    this.drake.on('cancel', this.onCancel);
  });

  it('should leave the DOM the same', function() {
    //arrange
    this.drake.start(this.item);

    //act
    this.drake.cancel();

    //assert
    expect(this.div.children.length).toBe(1);
    expect(this.drake.dragging).toBeFalsy();
  });

  it('should emit the cancel event', function() {
    //arrange
    this.drake.start(this.item);

    //act
    this.drake.cancel();

    //assert
    expect(this.targetParam).toBe(this.item);
    expect(this.containerParam).toBe(this.div);
    expect(this.dragendCalled).toBeTruthy();
  });

  it('should not revert by default', function() {
    //arrange
    let div2 = document.createElement('div');
    let drake = dragula([this.div, div2]);
    this.div.appendChild(this.item);
    document.body.appendChild(this.div);
    document.body.appendChild(div2);
    drake.start(this.item);
    div2.appendChild(this.item);
    let targetParam;
    let parentParam;
    let sourceParam;


    drake.on('drop', (target, parent, source) => {
      targetParam = target;
      parentParam = parent;
      sourceParam = source;
    });
    drake.on('dragend', this.onDragend);

    //act
    drake.cancel();

    //assert
    expect(this.dragendCalled).toBeTruthy();
    expect(targetParam).toBe(this.item);
    expect(parentParam).toBe(div2);
    expect(sourceParam).toBe(this.div);
  });

  it('should revert when dragging a copy', function() {
    //arrange
    var div2 = document.createElement('div');
    var drake = dragula([this.div, div2]);
    document.body.appendChild(this.div);
    document.body.appendChild(div2);
    drake.start(this.item);
    div2.appendChild(this.item);
    drake.on('cancel', this.onCancel);
    drake.on('dragend', this.onDragend);

    //act
    drake.cancel(true);

    //assert
    expect(this.dragendCalled).toBeTruthy();
    expect(this.targetParam).toBe(this.item);
    expect(this.containerParam).toBe(this.div);
  });
});