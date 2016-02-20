import {createDragula} from './lib/create-dragula';

describe('end', function() {

  describe('does not throw when not dragging', function() {

    beforeEach(function() {
      this.drake = createDragula();
    });

    it('a single time', function() {
      let test = () => this.drake.end()

      expect(test).not.toThrow();
    });

    it('multiple times', function() {
      let test = () => {
        this.drake.end();
        this.drake.end();
        this.drake.end();
        this.drake.end();
      };

      expect(test).not.toThrow();
    });
  });

  beforeEach(function() {
    this.div = document.createElement('div');
    this.item1 = document.createElement('div');
    this.item2 = document.createElement('div');

    this.div.appendChild(this.item1);
    this.div.appendChild(this.item2);
    document.body.appendChild(this.div);
  });

  it('when already dragging, .end() ends (cancels) previous drag', function() {
    var drake = createDragula([this.div]);

    drake.manualStart(this.item1);

    drake.on('dragend', (item) => {
      expect(item).toBe(this.item1, 'dragend invoked with correct item');
    });
    drake.on('cancel', (item, source) => {
      expect(item).toBe(this.item1, 'cancel invoked with correct item');
      expect(source).toBe(this.div, 'cancel invoked with correct source');
    });

    drake.end();

    expect(drake.dragging).toBeFalsy('final state is: drake is not dragging');
  });

  it('when already dragged, ends (drops) previous drag', function() {
    var div2 = document.createElement('div');
    var drake = createDragula([this.div, this.div2]);
    document.body.appendChild(div2);

    drake.manualStart(this.item1);

    div2.appendChild(this.item1);

    drake.on('dragend', (item) => {
      expect(item).toBe(this.item1, 'dragend invoked with correct item');
    });
    drake.on('drop', (item, target, source) => {
      expect(item).toBe(this.item1, 'drop invoked with correct item');
      expect(source).toBe(this.div, 'drop invoked with correct source');
      expect(target).toBe(div2, 'drop invoked with correct target');
    });

    drake.end();

    expect(drake.dragging).toBeFalsy('final state is: drake is not dragging');
  });
});
