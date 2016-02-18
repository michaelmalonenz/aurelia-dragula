import {Dragula} from '../../../src/aurelia/dragula';
import {Options} from '../../../src/aurelia/options';

describe('cancel does not throw when not dragging', function () {
  beforeEach(function() {
    this.drake = new Dragula();
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
    this.options = new Options();
    this.options.containers = [this.div];
    this.drake = new Dragula(this.options);
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
    this.drake.manualStart(this.item);

    //act
    this.drake.cancel();

    //assert
    expect(this.div.children.length).toBe(1);
    expect(this.drake.dragging).toBeFalsy();
  });

  it('should emit the cancel event', function() {
    //arrange
    this.drake.manualStart(this.item);

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
    this.options = new Options();
    this.options.containers = [this.div, div2];
    let drake = new Dragula(this.options);
    this.div.appendChild(this.item);
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
    drake.cancel();

    //assert
    expect(this.dragendCalled).toBeTruthy();
  });

  it('should revert when dragging a copy', function() {
    //arrange
    var div2 = document.createElement('div');
    this.options = new Options();
    this.options.containers = [this.div, div2];
    let drake = new Dragula(this.options);
    document.body.appendChild(this.div);
    document.body.appendChild(div2);
    drake.manualStart(this.item);
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

  it('returns the item to original position, including comment nodes', function() {
    //arrange
    let siblingInnerHtml = '<!--<view>--><div class="testDiv"></div><!--</view>-->'
    let sibling = document.createElement('div');
    sibling.innerHTML = siblingInnerHtml;
    let drake = new Dragula(new Options());
    document.body.appendChild(sibling);
    let item = sibling.querySelector('.testDiv');
    expect(item).not.toBeNull();

    //act
    drake.manualStart(item);
    drake.cancel();
    
    //assert
    expect(sibling.innerHTML).toBe(siblingInnerHtml, 'nothing happens');
    expect(drake.dragging).toBeFalsy('drake has stopped dragging');
  });
});